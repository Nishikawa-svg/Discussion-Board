import React, { useState, useEffect } from "react";
import { Button, Input } from "@material-ui/core";
import io from "socket.io-client";
import Axios from "axios";

const ENDPOINT = "http://localhost:3333";
let socket;

export default function Chat({ roomId, roomName, userName }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  //console.log(roomId,'loaded');
  useEffect(() => {
    socket = io(ENDPOINT);
    //console.log(socket);
    console.log(roomId, "Chat component was mounted");
    Axios.post("http://localhost:3333/load", { roomId: roomId }).then(
      (response) => {
        console.log("loaded messages ->", response.data);
        setMessages(response.data);
      }
    );
    socket.on("newMessage", (messageList) => {
      console.log("new message list ->", messageList);
      setMessages(messageList);
    });
    return () => {
      socket.disconnect();
      console.log(roomId, "Chat component was unmounted");
    };
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    const sendMessage = { roomId: roomId, name: userName, content: text };
    socket.emit("sendMessage", { sendMessage });
    alert(text);
    setText("");
  };
  return (
    <>
      <h1>Chat room : {roomName}</h1>
      {messages.map((m) => (
        <div key={m.content}>
          {m.name} : {m.content}
        </div>
      ))}
      <div>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="message..."
        />
      </div>
      <div>
        <Button onClick={handleClick}>send</Button>
      </div>
    </>
  );
}
