import React from 'react';
import {Link} from 'react-router-dom';


export default function ChatRoom({userName,chatRooms}){
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
        </>
    )
}