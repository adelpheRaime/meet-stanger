"use strict";
const jwt = require("jsonwebtoken");
exports.webSocket = (io) => {
  let users = [];
  //add user
  const addUser = (userId, socketId) => {
    const index = users.findIndex((user) => user.userId === userId);
    if (index !== -1) {
      users[index] = { userId, socketId };
    } else {
      users.push({ userId, socketId });
    }
  };
  //get user
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  //remove user
  const removeUser = (userId) => {
    console.log(userId);
    users = users.filter((user) => user.userId !== userId);
  };
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          return;
        } else {
          socket.userId = decode._id;
          next();
        }
      });
    } else {
      return;
    }
  });
  io.on("connection", (socket) => {
    addUser(socket.userId, socket.id);
    io.emit("getUsers", users);
    //message
    socket.on("sendMsg", (content) => {
      const receivedBy = content.receivedBy;
      const onlineUsr = getUser(receivedBy);
      if (onlineUsr) {
        io.to(onlineUsr.socketId).emit("getMsg", content);
      }
    });
    //notification
    socket.on("sendInbox", (content) => {
      const receivedBy = content.receivedBy;
      const onlineUsr = getUser(receivedBy);
      if (onlineUsr) {
        io.to(onlineUsr.socketId).emit("getInbox", content);
      }
    });
    //force user to disconnect
    socket.on("end", () => {
      removeUser(socket.userId);
      io.emit("getUsers", users);
      socket.disconnect(true);
    });
    //remove user and disconnect
    socket.on("disconnect", () => {
      removeUser(socket.userId);
      io.emit("getUsers", users);
      console.log(users);
    });
  });
};
