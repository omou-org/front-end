import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Create, Cancel } from '@material-ui/icons';
import { highlightColor } from "../../../theme/muiTheme"


const useStyles = makeStyles({
    announcementContainer: {
        padding: "10px",
        fontFamily: "Arial",
        fontStyle: "normal",
        '&:hover': {
            backgroundColor: highlightColor,
          }
    },
    announcementBody: {
        paddingTop: "10px",
        paddingBottom: "20px"
    },
  });

  const announcementData = 
  [
      { 
          user: "Katie Ho",
          title: "Updated Business Hours",
          body: "Due to COVID-19 situation, we have a new schedule",
          date: '2/12',
          time: "10:24a"
      },
      {
          user: "Katie Ho",
          title: "Parking Area",
          body: "Due to temporary construction that is happening on Joy St.",
          date: '1/10',
          time: "8:04a"
      },
      {
          user: "Katie Ho",
          title: "New Year Gathering",
          body: "Join us with other tutors and staff for early New Year",
          date: '12/28',
          time: "9:03a"
      }
  ]

  const AnnouncementCard = ({
    user, title, body, date, time
}) => {
    const classes = useStyles();

    
    return (
        <Grid
            className={classes.announcementContainer}
            container
            justify="flex-start"
            data-active="inactive"
        >
            <Grid item xs={6}>
                <Typography variant="h6" align="left" gutterBottom>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={6} style={{textAlign:"right"}}>
                <Create style={{color: "#43B5D9"}}/> <Cancel style={{color: "#43B5D9"}}/>
            </Grid>
            <Grid item xs={12} className={classes.announcementBody}>
                <Typography variant="body1" align="left">
                    {body}
                </Typography>
            </Grid>
            <Grid
            item
            xs={3}>
                <Typography
                variant="subtitle2"
                align="left"
                >
                    Posted by: <span style={{color:"#43B5D9", fontWeight: "550"}}>{user}</span> - {date} - {time}
                </Typography>
            </Grid>
        </Grid>
    )
}

const Announcements = () => {
    return (
        <Grid
        container
        justify="flex-start"
        data-active="inactive"
        >
            {announcementData.map(({user, title, body, date, time}) => (
        <AnnouncementCard
            user = {user}
            title = {title}
            body = {body}
            date = {date}
            time = {time}
        />
    ))}
        </Grid>
    )
}



export default Announcements