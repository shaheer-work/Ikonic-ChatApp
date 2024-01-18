const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const authApi = require("./api/authApi");
const chatApi = require("./api/chatApi");
const SocketManager = require("./SocketManager");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors());
app.use(bodyParser.json());
connectDB();
app.use("/api/auth", authApi);
app.use("/api/chat", chatApi);
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://localhost:3000, https://vlw2.com/chat"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    res.sendStatus(200);
  } else {
    next();
  }
});
app.get("/", (req, res) => {
  res.send("api is running");
});
io.on("connection", SocketManager);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = { io };
