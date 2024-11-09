const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const { log } = require("console");
const { addUser, findUser, getRoomUsers, leaveRoom } = require("./users");
const app = express();

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET, POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }) => {
    socket.join(room);
    const { user, isExist } = addUser({ name, room });
    const numberOfUsers = getRoomUsers(room);
    const userMessage = isExist
      ? `${user.name}, nice to see you again`
      : `${user.name}, You are on the right track`;
    socket.emit("message", {
      data: {
        user: { name: "Admin" },
        message: userMessage,
      },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { name: "Admin" },
        message: `${user.name} has joined`,
      },
    });
    socket.on("leave Room", () => {
      const userLeft = leaveRoom(user);
      console.log("userLeft", userLeft);
      if (userLeft) {
        io.to(user.room).emit("number of users", numberOfUsers);

        io.to(user.room).emit("message", {
          data: {
            user: { name: "Admin" },
            message: `${user.name} has left the building`,
          },
        });
      }
    });

    io.to(user.room).emit("number of users", numberOfUsers);
  });
  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);
    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

server.listen(5000, () => {
  console.log("Server is running", "http://localhost:5000");
});
