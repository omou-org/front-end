import React from "react";
import gql from "graphql-tag";
import { Typography, Grid, Divider, List, ListItemText, ListItem } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import Loading from "../../OmouComponents/Loading";
import { makeStyles } from '@material-ui/core/styles';

import moment from "moment";

export const GET_UPCOMING_INSTRUCTOR_OOO = gql`
query getInstructorOOO($instructorID:ID!) {
    instructorOoo(instructorId: $instructorID) {
      id
      description
      endDatetime
      startDatetime
    }
  }
  
`

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflow: 'auto',
        maxHeight: 200,
    },
})

export const UpcomingOOO = () => {
    const AuthUser = useSelector(({ auth }) => auth);
    const { data, loading, error } = useQuery(GET_UPCOMING_INSTRUCTOR_OOO, {
        variables: { instructorID: AuthUser.user.id }
    })

    const classes = useStyles();

    const currentDate = moment().utc().format();

    if (loading) return <Loading small />;

    if (error) return console.error(error)



    const currentUpcoming = data.instructorOoo.filter((event) => (
        moment(event.endDatetime).isSameOrAfter(currentDate, "day")
    ))

    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4" align="left">Upcoming</Typography>

            </Grid>
            <Grid item xs={12}>
                <List className={classes.root}>
                    {currentUpcoming.map(({ description, startDatetime, endDatetime }) =>
                        <ListItem container>
                            <ListItemText primary={description} secondary={moment(startDatetime).format("L") + " - " + moment(endDatetime).format("L")} />
                        </ListItem>
                    )}
                </List>
            </Grid>
        </Grid>
    )

}



export const LogOOO = () => {
    const currentDate = moment().utc().format();
    const AuthUser = useSelector(({ auth }) => auth);
    const { data, loading, error } = useQuery(GET_UPCOMING_INSTRUCTOR_OOO, {
        variables: { instructorID: AuthUser.user.id }
    })

    const classes = useStyles()
    if (loading) return <Loading small />;

    if (error) return console.error(error)



    const logOfInstructorOOO = data.instructorOoo.filter((event) => (
        moment(event.endDatetime).isBefore(currentDate, "day")
    ))


    return (
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h4" align="left">Log</Typography>

            </Grid>

            <Grid item xs={12}>
                <List className={classes.root}>
                    {logOfInstructorOOO.map(({ description, startDatetime, endDatetime }) =>
                        <>
                            <ListItem  >
                                <ListItemText primary={description} secondary={moment(startDatetime).format("L") + " - " + moment(endDatetime).format("L")} />
                            </ListItem>
                            <Divider />
                        </>
                    )}
                </List >
            </Grid>
        </Grid>
    )
}



