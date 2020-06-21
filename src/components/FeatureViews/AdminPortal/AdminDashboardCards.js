import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { stringToColor } from "../Accounts/accountUtils";

const useStyles = makeStyles((theme) => ({
  snapName: {
    color: "#666666",
    float: "left",
    lineHeight: "1.1rem",
    fontSize: "0.9375rem",
    marginLeft: "21px",
    marginTop: "12px",
  },
  number: {
    float: "left",
    marginLeft: "21px",
    color: "#28ABD5",
    fontSize: "2.8125rem",
    fontWeight: "300",
    fontStyle: "normal",
  },
  opCard: {
    margin: "20px !important",
    padding: "10px !important",
  },
  opAvatar: {
    width: "65px",
    height: "65px",
    fontSize: "30px",
    alignSelf: "center",
    fontFamily: "Roboto",
  },
  opDetail: {
    fontSize: "12px",
    textAlign: "left",
  },
  amtdue: {
    color: "red",
  },
}));

export const Snapshot = (props) => {
  const classes = useStyles();
  return (
    <Paper elevation={0}>
      <Typography className={classes.snapName}>{props.snapName}</Typography>
      <br />
      <br />
      <Typography className={classes.number}>{props.number}</Typography>
    </Paper>
  );
};

export const OutstandingPaymentCard = (op) => {
  const classes = useStyles();

  return (
    <Card className={classes.opCard}>
      <Grid container>
        <Grid item xs={3}>
          <CardMedia>
            <Avatar
              className={classes.opAvatar}
              style={{
                backgroundColor: stringToColor(op.name),
              }}
            >
              {op.initials}
            </Avatar>
          </CardMedia>
        </Grid>
        <Grid item xs={9} className={classes.opDetail}>
          <CardContent>
            <Grid item xs={12}>
              <Typography variant="subtitle2">{op.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption text">
                Amount Due: <span className={classes.amtdue}>${op.due}</span>
              </Typography>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};
