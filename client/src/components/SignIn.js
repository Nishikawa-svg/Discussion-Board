import React, { useState } from "react";
import {
  Button,
  Input,
  makeStyles,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import { useHistory, Link } from "react-router-dom";
import Axios from "axios";

const useStyles = makeStyles({
  paper: {
    width: 400,
    textAlign: "center",
  },
  lockicon: {
    width: 40,
    height: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    margin: "8px 8px",
  },
  input: {
    height: 40,
    marginBottom: 50,
  },
  button: {
    height: 50,
    marginBottom: 10,
    backgroundColor: "#1870DB",
    color: "white",
    "&:hover": {
      backgroundColor: "blue",
    },
  },
  link: {
    textDecoration: "none",
    fontSize: 14,
    color: "blue",
  },
});

export default function LogInForm({ setUserInfo }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();
  const classes = useStyles();

  const handleClick = (e) => {
    e.preventDefault();
    //alert(`name : ${name}\npassword : ${password}`);
    const userInfo = { name: name, password: password };
    Axios.post("http://localhost:3333/login", { userInfo }).then((response) => {
      if (response.data.authentication) {
        console.log(response.data);
        setUserInfo(response.data.userInfo);
        alert(response.data.message);
        history.push("/chatroom");
      } else {
        alert(response.data.message);
      }
    });

    setName("");
    setPassword("");
  };

  return (
    <div>
      <h1>my chat app</h1>
      <Grid container justify="center">
        <Paper className={classes.paper}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Grid container direction="column">
                <Grid item>
                  <LockIcon color="secondary" className={classes.lockicon} />
                </Grid>
                <Grid item>
                  <div className={classes.title}>Sign In</div>
                </Grid>
                <Grid container justify="flex-start">
                  <Grid item>Username</Grid>
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.input}
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid container justify="flex-start">
                  <Grid item>Password</Grid>
                </Grid>
                <Grid item>
                  <TextField
                    className={classes.input}
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item>
                  <Button
                    className={classes.button}
                    fullWidth
                    variant="contained"
                    onClick={handleClick}
                  >
                    Sign in
                  </Button>
                </Grid>
                <Grid container justify="flex-end">
                  <Link to="signup" className={classes.link}>
                    Don't hane an account? Sign UP
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </div>
  );
}
