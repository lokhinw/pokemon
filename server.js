const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

let connections = [];
let rooms = [];

const getCurrentTime = () =>
  new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");

server.listen(process.env.PORT || 3000, () => {
  console.log(`${getCurrentTime()}: SERVER STARTED LISTENING ON PORT ${process.env.PORT || 3000}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  connections.push(socket);
  console.log(`${getCurrentTime()}: USER HAS CONNECTED`);
  console.log(`${getCurrentTime()}: TOTAL CONNECTIONS: ${connections.length}`);

  socket.on("join room", (data) => {
    rooms.push(data);
    socket.join(data.room);
    io.to(data.room).emit("hello", "hello world!");
    console.log(`${getCurrentTime()}: ${data.user.toUpperCase()} HAS JOINED ROOM ${data.room}`);
  });



  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`${getCurrentTime()}: USER HAS DISCONNECTED`);
    console.log(`${getCurrentTime()}: TOTAL CONNECTIONS: ${connections.length}`);
  });
});
