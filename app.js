const path = require("path");
const http = require("http");
const express = require("express");
const socket = require("./lib/socket");
const app = express();
const server = http.createServer(app);

//Set static folder
app.use(express.static(path.join(__dirname, "client/dist")));

server.listen(process.env.PORT || 5000, () => {
  socket(server);
  console.log(`server started on port ${process.env.PORT || 5000}`);
});
