const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server started...");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", socket => {
  socket.emit("hello", { data: "Hello World!" });
});
