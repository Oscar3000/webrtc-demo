import React from "react";
import socket from "../utils/socket";
import "./Window.css";
import PeerConnection from "../utils/peerConnection";
import _ from "lodash";

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "",
      callFrom: "",
      localSrc: null,
      peerSrc: null
    };
    this.pc = null;
    this.startCallHandler = this.startCall.bind(this);
  }

  componentDidMount() {
    socket
      .on("init", ({ id: clientId }) => {
        console.log(`Client connected by ${clientId}`);
        this.setState({clientId});
      })
      .on("request", ({ from: callFrom }) => {
        console.log(`call coming from ${callFrom}`);
        this.setState({callFrom});
      })
      .on('call', (data) => {
          if(data.sdp) {
              this.pc.setRemoteDescription(data.sdp);
              if(data.sdp.type === 'offer') this.pc.createAnswer();
          } else this.pc.addIceCandidate(data.candidate);
      })
      .on('end', this.endCall.bind(this,false))
      .emit("init");
  }

  startCall(isCaller, config, friendId) {
    this.pc = new PeerConnection(friendId)
    .on('localStream', src => {
        this.setState({ localSrc: src });
    })
    .on('peerStream', src =>{
        this.setState({ peerSrc: src });
    })
    .startPeerConnection(isCaller,config);

  }

  rejectCall() {
      const { callFrom } = this.state;
      socket.emit('end', { to: callFrom });
  }

  endCall(isStarter) {
    if(_.isFunction(this.pc.stopPeerConnection)){
        this.pc.stopPeerConnection(isStarter);
    }

    this.pc = {};
    this.config = null;
    this.setState({
        localSrc: null,
        peerSrc: null,
    })
  }
  render() {
    return <div className="container">In the window component.</div>;
  }
}

export default Window;
