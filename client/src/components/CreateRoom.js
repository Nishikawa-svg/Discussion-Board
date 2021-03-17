import React, { useState, useEffect } from "react";
import { Button, Input } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Axios from "axios";

export default function CreateRoom({ userInfo, setChatRooms }) {
  const history = useHistory();
  const [roomName, setRoomName] = useState("");
  useEffect(() => {
    console.log("create room was mounted");
    return () => {
      console.log("create room was unmounted");
    };
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    const newRoom = { roomName: roomName, founderId: userInfo.userId };
    // socket.emit("createRoom", { newRoom });
    Axios.post("http://localhost:3333/createroom", { newRoom }).then(
      (response) => {
        console.log("new room list ->", response.data);
        setChatRooms(response.data);
      }
    );
    alert(`new room ${roomName} created`);
    setRoomName("");
    history.push("/chatroom");
  };
  return (
    <>
      <h1>create room</h1>
      <h1>hey {userInfo.name}</h1>
      <div>
        <Input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="room name"
        />
      </div>
      <div>
        <Button onClick={handleClick}>Create</Button>
      </div>
    </>
  );
}
