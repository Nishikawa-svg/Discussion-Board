import React from "react";
import { makeStyles, Grid, Paper, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: "#dddddd",
  },
  header: {
    minHeight: 70,
  },
  titlename: {
    fontSize: 30,
    paddingTop: 10,
  },
  iconbutton: {
    marginTop: 5,
  },
  statusbutton: {
    marginTop: 10,
    marginRight: 14,
    textTransform: "none",
  },
  acountcircleicon: {
    fontSize: "2rem",
    marginRight: 4,
  },
  username: {
    marginTop: 2,
    fontSize: 16,
  },
  keyboardarrowdownicon: {
    marginTop: 4,
  },
});
const initialState = {
  userInfo: { userId: null, name: "", password: "" },
};

export default function Header({ userInfo, setUserInfo }) {
  const history = useHistory();
  const classes = useStyles();
  const signOut = () => {
    setUserInfo(initialState);
    history.push("/");
  };
  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.header}>
          <Grid container>
            <Grid item xs={4}>
              {userInfo.userId === 0 || userInfo.userId > 0 ? (
                <Button
                  className={classes.statusbutton}
                  variant="outlined"
                  onClick={signOut}
                >
                  <div>Sign out</div>
                  <ExitToAppIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Grid item>
                  <div className={classes.titlename}>Discussion Borad</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Button className={classes.statusbutton} variant="outlined">
                  <Grid container>
                    <AccountCircleIcon className={classes.acountcircleicon} />
                    <div className={classes.username}>{userInfo.name}</div>
                  </Grid>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <br />
    </>
  );
}
