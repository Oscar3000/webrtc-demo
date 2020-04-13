import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import "./Window.css";

function Window() {
    const [clientId, setClientId] = useState(null);
    const [callFrom, setCallFrom] = useState(null);
    useEffect(()=>{
        socket.on('init', ({ id: clientId})=>{
            console.log(`Client connected by ${clientId}`);
            setClientId(clientId);
        })
        .on('request', ({ from: callFrom}) => {
            console.log(`call coming from ${callFrom}`);
            setCallFrom(callFrom);
        })
        .emit('init');
    }, [])
    return (
        <div className="container">
            In the window component.
        </div>
    );
}


export default Window;