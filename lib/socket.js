const socketIo = require("socket.io");
const users = require("./users");

function InitSocket(socket) {
    let id;
    socket.on('init', async () => {
       id =  await users.create(socket);
       socket.emit('init', { id });
    })
    .on('request', (data) => {
        const receiver = users.get(data.to);
        if(receiver) {
            receiver.emit('request', { from: id});
        }
    })
    .on('call', (data) => {
        const receiver = users.get(data.to);
        if(receiver) {
            receiver.emit('call', { ...data, from: id});
        } else {
            socket.emit('failed');
        }
    })
    .on('end', (data) => {
        const receiver = users.get(data.to);
        if(receiver) {
            receiver.emit('end');
        }
    })
    .on('disconnect', () => {
        users.remove(id);
        console.log("user has left");
    });
}

module.exports = (server) => {
    socketIo({ path: '/peer'})
    .listen(server, { log: true})
    .on('connection', InitSocket);
}