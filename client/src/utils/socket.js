import io from "socket.io-client";

const socket = io({path: "/peer"});

export default socket;