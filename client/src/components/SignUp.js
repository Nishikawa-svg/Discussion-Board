import React, { useState } from "react";
import {
  Button,
  Input,
  Grid,
  TextField,
  Paper,
  makeStyles,
} from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useHistory } from "react-router-dom";
import Axios from "axios";

const useStyles = makeStyles({
  paper: {
    width: 400,
    textAlign: "center",
  },
  personicon: {
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
    fontsize: 12,
    color: "blue",
  },
});

export default function SignUp() {
  const classes = useStyles();
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
      <Grid container justify="center">
        <Paper className={classes.paper}>
          <Grid container justify="center">
            <Grid item xs={10}>
              <Grid container direction="column">
                <Grid item>
                  <PersonAddIcon
                    color="secondary"
                    className={classes.personicon}
                  />
                </Grid>
                <Grid item>
                  <div className={classes.title}>Sign Up</div>
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
                    Sign up
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
