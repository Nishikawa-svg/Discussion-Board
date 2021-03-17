import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, makeStyles, Button } from "@material-ui/core";
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
    getChatRoomInfo();
    return () => {
      console.log("chat room unmounted");
    };
  }, []);
  const getChatRoomInfo = () => {
    Axios.get("http://localhost:3333/getchatrooms").then((response) => {
      console.log(response.data);
      setChatRooms(response.data);
    });
  };
  const getElapsedTime = (input) => {
    const from = new Date(input);
    const to = Date.now();
    const ms = to - from;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(ms / 1000 / 60);
    const h = Math.floor(ms / 1000 / 60 / 60);
    const d = Math.floor(ms / 1000 / 60 / 60 / 24);
    if (d > 0) {
      return `${d} day ago`;
    } else if (h > 0) {
      return `${h} hour ago`;
    } else if (m > 0) {
      return `${m} min ago`;
    } else if (s > 0) {
      return `${s} sec ago`;
    } else {
      return `${ms} ms ago`;
    }
  };
  const cmpLastUpdateTime = (a, b) => {
    let comparison = 0;
    if (a.lastUpdate < b.lastUpdate) comparison = 1;
    else if (a.lastUpdate > b.lastUpdate) comparison = -1;
    return comparison;
  };
  return (
    <>
      <h1>Hey! {userName}!</h1>
      <h1>please select chat room</h1>
      <h3>
        <Link to="/createroom" className={classes.link}>
          create room
        </Link>
      </h3>
      <Button variant="contained" onClick={getChatRoomInfo}>
        Reload
      </Button>
      <Grid container>
        {[...chatRooms].sort(cmpLastUpdateTime).map((room) => (
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
                      <div>last update : {getElapsedTime(room.lastUpdate)}</div>
                      <div>commnets : {room.comments}</div>
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
