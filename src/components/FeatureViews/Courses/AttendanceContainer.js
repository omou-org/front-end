import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AttendanceTable from './AttendanceTable';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      borderBottom: '1px solid black'
    },
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: 500,
      marginTop: 12
    },
    expand: {
        margin: '0px !important'
    },
    iconBox: {
      paddingLeft: "0.30em",
      paddingRight: "0.70em",
      borderRadius: 2
    },
    green: {
      backgroundColor: '#6CE086'
    },
    yellow: {
      backgroundColor: '#FFDD59'
    },
    red: {
      backgroundColor: '#FF6766'
    },
    gridWidth: {
      maxWidth: "4.33%"
    }
  }));

const AttendanceIcon = ({ letter }) => {
  const classes = useStyles();
  const renderColor = () => {
    switch(letter) {
      case "P":
        return classes.green
      case "T":
        return classes.yellow
      default:
        return classes.red 
    }
  }
  return (
    <Grid item xs={1} alignContent="center" className={`${classes.iconBox} ${renderColor()}`}>
      <Typography variant="body1" align="left" style={{fontWeight: 500, color: 'black'}}>{letter}</Typography>
    </Grid>
  )
}

const AttendanceLegend = () => {
  const classes = useStyles();

  return (
    <Grid container direction="row" justify="flex-start" alignItems="center">
      <Grid item xs={1} classes={{['grid-xs-1']: classes.gridWidth}}>
        <Checkbox disabled icon={<AttendanceIcon letter="P"/>}/>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2" align="center" style={{fontWeight: 500, color: 'black'}}>Present</Typography>
      </Grid>
      <Grid item xs={1} classes={{['grid-xs-1']: classes.gridWidth}}>
      <Checkbox disabled icon={<AttendanceIcon letter="T"/>}/>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2" style={{fontWeight: 500, color: 'black'}}>Tardy</Typography>
        </Grid>
      <Grid item xs={1} classes={{['grid-xs-1']: classes.gridWidth}}>
      <Checkbox disabled icon={<AttendanceIcon letter="A"/>}/>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2" style={{fontWeight: 500, color: 'black'}}>Absent</Typography>
        </Grid>
    </Grid>
  )
}

const AttendanceContainer = () => {
    const classes = useStyles();
    const [isEditing, setIsEditing] = useState(false);

    return (
    <Grid container>
        <Grid item xs={12}>
      <Accordion elevation={0} square className={classes.root} classes={{ expanded: classes.expand }} disabled>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4" className={classes.heading}>Attendance Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0} square className={classes.root} classes={{ expanded: classes.expand }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Grid item xs={2} alignItems="flex-start">
          <Typography variant="h4" align="left" className={classes.heading}>Attendance Tracker</Typography>
          </Grid>
          <Grid item xs={8}>
            {isEditing && <AttendanceLegend />}
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <AttendanceTable setIsEditing={setIsEditing} editingState={isEditing}/>
        </AccordionDetails>
      </Accordion>
        </Grid>
    </Grid>
    )
};

export default AttendanceContainer;