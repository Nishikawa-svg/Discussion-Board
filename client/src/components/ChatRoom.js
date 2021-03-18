import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, makeStyles, Button } from "@material-ui/core";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import Axios from "axios";

const useStyles = makeStyles({
  menu: {
    textAlign: "center",
    color: "#444444",
  },
  reloadbutton: {
    marginBottom: 10,
    textTransform: "None",
    marginRight: 10,
  },
  createroombutton: {
    textTransform: "none",
  },
  autorenewicon: {
    marginRight: 10,
  },
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
    getChatRoomInfo();
    return () => {};
  }, []);
  const getChatRoomInfo = () => {
    Axios.get("http://localhost:3333/getchatrooms").then((response) => {
      console.log("chat room info ->", response.data);
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
      <h1 className={classes.menu}>room select</h1>
      <Grid container justify="center">
        <Button
          variant="contained"
          onClick={getChatRoomInfo}
          color="secondary"
          className={classes.reloadbutton}
        >
          <AutorenewIcon className={classes.autorenewicon} />
          Reload
        </Button>
        <Link to="/createroom" className={classes.link}>
          <Button variant="contained" className={classes.createroombutton}>
            create new community
          </Button>
        </Link>
      </Grid>
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
