import React from "react";
import _ from "lodash";
import socket from "./utils/socket";
import "./sass.scss";
import PeerConnection from "./utils/peerConnection";
import MainWindow from "./components/MainWindow";
import VideoBox from "./components/VideoBox";
import CallModal from "./components/CallModal";

class Window extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: "",
      callFrom: "",
      localSrc: null,
      peerSrc: null,
      callModal: true,
      callWindow: false
    };
    this.pc = null;
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
  }

  componentDidMount() {
    socket
      .on("init", ({ id: clientId }) => {
        console.log(`Client connected by ${clientId}`);
        this.setState({ clientId });
      })
      .on("request", ({ from: callFrom }) => {
        console.log(`call coming from ${callFrom}`);
        this.setState({ callFrom, callModal: true });
      })
      .on("call", (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === "offer") this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on("end", this.endCall.bind(this, false))
      .emit("init");
  }

  startCall(isCaller, config, friendId) {
    this.config = config;
    this.pc = new PeerConnection(friendId)
      .on("localStream", (src) => {
        const newState = { callWindow: true, localSrc: src };
        if (!isCaller) newState.callModal = false;
        this.setState(newState);
      })
      .on("peerStream", (src) => {
        this.setState({ peerSrc: src });
      })
      .startPeerConnection(isCaller, config);
  }

  rejectCall() {
    const { callFrom } = this.state;
    //socket.emit("end", { to: callFrom });
    this.setState({ callModal: false });
  }

  endCall(isStarter) {
    if (_.isFunction(this.pc.stopPeerConnection)) {
      this.pc.stopPeerConnection(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      localSrc: null,
      peerSrc: null,
      callWindow: false
    });
  }
  render() {
    const { clientId, callFrom, localSrc, peerSrc, callModal } = this.state;
    return (
      <div className="container">
        <MainWindow clientId={clientId} startCall={this.startCallHandler} />
        {!_.isEmpty(this.config) && (
          <VideoBox
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
          />
        )}
        <CallModal
          startCall={this.startCallHandler}
          callFrom={callFrom}
          rejectCall={this.rejectCallHandler}
          status={callModal}
        />
      </div>
    );
  }
}

export default Window;
