import React, {useState,useEffect} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import SingIn from './components/SingIn';
import SingUp from './components/SingUp';
import ChatRoom from './components/ChatRoom';
import Chat from './components/Chat';
import {chatRooms} from './components/sampleData.js';


const initialState = {
  userInfo : {name : '', password : ''},
}

function App() {
  const [userInfo, setUserInfo] = useState(initialState.userInfo);
  useEffect(() => {
    console.log('userInfo ->',userInfo);
  },[userInfo])
  console.log('room list',chatRooms);
  return (
    <div className="App">
      <Router>
        <Route path='/' exact>
          <SingIn 
            setUserInfo={setUserInfo}
          />
        </Route>
        <Route path='/singup'>
          <SingUp />
        </Route>
        <Route path='/chatroom' exact>
          <ChatRoom 
            userName={userInfo.name}
            chatRooms={chatRooms}
          />
        </Route>
        {chatRooms.map(room => (
          <Route path={`/chat/${room.roomId}_${room.roomName}`} exact key={room.roomId}>
            <Chat 
              roomId={room.roomId}
              roomName={room.roomName}
              userName={userInfo.name}
            />
          </Route>
        ))}
      </Router>
    </div>
  );
}

export default App;
