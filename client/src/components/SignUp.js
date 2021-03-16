import React, { useState } from "react";
import { Button, Input } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Axios from "axios";

export default function SinUp() {
  let history = useHistory();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleClick = (e) => {
    e.preventDefault();
    const signUpUser = { name: name, password: password };
    Axios.post("http://localhost:3333/signup", { signUpUser }).then(
      (response) => {
        console.log(response.data);
        if (response.data.authentication) {
          alert(response.data.message);
          history.push("/");
        }
      }
    );
  };
  return (
    <>
      <h1>Sing up</h1>
      <div>
        <Input
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div>
        <Input
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div>
        <Button onClick={handleClick}>register</Button>
      </div>
    </>
  );
}
