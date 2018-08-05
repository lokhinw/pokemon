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

const searchForRoom = room => {
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].room === room) {
      return rooms[i];
    }
  }
};

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `${getCurrentTime()}: SERVER STARTED LISTENING ON PORT ${process.env.PORT ||
      3000}`
  );
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  connections.push(socket);
  console.log(`${getCurrentTime()}: USER HAS CONNECTED`);
  console.log(`${getCurrentTime()}: TOTAL CONNECTIONS: ${connections.length}`);

  socket.on("join room", data => {
    if (!searchForRoom(data.room)) {
      rooms.push(data);
      socket.join(data.room);
      console.log(
        `${getCurrentTime()}: ${data.users[0].toUpperCase()} HAS JOINED ROOM ${
          data.room
        }`
      );
    } else {
      if (searchForRoom(data.room).users.length <= 1 && searchForRoom(data.room).users[0] != data.users[0]) {
        searchForRoom(data.room).users.push(data.users[0]);
        socket.join(data.room);
      } else {
        searchForRoom(data.room).users.length >= 2 ? socket.emit("error message", "room is full") : socket.emit("error message", "username is already taken");
      }
    }
    console.log(rooms)
    io.to(data.room).emit("hello", "hello world!");
  });

  socket.on("disconnect", () => {
    connections.splice(connections.indexOf(socket), 1);
    console.log(`${getCurrentTime()}: USER HAS DISCONNECTED`);
    console.log(
      `${getCurrentTime()}: TOTAL CONNECTIONS: ${connections.length}`
    );
  });
});
