import React from "react";

const callModal = ({ callFrom, startCall, rejectCall, status }) => {
  let classes = ["call-modal"];
  if (status) {
    classes.push("active");
  }

  function AcceptWithVideo(video) {
    const config = { audio: true, video };
    return callFrom && startCall(false, config, callFrom);
  }

  return (
    <div className={classes.join(" ")}>
      <h3>Caller {callFrom} is calling....</h3>
      <div className="flex-container">
        <button
          type="button"
          className="btn-action"
          onClick={() => AcceptWithVideo(true)}
        >
          <i className=" fas fa-video"></i>
        </button>
        <button className="btn-action" onClick={() => AcceptWithVideo(false)}>
          <i className="fas fa-phone"></i>
        </button>
        <button className="btn-action hangup" onClick={rejectCall}>
          <i className="fas fa-phone-slash"></i>
        </button>
      </div>
    </div>
  );
};

export default callModal;
