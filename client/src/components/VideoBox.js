import React, { useRef, useEffect } from "react";


const VideoBox = ({ localSrc, peerSrc, mediaDevice, config, endCall }) => {
    const localVideo = useRef(null);
    const remoteVideo = useRef(null)

    useEffect(() => {
        if(remoteVideo.current && peerSrc) remoteVideo.current.srcObject = peerSrc;
        if(localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
    });

    return (
        <div className="videoContainer">
            <video id="remoteVideo" autoPlay muted ref={remoteVideo}></video>
            <video id="localVideo" autoPlay ref={localVideo}></video>
            <div className="controls">
                <button
                 className="btn btn-action"
                 onClick={() => endCall(true)}
                > End Call</button>
            </div>
        </div>
    )
}

export default VideoBox;