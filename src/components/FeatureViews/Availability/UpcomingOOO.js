import React from "react";
import gql from "graphql-tag";
import { Typography, Grid } from "@material-ui/core";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import Loading from "../../OmouComponents/Loading";
import { useEffect } from "react";
import moment from "moment";

const GET_UPCOMING_INSTRUCTOR_OOO = gql`
query getInstructorOOO($instructorID:ID!) {
    instructorOoo(instructorId: $instructorID) {
      id
      description
      endDatetime
      startDatetime
    }
  }
  
  

`


const UpcomingOOO = () => {
    const AuthUser = useSelector(({ auth }) => auth);
    const [getUpcomingSession, { data, loading, error }] = useLazyQuery(GET_UPCOMING_INSTRUCTOR_OOO, {
        variables: { instructorID: AuthUser.user.id }
    })

    useEffect(() => {
        getUpcomingSession()
    }, [getUpcomingSession])

    let currentDate = moment()




    if (loading) return <Loading small />;
    if (error) return console.error(error)
    let currentUpcoming = []
    if (data) {
        data.instructorOoo.map((event) => {
            if (moment(event.startDateTime).isBetween(currentDate, undefined)) {
                currentUpcoming.push(event)
            }
        })
    }


    console.log(currentUpcoming)



    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h4" align="left">Upcoming</Typography>
            </Grid>
        </Grid>
    )
}

export default UpcomingOOO