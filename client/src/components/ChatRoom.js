import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, makeStyles } from "@material-ui/core";
import Axios from "axios";

const useStyles = makeStyles({
  paper: {
    marginBottom: 10,
  },
  roominfo: {
    textAlign: "right",
  },
  title: {},
  link: {
    textDecoration: "none",
  },
});

export default function ChatRoom({ userName, chatRooms, setChatRooms }) {
  const classes = useStyles();
  useEffect(() => {
    console.log("chat room mounted");
    Axios.get("http://localhost:3333/getchatrooms").then((response) => {
      console.log(response.data);
      setChatRooms(response.data);
    });
    return () => {
      console.log("chat room unmounted");
    };
  }, []);

  return (
    <>
      <h1>Hey! {userName}!</h1>
      <h1>please select chat room</h1>
      <h3>
        <Link to="/createroom" className={classes.link}>
          create room
        </Link>
      </h3>
      <Grid container>
        {chatRooms.map((room) => (
          <Grid container justify="center" key={room.roomId}>
            <Grid item xs={8} md={6}>
              <Link
                to={`/chat/${room.roomId}_${room.roomName}`}
                className={classes.link}
              >
                <Paper className={classes.paper}>
                  <Grid container justify="center">
                    <Grid item xs={10}>
                      <h3>{room.roomName}</h3>
                    </Grid>
                  </Grid>
                  <Grid container justify="center">
                    <Grid item xs={10} className={classes.roominfo}>
                      <div>last update</div>
                      <div>commnets</div>
                    </Grid>
                  </Grid>
                </Paper>
              </Link>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
