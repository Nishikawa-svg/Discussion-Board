import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Axios from 'axios';

export default function ChatRoom({userName,chatRooms,setChatRooms}){
    useEffect(() => {
        console.log('chat room mounted');
        Axios.get('http://localhost:3333/getchatrooms')
            .then(response => {
                console.log(response.data);
                setChatRooms(response.data);
            })
        return () => {console.log('chat room unmounted')};
    },[]);

    return(
        <>
            <h1>Hey! {userName}!</h1>
            <h1>please select chat room</h1>
            {chatRooms.map(room => (
                <div key={room.roomId}>
                    <Link to={`/chat/${room.roomId}_${room.roomName}`}>
                        {room.roomName}
                    </Link>
                </div>
            ))}
            <h3>
                <Link to='/createroom'>
                    create room
                </Link>
            </h3>
        </>
    )
}