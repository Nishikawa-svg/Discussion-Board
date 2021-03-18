const express = require("express");
const app = express();
const http = require("http");
const httpServer = http.createServer(app);
const cors = require("cors");
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});
const port = 3333;
app.use(cors());
app.use(express.json());

const debugMode = true;

let userList = [];
let messageList = [];
let roomList = [];
if (debugMode) {
  const sampleCase = require("./sampleCase");
  userList = sampleCase.sampleUserList;
  messageList = sampleCase.sampleMessageList;
  roomList = sampleCase.smapleRoomList;
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
  console.log("load request from roomId :", roomId);
  // console.log("messageList", messageList);
  const founderId = roomList[roomId - 1].founderId;
  const foundedDate = roomList[roomId - 1].foundedDate;
  let founderName;
  userList.map((person) => {
    if (person.userId === founderId) founderName = person.name;
  });
  const founderInfo = {
    founderId: founderId,
    founderName: founderName,
    foundedDate: foundedDate,
  };
  loadedData = { msg: messageList[roomId - 1], founderInfo: founderInfo };
  console.log("loaded room data and all messages ->", loadedData);
  res.send(loadedData);
});

app.get("/getchatrooms", (req, res) => {
  res.send(roomList);
});

app.post("/createroom", (req, res) => {
  console.log("createroom", req.body);
  let newRoom = req.body.newRoom;
  const roomId = roomList.length + 1;
  newRoom = {
    ...newRoom,
    roomId: roomId,
    foundedDate: Date.now(),
    lastUpdate: Date.now(),
    comments: 1,
  };
  roomList.push(newRoom);
  messageList.push([
    {
      name: "admin",
      content: `welcome to ${req.body.newRoom.roomName}`,
      submissionTime: Date.now(),
    },
  ]);
  res.send(roomList);
});

io.on("connection", (socket) => {
  console.log(socket.id, "is connecting");

  socket.on("sendMessage", (input) => {
    console.log("recieved msg ->", input);
    const { roomId, name, content } = input.sendMessage;
    // console.log(input.sendMessage.name);
    // console.log(input.sendMessage.content);
    messageList[roomId - 1].push({
      name: name,
      content: content,
      submissionTime: Date.now(),
    });
    roomList[roomId - 1].lastUpdate = Date.now();
    roomList[roomId - 1].comments++;
    // console.log("new message list", messageList);
    io.emit("newMessage", messageList[roomId - 1]);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "was disconnected");
  });
});

httpServer.listen(port, () => console.log(`server running on *:${port}`));
