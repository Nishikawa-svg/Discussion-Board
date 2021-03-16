import React, {useState,useEffect} from 'react';
import {
    Button,Input,
} from '@material-ui/core';
import io from 'socket.io-client';
const ENDPOINT = 'http://localhost:3333';
let socket;
export default function CreateRoom({userInfo,setChatRooms}){
    const [roomName, setRoomName] = useState('');
    useEffect(() => {
        console.log('create room was mounted');
        socket = io(ENDPOINT);
        socket.on('newRoom',(roomList) => {
            setChatRooms(roomList);
        });
        return () => {
            console.log('create room was unmounted')
            socket.disconnect();
        }
    },[]);
    const handleClick = (e) => {
        e.preventDefault();
        const newRoom = {roomName : roomName, founderId : userInfo.userId};
        socket.emit('createRoom',{newRoom});
        alert(`new room ${roomName} created`);
        setRoomName('');
    }
    return(
        <>
            <h1>create room</h1>
            <h1>hey {userInfo.name}</h1>
            <div>
                <Input value={roomName} onChange={e=>setRoomName(e.target.value)} placeholder='room name'/>
            </div>
            <div>
                <Button onClick={handleClick}>Create</Button>
            </div>
        </>
    )
}