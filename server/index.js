const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
//const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended : true}));
const port = 3333;
app.use(cors());
app.use(express.json());

const debugMode = true;

let userList = [];
let messageList = [];
let roomList = [];
if (debugMode) {
  userList = [
    { userId: 0, name: "admin", password: "password" },
    { userId: 1, name: "one", password: "password" },
    { userId: 2, name: "two", password: "password" },
    { userId: 3, name: "three", password: "password" },
    { userId: 4, name: "four", password: "password" },
  ];
  roomList = [
    { roomId: 1, roomName: "room1", founderId: 0, lastUpdate: "", comments: 1 },
    { roomId: 2, roomName: "room2", founderId: 0, lastUpdate: "", comments: 1 },
    { roomId: 3, roomName: "room3", founderId: 0, lastUpdate: "", comments: 1 },
    { roomId: 4, roomName: "room4", founderId: 0, lastUpdate: "", comments: 1 },
  ];
  messageList = [
    [
      {
        name: "admin",
        content: "welcome to chat room1",
        submissionTime: Date.now(),
      },
    ],
    [
      {
        name: "admin",
        content: "welcome to chat room2",
        submissionTime: Date.now(),
      },
    ],
    [
      {
        name: "admin",
        content: "welcome to chat room3",
        submissionTime: Date.now(),
      },
    ],
    [
      {
        name: "admin",
        content: "welcome to chat room4",
        submissionTime: Date.now(),
      },
    ],
  ];
}

app.post("/signup", (req, res) => {
  console.log("signup ->", req.body);
  const newUserList = [
    ...userList,
    {
      userId: userList.length,
      name: req.body.signUpUser.name,
      password: req.body.signUpUser.password,
    },
  ];
  userList = newUserList;
  console.log(newUserList);
  const msg = { authentication: true, message: "Successful registration" };

  res.send(msg);
});

app.post("/login", (req, res) => {
  console.log("login ->", req.body);
  const name = req.body.userInfo.name;
  const password = req.body.userInfo.password;
  let valid = false;
  let id = -1;
  userList.map((user) => {
    // console.log(user.name,name,user.password,password);
    if (user.name === name && user.password === password) {
      valid = true;
      id = user.userId;
    }
  });
  let msg;
  if (valid) {
    msg = {
      authentication: true,
      message: "Login was successful",
      userInfo: userList[id],
    };
  } else msg = { authentication: false, message: "Login failed" };
  res.send(msg);
});

app.post("/load", (req, res) => {
  const roomId = req.body.roomId;
  console.log("load request from userId :", roomId);
  console.log("messageList", messageList);
  res.send(messageList[roomId - 1]);
});

app.get("/getchatrooms", (req, res) => {
  //console.log('get chat rooms ->',roomList);
  res.send(roomList);
});

app.post("/createroom", (req, res) => {
  console.log("createroom", req.body);
  let newRoom = req.body.newRoom;
  const roomId = roomList.length + 1;
  newRoom = {
    ...newRoom,
    roomId: roomId,
    lastUpdate: Date.now(),
    comments: 0,
  };
  roomList.push(newRoom);
  messageList.push([
    {
      name: "admin",
      content: `welcome to chat ${req.body.newRoom.roomName}`,
      submissionTime: Date.now(),
    },
  ]);
  res.send(roomList);
});

io.on("connection", (socket) => {
  console.log(socket.id, "is connecting");

  socket.on("sendMessage", (input) => {
    console.log(input);
    const { roomId, name, content } = input.sendMessage;
    // console.log(input.sendMessage.name);
    // console.log(input.sendMessage.content);
    messageList[roomId - 1].push({
      name: name,
      content: content,
      submissionTime: Date.now(),
    });
    console.log("new message list", messageList);
    io.emit("newMessage", messageList[roomId - 1]);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "was disconnected");
  });
});

httpServer.listen(port, () => console.log(`server running on *:${port}`));
