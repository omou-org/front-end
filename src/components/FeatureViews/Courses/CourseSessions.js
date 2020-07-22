import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import moment from "moment";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      minWidth: 1460,
      backgroundColor: theme.palette.background.paper,
    },
    listItems: {
      paddingTop: "3em",
      paddingBottom: "1em",
    }
  }));

const CourseSessions = ({ sessionList }) => {
    const classes = useStyles();
    return (
            <List className={classes.root}>
      {sessionList.map(({ startDatetime }, index) => {
        const startingDate = moment(startDatetime).calendar();
        return(
            <>
        <ListItem className={classes.listItems} key={index}>
        <ListItemText primary={`Session ${index + 1} (${startingDate})`} />
      </ListItem>
      <Divider />
      </>
    )})}
    </List>
    )
};

export default CourseSessions;