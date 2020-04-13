const uuid = require("uuid-random");
const users = {};

async function generateId() {
  let id = uuid();
  while (id in users) {
    console.log("users:", users);
    id = uuid();
  }
  return id;
}

exports.create = async (socket) => {
  const id = await generateId();
  users[id] = socket;
  return id;
};

exports.get = (id) => users[id];

exports.remove = (id) => delete users[id];
