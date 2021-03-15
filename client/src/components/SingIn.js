import React, {useState} from 'react';
import {
    Button,Input,
} from '@material-ui/core';
import {useHistory, Link} from 'react-router-dom';
import Axios from 'axios';

export default function LogInForm({setUserInfo}){
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();

    const handleClick = (e) => {
        e.preventDefault();
        //alert(`name : ${name}\npassword : ${password}`);
        const userInfo = {name : name, password : password};
        Axios.post('http://localhost:3333/login', {userInfo})
            .then(response => {
                if(response.data.authentication){
                    setUserInfo({name : name, password : password});
                    alert(response.data.message);
                    history.push('/chatroom');
                }
                else{
                    alert(response.data.message);
                }
            })

        setName('');
        setPassword('');
    }

    return(
        <>
			<h1>my chat app</h1>
            <h1>Sing In</h1>
            <div>
                <Input placeholder="name" value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <div>
                <Input placeholder="password" value={password} onChange={e => setPassword(e.target.value)}/>             
            </div>
            <div>
                <Button onClick={handleClick}>Enter</Button>                
            </div>
            <Link to='singup'>Sing up</Link>
        </>
    )
}