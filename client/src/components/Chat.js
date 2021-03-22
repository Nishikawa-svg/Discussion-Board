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
import { Link } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import CachedIcon from "@material-ui/icons/Cached";
import AddCommentIcon from "@material-ui/icons/AddComment";
import ReplyIcon from "@material-ui/icons/Reply";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import io from "socket.io-client";
import Axios from "axios";

const ENDPOINT = "http://localhost:3333";
let socket;

const useStyles = makeStyles({
  link: {
    textDecoration: "none",
    color: "blue",
  },
  roomtitle: {
    textAlign: "center",
    fontSize: 26,
    paddingTop: 8,
  },
  subtitle: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 12,
    color: "#777777",
  },
  roomcontent: {
    fontSize: 16,
    paddingBottom: 20,
  },
  founderinfo: {
    fontSize: 11,
    paddingBottom: 10,
  },
  buttongroup: {
    paddingTop: 20,
    textAlign: "center",
  },
  containerpaper: {
    //minHeight: 400,
    // maxWidth :
    marginBottom: 110,
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
    height: 120,
    paddingLeft: 7,
    paddingRight: 7,
  },
  textfield: {
    marginTop: 10,
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
const initialState = {
  msg: [],
  founderInfo: {
    founderId: null,
    founderName: null,
    founderDate: null,
  },
};
export default function Chat({ roomId, roomName, roomContent, userName }) {
  const classes = useStyles();
  const [messages, setMessages] = useState(initialState);
  const [text, setText] = useState("");
  const [order, setOrder] = useState(true);
  const [showTextBox, setShowTextBox] = useState(false);
  useEffect(() => {
    socket = io(ENDPOINT);
    Axios.post("http://localhost:3333/load", { roomId: roomId }).then(
      (response) => {
        console.log("loaded messages ->", response.data);
        setMessages(response.data);
      }
    );
    socket.on("newMessage", (messageList) => {
      console.log("new message list ->", messageList);
      setMessages({ ...messages, msg: messageList });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const handleClick = (e) => {
    e.preventDefault();
    const sendMessage = { roomId: roomId, name: userName, content: text };
    socket.emit("sendMessage", { sendMessage });
    //alert(text);
    setText("");
  };
  const getDate = (input) => {
    const date = new Date(input);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  const replybtnClick = (idx) => {
    const replyText = `>>${idx}\n${text}`;
    setText(replyText);
    setShowTextBox(true);
  };
  const getIndentationString = (input) =>
    input.split("\n").map((line, idx) => {
      if (idx)
        return (
          <span key={idx}>
            <br />
            {line}
          </span>
        );
      else return <span key={idx}>{line}</span>;
    });
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
                <Grid>
                  <div className={classes.roomtitle}>
                    {getIndentationString(roomName)}
                  </div>
                </Grid>
                <Grid>
                  <div className={classes.subtitle}>about this community :</div>
                </Grid>
                <Grid>
                  <div className={classes.roomcontent}>
                    {getIndentationString(roomContent)}
                  </div>
                </Grid>
                <Grid container justify="flex-end">
                  <Grid>
                    <div className={classes.founderinfo}>
                      founder :{messages.founderInfo.founderName}{" "}
                      {getDate(messages.founderInfo.foundedDate)}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

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
                {messages.msg.map((m, idx) => (
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
                                {/* {m.content.split("\n").map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))} */}
                                {getIndentationString(m.content)}
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
                                    onClick={() => replybtnClick(idx + 1)}
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
                {[...messages.msg].reverse().map((m, idx) => (
                  <Grid container key={idx}>
                    <Grid container justify="center">
                      <Grid item xs={12}>
                        <Paper className={classes.innerpaper}>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.name}>
                                {messages.msg.length - idx}#{m.name}
                              </div>
                            </Grid>
                          </Grid>
                          <Grid container justify="center">
                            <Grid item xs={10}>
                              <div className={classes.content}>
                                {/* {m.content.split("\n").map((line, idx) => (
                                  <span key={idx}>
                                    {line}
                                    <br />
                                  </span>
                                ))}  */}
                                {getIndentationString(m.content)}
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
                                      replybtnClick(messages.msg.length - idx)
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
