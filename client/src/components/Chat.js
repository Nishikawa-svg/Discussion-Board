import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Grid,
  Paper,
  TextField,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import CachedIcon from "@material-ui/icons/Cached";
import AddCommentIcon from "@material-ui/icons/AddComment";
import ReplyIcon from "@material-ui/icons/Reply";
import io from "socket.io-client";
import Axios from "axios";

const ENDPOINT = "http://localhost:3333";
let socket;

const useStyles = makeStyles({
  buttongroup: {
    textAlign: "center",
  },
  containerpaper: {
    //minHeight: 400,
    // maxWidth :
    marginBottom: 100,
  },
  cachedicon: {
    marginRight: 10,
    marginLeft: 10,
    fontSize: 16,
  },
  innerpaper: {
    marginBottom: 5,
    paddingBottom: 48,
    backgroundColor: "#dddddd",
    position: "relative",
  },
  name: {
    fontSize: 16,
    color: "#888888",
  },
  content: {},
  date: {
    fontSize: 10,
  },
  replyicon: {
    paddingRight: 10,
    marginBottom: 5,
  },
  datecontainer: {
    position: "absolute",
    bottom: 0,
    marginBottom: 0,
  },
  inputboxcontainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    height: 100,
    paddingLeft: 7,
    paddingRight: 7,
  },
  textfield: {
    width: "100%",
  },
  inputboxpaper: {
    backgroundColor: "#ffffff",
    height: "95%",
  },
  sendbutton: {
    marginTop: 20,
    left: "20%",
    width: "80%",
    height: "60%",
  },
  sendicon: {
    marginRight: 5,
  },
  addcirclebutton: {
    position: "fixed",
    bottom: 0,
    right: 0,
  },
  addcircleicon: {
    fontSize: "4em",
  },
});

export default function Chat({ roomId, roomName, userName }) {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [order, setOrder] = useState(true);
  const [showTextBox, setShowTextBox] = useState(false);
  //console.log(roomId,'loaded');
  useEffect(() => {
    socket = io(ENDPOINT);
    //console.log(socket);
    console.log(roomId, "Chat component was mounted");
    Axios.post("http://localhost:3333/load", { roomId: roomId }).then(
      (response) => {
        console.log("loaded messages ->", response.data);
        setMessages(response.data);
      }
    );
    socket.on("newMessage", (messageList) => {
      console.log("new message list ->", messageList);
      setMessages(messageList);
    });

    return () => {
      socket.disconnect();
      console.log(roomId, "Chat component was unmounted");
    };
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    const sendMessage = { roomId: roomId, name: userName, content: text };
    socket.emit("sendMessage", { sendMessage });
    alert(text);
    setText("");
  };
  const getDate = (input) => {
    const date = new Date(input);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  const replyButtonClick = (idx) => {
    const replyText = `>>${idx}\n${text}`;
    setText(replyText);
    setShowTextBox(true);
  };
  return (
    <>
      <h1>Chat room : {roomName}</h1>
      {order ? (
        <div className={classes.buttongroup}>
          <Button
            onClick={() => setOrder(true)}
            variant="contained"
            color="secondary"
          >
            oldest
          </Button>
          <CachedIcon className={classes.cachedicon} />
          <Button
            onClick={() => setOrder(false)}
            variant="contained"
            color="inherit"
          >
            latest
          </Button>
        </div>
      ) : (
        <div className={classes.buttongroup}>
          <Button
            onClick={() => setOrder(true)}
            variant="contained"
            color="inherit"
          >
            oldest
          </Button>
          <CachedIcon className={classes.cachedicon} />
          <Button
            onClick={() => setOrder(false)}
            variant="contained"
            color="secondary"
          >
            latest
          </Button>
        </div>
      )}
      <br />
      <Grid container justify="center">
        <Grid item xs={10}>
          <Paper className={classes.containerpaper}>
            {order ? (
              <>
                {messages.map((m, idx) => (
                  <Grid container key={idx}>
                    <Grid container justify="center">
                      <Grid item xs={12}>
                        <Paper className={classes.innerpaper}>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.name}>
                                {idx + 1}#{m.name}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.content}>
                                {m.content.split("\n").map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div></div>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            justify="center"
                            className={classes.datecontainer}
                          >
                            <Grid item xs={10}>
                              <Grid container justify="flex-end">
                                <div className={classes.date}>
                                  <IconButton
                                    size="small"
                                    className={classes.replyicon}
                                    onClick={() => replyButtonClick(idx + 1)}
                                  >
                                    <ReplyIcon />
                                  </IconButton>
                                  {getDate(m.submissionTime)}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </>
            ) : (
              <>
                {[...messages].reverse().map((m, idx) => (
                  <Grid container key={idx}>
                    <Grid container justify="center">
                      <Grid item xs={12}>
                        <Paper className={classes.innerpaper}>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.name}>
                                {messages.length - idx}#{m.name}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.content}>
                                {m.content.split("\n").map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div></div>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            justify="center"
                            className={classes.datecontainer}
                          >
                            <Grid item xs={10}>
                              <Grid container justify="flex-end">
                                <div className={classes.date}>
                                  <IconButton
                                    size="small"
                                    className={classes.replyicon}
                                    onClick={() =>
                                      replyButtonClick(messages.length - idx)
                                    }
                                  >
                                    <ReplyIcon />
                                  </IconButton>
                                  {getDate(m.submissionTime)}
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      {showTextBox ? (
        <Grid container justify="center" className={classes.inputboxcontainer}>
          <Grid item xs={12}>
            <Paper className={classes.inputboxpaper}>
              <Grid container justify="center">
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={1}>
                      <IconButton>
                        <CloseIcon
                          color="secondary"
                          size="large"
                          onClick={() => setShowTextBox(false)}
                        />
                      </IconButton>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        multiline
                        rows={3}
                        variant="outlined"
                        className={classes.textfield}
                        placeholder="write message here..."
                        color="primary"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        className={classes.sendbutton}
                        variant="contained"
                        color="primary"
                        onClick={handleClick}
                      >
                        <SendIcon
                          color="inherit"
                          className={classes.sendicon}
                        />
                        <p>POST</p>
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <IconButton
          className={classes.addcirclebutton}
          color="default"
          onClick={() => setShowTextBox(true)}
        >
          <AddCommentIcon className={classes.addcircleicon} />
        </IconButton>
      )}
    </>
  );
}
