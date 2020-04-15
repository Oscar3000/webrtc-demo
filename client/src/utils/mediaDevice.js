import _ from "lodash";
import Emitter from "./Emitter";

export default class MediaDevice extends Emitter {
  /**
   * Start media devices and send stream
   */
  start() {
    const constraints = {
      // video: {
      //   facingMode: "user",
      //   height: {
      //     min: 360,
      //     ideal: 720,
      //     max: 1080,
      //   },
      // },
      video: false,
      audio: true,
    };

    if (hasUserMedia()) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.stream = stream;
          this.emit("stream", stream);
        })
        .catch((err) => {
          if (err instanceof DOMException) {
            console.log(err);
            alert("Cannot open webcam and microphone");
          } else {
            console.log(err);
          }
        });
    } else {
      alert("This browser doesn't support webRtc");
    }
    return this;
  }

  /**
   * Turn on/off a device
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, "enabled", state);
      });
    }
    return this;
  }

  /**
   * Stop all media track of devices
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    return this;
  }
}

function hasUserMedia() {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;
  return !!navigator.getUserMedia;
}
