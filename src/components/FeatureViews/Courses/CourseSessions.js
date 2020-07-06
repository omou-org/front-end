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
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

const CourseSessions = ({ session }) => {
    const classes = useStyles();
    const listItem = session.map((item, index) => {
        const { startDatetime } = item
        const startingDate = moment(startDatetime).calendar();
        console.log(startingDate)
        return(
            <>
        <ListItem>
        <ListItemText primary={`Session ${index + 1} (${startingDate})`} />
      </ListItem>
      <Divider />
      </>
    )})
    return (
        <>
            <List className={classes.root}>
      {listItem}
    </List>
        </>
    )
};

export default CourseSessions;