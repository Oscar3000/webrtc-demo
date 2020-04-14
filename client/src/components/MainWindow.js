import React, { useState } from "react";

function CallWindow({ clientId, startCall }) {
  const [callerId, setCallerId] = useState("");

  const Call = (e, video) => {
    e.preventDefault();
    const config = { audio: true, video };
    if (callerId.trim().length > 0) {
      return startCall(true, config, callerId);
    }
    console.log("Button was clicked");
  };

  return (
    <div>
      <h2>Your Caller Id is {clientId}</h2>
      <div>
        <h3>Welcome, pls insert the callerId below to initiate a call.</h3>
        <div className="flex-container">
          <input
            placeholder="Insert caller Id"
            value={callerId}
            onChange={(e) => setCallerId(e.target.value)}
          />
          <button type="button" className="btn-action" onClick={(e) => Call(e, true)}>
            <i className=" fas fa-video"></i>
          </button>
          <button type="button" className="btn-action" onClick={(e) => Call(e, false)}>
          <i className="fas fa-phone"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CallWindow;
