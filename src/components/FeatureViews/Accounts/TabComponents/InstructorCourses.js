import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import ConfirmIcon from '@material-ui/icons/CheckCircle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import UnconfirmIcon from '@material-ui/icons/Cancel';
import Moment from 'react-moment';
import moment from 'moment';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import Loading from 'components/OmouComponents/Loading';
import { DayAbbreviation } from 'utils';

export const GET_INSTRUCTOR_ENROLLMENTS = gql`
    query InstructorEnrollments($instructorID: ID!) {
        courses(instructorId: $instructorID) {
            id
            description
            startDate
            endDate
            isConfirmed
            title
            availabilityList {
                id
                dayOfWeek
                endTime
                startTime
            }
        }
    }
`;

const sessionsAtSameTimeInMultiDayCourse = (availabilityList) => {
    let start = availabilityList[0].startTime;
    let end = availabilityList[0].endTime;

    for (let availability of availabilityList) {
        if (availability.startTime !== start || availability.endTime !== end) {
            return false;
        }
    }
    return true;
};

const InstructorCourses = ({ instructorID }) => {
    const { loading, error, data } = useQuery(GET_INSTRUCTOR_ENROLLMENTS, {
        variables: { instructorID },
    });

    if (loading) return <Loading small />;

    if (error)
        return <Typography>There was an error {error.message}</Typography>;

    const { courses } = data;

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid className='accounts-table-heading' container>
                    <Grid item xs={4}>
                        <Typography align='left' className='table-header'>
                            Course
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography align='left' className='table-header'>
                            Dates
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align='left' className='table-header'>
                            Day
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align='left' className='table-header'>
                            Time
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography align='left' className='table-header'>
                            Confirmed
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction='row-reverse' spacing={1}>
                {courses
                    .sort((courseA, courseB) =>
                        moment(courseB.startDate).diff(
                            moment(courseA.startDate)
                        )
                    )
                    .map(
                        ({
                            id,
                            title,
                            startDate,
                            endDate,
                            isConfirmed,
                            availabilityList,
                        }) => {
                            return (
                                <Grid
                                    className='accounts-table-row'
                                    component={Link}
                                    item
                                    key={id}
                                    to={`/coursemanagement/class/${id}`}
                                    xs={12}
                                >
                                    <Paper elevation={2} square>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Typography align='left'>
                                                    {title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography align='left'>
                                                    <Moment
                                                        format='MMM D YYYY'
                                                        date={startDate}
                                                    />
                                                    {` - `}
                                                    <Moment
                                                        format='MMM D YYYY'
                                                        date={endDate}
                                                    />
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography align='left'>
                                                    {availabilityList.map(
                                                        (
                                                            { dayOfWeek },
                                                            index
                                                        ) => {
                                                            let isLastSessionOfWeek =
                                                                availabilityList.length -
                                                                    1 ===
                                                                index;
                                                            return (
                                                                DayAbbreviation[
                                                                    dayOfWeek.toLowerCase()
                                                                ] +
                                                                (!isLastSessionOfWeek
                                                                    ? ', '
                                                                    : '')
                                                            );
                                                        }
                                                    )}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                {sessionsAtSameTimeInMultiDayCourse(
                                                    availabilityList
                                                ) ? (
                                                    <Typography align='left'>
                                                        <Moment
                                                            format='h:mm a'
                                                            date={
                                                                startDate +
                                                                ' ' +
                                                                availabilityList[0]
                                                                    .startTime
                                                            }
                                                        />
                                                        {' - '}
                                                        <Moment
                                                            format='h:mm a'
                                                            date={
                                                                endDate +
                                                                ' ' +
                                                                availabilityList[0]
                                                                    .endTime
                                                            }
                                                        />
                                                    </Typography>
                                                ) : (
                                                    'Various'
                                                )}
                                            </Grid>
                                            <Grid item md={1}>
                                                {isConfirmed ? (
                                                    <ConfirmIcon className='confirmed course-icon' />
                                                ) : (
                                                    <UnconfirmIcon className='unconfirmed course-icon' />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        }
                    )}
            </Grid>
        </Grid>
    );
};

InstructorCourses.propTypes = {
    instructorID: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default InstructorCourses;
