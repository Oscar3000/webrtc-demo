import socket from "./socket";
import MediaDevice from "./mediaDevice";

const PC_CONFIG = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };

export default class PeerConnection {
  constructor(friendId) {
    super();
    if (hasRTCPeerConnection()) {
      this.conn = new window.RTCPeerConnection(PC_CONFIG);
      this.conn.onicecandidate = function (event) {
        socket.emit("call", {
          to: this.friendId,
          candidate: event.candidate,
        });
      };
       
      this.friendId = friendId;
      this.mediaDevice = new MediaDevice();
    } else {
      alert("This browser doesn't support webRTC.");
    }
  }

  startPeerConnection(user) {
    this.mediaDevice;
  }

  createOffer() {
    this.conn
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
      return this;
  }

  createAnswer() {
      this.conn.createAnswer()
          .then(this.getDescription.bind(this))
          .catch(err => console.log(err));
  }

  getDescription(desc) {
    this.conn.setLocalDescription(desc);
    socket.emit("call", { to: this.friendId, sdp: desc });
    return this;
  }

  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(desc);
    this.conn.setRemoteDescription(rtcSdp);
    return this;
  }

  addIceCandidate(candidate) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.conn.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

function hasRTCPeerConnection() {
  window.RTCPeerConnection =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;
  window.RTCSessionDescription =
    window.RTCSessionDescription ||
    window.webkitRTCSessionDescription ||
    window.mozRTCSessionDescription;
  window.RTCIceCandidate =
    window.RTCIceCandidate ||
    window.webkitRTCIceCandidate ||
    window.mozRTCIceCandidate;
  return !!window.RTCPeerConnection;
}
