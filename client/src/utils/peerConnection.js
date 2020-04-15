import socket from "./socket";
import MediaDevice from "./mediaDevice";
import Emitter from "./Emitter";
const PC_CONFIG = { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] };

export default class PeerConnection extends Emitter {
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
      this.conn.ontrack = event => this.emit('peerStream', event.streams[0]);

      this.friendId = friendId;
      this.mediaDevice = new MediaDevice();
    } else {
      alert("This browser doesn't support webRTC.");
    }
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config - configuration for the call {audio: boolean, video: boolean}
   */
  startPeerConnection(isCaller, config) {
    this.mediaDevice
      .on("stream", (stream) => {
        stream.getTracks().forEach((track) => {
          this.conn.addTrack(track, stream);
        });
        this.emit("localStream", stream);
        if (isCaller)
          socket.emit("request", {
            to: this.friendId,
          });
        else this.createOffer();
      })
      .start(config);
    return this;
  }

  /**
   * stop the call
   * @param {Boolean} isStarter
   */
  stopPeerConnection(isStarter) {
    if (isStarter) {
      socket.emit("end", { to: this.friendId });
    }
    this.mediaDevice.stop();
    this.conn.close();
    this.conn = null;
    this.off();
    return this;
  }

  createOffer() {
    this.conn
      .createOffer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  createAnswer() {
    this.conn
      .createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err) => console.log(err));
    return this;
  }

  getDescription(desc) {
    this.conn.setLocalDescription(desc);
    socket.emit("call", { to: this.friendId, sdp: desc });
    return this;
  }

  setRemoteDescription(sdp) {
    const rtcSdp = new RTCSessionDescription(sdp);
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
