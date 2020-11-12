import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom'
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from 'components/OmouComponents/Loading';

export const GET_ATTENDANCE = gql`
query getAttendance($courseId: ID!) {
    __typename
    sessions(courseId: $courseId) {
      id
      startDatetime
    }
    enrollments(courseId: $courseId) {
      student {
        user {
          firstName
          id
          lastName
        }
      }
    }
  }`;

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      borderBottom: '1px solid black'
    },
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: 500,
    },
    expand: {
        margin: '0px !important'
    }
  }));

const AttendanceContainer = () => {
    const classes = useStyles();
    const { id } = useParams();

    const { data, loading, error} = useQuery(GET_ATTENDANCE, {
        variables: { courseId: id }
    });

    if(loading) return <Loading />;
    if(error) return console.error(error);
    const { enrollments, sessions } = data;
    
    return (
    <Grid container>
        <Grid item xs={12}>
      <Accordion elevation={0} square className={classes.root} classes={{ expanded: classes.expand }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4" className={classes.heading}>Attendance Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion elevation={0} square className={classes.root} classes={{ expanded: classes.expand }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4" className={classes.heading}>Attendance Tracker</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
        </Grid>
    </Grid>
    )
};

export default AttendanceContainer;