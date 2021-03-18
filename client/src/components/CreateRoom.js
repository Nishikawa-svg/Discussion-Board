import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Paper, makeStyles } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Axios from "axios";

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "blue",
  },
  menu: {
    color: "#444444",
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    color: "#444444",
    marginTop: 10,
    marginBottom: 10,
  },
  namebox: {
    width: "100%",
    marginBottom: 10,
  },
  contentbox: {
    width: "100%",
    marginBottom: 10,
  },
  createbutton: {
    textTransform: "none",
    marginBottom: 20,
    width: 100,
  },
});

const initialState = { roomName: "", content: "" };
export default function CreateRoom({ userInfo, setChatRooms }) {
  const classes = useStyles();
  const history = useHistory();
  const [newRoomInfo, setNewRoomInfo] = useState(initialState);
  useEffect(() => {
    console.log("create room was mounted");
    return () => {
      console.log("create room was unmounted");
    };
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    const newRoom = {
      roomName: newRoomInfo.roomName,
      founderId: userInfo.userId,
      content: newRoomInfo.content,
    };
    console.log(newRoom);
    Axios.post("http://localhost:3333/createroom", { newRoom }).then(
      (response) => {
        console.log("new room list ->", response.data);
        setChatRooms(response.data);
      }
    );
    alert(`${newRoom.roomName} + ${newRoom.content}`);
    setNewRoomInfo(initialState);
    history.push("/chatroom");
  };
  return (
    <>
      <Link to="/chatroom" className={classes.link}>
        <Grid container>
          <Grid item>
            <ArrowBackIcon />
          </Grid>
          <Grid item>back to room selection</Grid>
        </Grid>
      </Link>

      <Grid container justify="center">
        <Grid item xs={10}>
          <Paper>
            <Grid container justify="center">
              <Grid item xs={10}>
                <Grid container justify="center">
                  <Grid className={classes.title}>create a new community</Grid>
                </Grid>
                <Grid>community name : </Grid>
                <Grid>
                  <TextField
                    multiline
                    rows={2}
                    variant="outlined"
                    className={classes.namebox}
                    value={newRoomInfo.roomName}
                    onChange={(e) =>
                      setNewRoomInfo({
                        ...newRoomInfo,
                        roomName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid>content :</Grid>
                <Grid>
                  <TextField
                    multiline
                    rows={10}
                    variant="outlined"
                    className={classes.contentbox}
                    value={newRoomInfo.content}
                    onChange={(e) =>
                      setNewRoomInfo({
                        ...newRoomInfo,
                        content: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid container justify="center">
                  <Grid>
                    <Button
                      className={classes.createbutton}
                      variant="contained"
                      color="primary"
                      onClick={handleClick}
                    >
                      create
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <br />
      <br />
    </>
  );
}
