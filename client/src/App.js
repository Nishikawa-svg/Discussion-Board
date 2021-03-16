import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ChatRoom from "./components/ChatRoom";
import Chat from "./components/Chat";
import CreateRoom from "./components/CreateRoom";

const initialState = {
  userInfo: { userId: null, name: "", password: "" },
};

const useStyles = makeStyles({
  // app : {backgroundColor : 'blue'},
});

function App() {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState(initialState.userInfo);
  const [chatRooms, setChatRooms] = useState([]);
  useEffect(() => {
    console.log("userInfo ->", userInfo);
  }, [userInfo]);
  console.log("room list", chatRooms);
  return (
    <div className={classes.app}>
      <Router>
        <Route path="/" exact>
          <SignIn setUserInfo={setUserInfo} />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/chatroom" exact>
          <ChatRoom
            userName={userInfo.name}
            setChatRooms={setChatRooms}
            chatRooms={chatRooms}
          />
        </Route>
        {chatRooms.map((room) => (
          <Route
            path={`/chat/${room.roomId}_${room.roomName}`}
            exact
            key={room.roomId}
          >
            <Chat
              roomId={room.roomId}
              roomName={room.roomName}
              userName={userInfo.name}
            />
          </Route>
        ))}
        <Route path="/createroom" exact>
          <CreateRoom userInfo={userInfo} setChatRooms={setChatRooms} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
