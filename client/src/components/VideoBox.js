import React, { useRef, useEffect } from "react";

const VideoBox = ({ localSrc, peerSrc, endCall, active }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  let classes = ["videoContainer"];
  if (active) {
    classes.push("active");
  }
  useEffect(() => {
    if (remoteVideo.current && peerSrc) remoteVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  const mediaToggle = (type) => {
      console.log(`toggled ${type}`);
  }
  return (
    <div className={classes.join(" ")}>
      <video id="remoteVideo" autoPlay muted ref={remoteVideo}></video>
      <video id="localVideo" autoPlay ref={localVideo}></video>
      <div className="video-control">
        <button className="btn-action" onClick={() => mediaToggle("audio")}>
        <i className="fas fa-microphone"></i>
        </button>
        <button className="btn-action" onClick={() => mediaToggle("video")}>
            {/** on toggle replace with video-slash or microphone-slash for audio */}
            <i className=" fas fa-video"></i>
        </button>
        <button className="btn-action hangup" onClick={() => endCall(true)}>
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoBox;
