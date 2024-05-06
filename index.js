const express = require("express")
const http = require("http");
const { Server } = require("socket.io"); // Server 객체 불러오기 추가
const cors = require('cors')
const app = express();
const port = 3001

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors : {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 메시지 받기 이벤트 핸들러
  socket.on("send'em", (data) => {
    console.log(`Message from ${socket.id}: ${data.message}`);

    // 메시지를 성공적으로 받았음을 클라이언트에 알림
    socket.emit("received_message", {
      status: "success",
      message: "Message received",
      data: data
    });

    socket.broadcast.emit('received_message', data);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log("SERVER IS RUNNING");
});