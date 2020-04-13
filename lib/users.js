const { v4:uuid } = require("uuid");
const users = {};

const v4options = {
    random: [
      0x10,
      0x91,
      0x56,
      0xbe,
      0xc4,
      0xfb,
      0xc1,
      0xea,
      0x71,
      0xb4,
      0xef,
      0xe1,
      0x67,
      0x1c,
      0x58,
      0x36,
    ],
  };

async function generateId() {
    let id = uuid(v4options);
    while(id in users){
        await Promise.delay(5);
        id = uuid(v4options);
    }
    return id;
}

exports.create = async (socket) => {
    const id = await generateId();
    users[id] = socket;
    return id;
}

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];