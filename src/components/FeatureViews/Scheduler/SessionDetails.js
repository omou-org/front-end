import React from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {
    Tooltip,
    Typography,
    makeStyles,
} from '@material-ui/core';
import Loading from '../../OmouComponents/Loading';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
import { darkBlue, darkGrey } from '../../../theme/muiTheme';
import moment from 'moment';
import Box from '@material-ui/core/Box';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import { fullName } from 'utils';

import 'date-fns';

const GET_SESSION = gql`
    query SessionViewQuery($sessionId: ID!) {
        session(sessionId: $sessionId) {
            id
            startDatetime
            title
            instructor {
                user {
                    id
                    firstName
                    lastName
                }
            }
            course {
                id
                isConfirmed
                room
                availabilityList {
                    dayOfWeek
                    startTime
                    endTime
                }
                startDate
                endDate
                courseCategory {
                    id
                    name
                }
                instructor {
                    user {
                        id
                        firstName
                        lastName
                    }
                    subjects {
                        name
                    }
                }
                enrollmentSet {
                    student {
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                }
            }
            endDatetime
            startDatetime
        }
        courseCategories {
            name
            id
        }
        instructors {
            user {
                firstName
                id
                lastName
            }
        }
    }
`;

const useStyles = makeStyles(() => ({
    current_session: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '1em',
        marginTop: '1em',
        marginBottom: '1em',
    },
    course_icon: {
        width: '.75em',
        height: '.75em',
    },
    divider: {
        backgroundColor: 'black',
    },
    new_sessions_typography: {
        color: darkBlue,
        fontWeight: 500,
        lineHeight: '1em',
        fontSize: '1rem',
        float: 'left',
    },
    subtitle: {
        color: darkGrey,
        float: 'left',
        fontWeight: 500,
    },
    save_button: {
        backgroundColor: '#289FC3',
        color: 'white',
        borderRadius: 5,
        fontSize: '.875rem',
        fontWeight: 500,
        letterSpacing: '0.02em',
        lineHeight: '1rem',
        height: '2.5em',
        width: '6.875em',
    },
    type_of_edit: {
        backgroundColor: darkBlue,
        borderRadius: 2,
        padding: '.25em 0.765625em !important',
        marginTop: '.25em',
        marginBottom: '.925em',
    },
    mini_titles_format: {
        letterSpacing: '0.02em',
        fontWeight: 500,
        lineHeight: '1em',
        color: darkGrey,
        marginBottom: '.5em',
        fontVariant: 'small-caps',
    },
}));

const styles = (username) => ({
    backgroundColor: stringToColor(username),
    color: 'white',
    width: '3vw',
    height: '3vw',
    fontSize: 15,
    marginRight: 10,
});

const SessionDetails = () => {
    const { session_id, editType } = useParams();
    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_SESSION, {
        variables: { sessionId: session_id },
    });


    if (loading ) {
        return <Loading />;
    }

    if (error) {
        return <Typography>{"There's been an error!"}</Typography>;
    }

    const {
        course,
        endDatetime,
        title,
        instructor,
        startDatetime,
    } = data.session;

    var {
        courseCategory,
        enrollmentSet,
        room,
        endDate,
        startDate,
    } = course;

    const course_id = course.id;

    const dayOfWeek = moment(startDatetime).format('dddd');
    const startSessionTime = moment(startDatetime).format('h:mm A');
    const endSessionTime = moment(endDatetime).format('h:mm A');
    const endDateFormat = moment(endDate).format('MMMM DD');
    const startDateFormat = moment(startDate).format('MMMM DD');


    const EditBadge = {
        'single-session-edit':
            (<Grid
                item
                xl={1}
                xs={5}
                sm={3}
                md={2}
                lg={2}
                className={classes.type_of_edit}
            >
                <Typography align='center' style={{ color: 'white' }}>
                    Editing This Session
                </Typography>
            </Grid>),
        'all-sessions-edit':
            (<Grid
                item
                xl={1}
                xs={5}
                sm={3}
                md={2}
                lg={2}
                className={classes.type_of_edit}
            >
            <Typography align='center' style={{ color: 'white' }}>
                Editing All Sessions
            </Typography>
        </Grid>),
        'undefined': null,
    };

    return (
        <>
            <Grid
                className='session-view'
                container
                direction='row'
                spacing={1}
                style={{ marginBottom: '2em' }}
            >
                <Grid
                    item
                    container
                    xs={12}
                    style={{ padding: 0 }}
                    justify='space-between'
                >
                    <Grid item>
                        <Typography align='left' variant='h1'>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        direction='row'
                        sm={4}
                        alignItems='center'
                    >
                        <Grid item xs={2}>
                            <AutorenewIcon />
                        </Grid>
                        <Grid>
                            <Typography variant='body1' fontWeight=''>
                                Weekly recurrence
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {EditBadge[editType]}

                {/* TODO: for tutoring */}
                {/* <Grid item sm={12}>
          <Grid container>
            <Grid className="course-session-status" item xs={2}>
              {course.course_type === "tutoring" && (
                <SessionPaymentStatusChip
                  enrollment={
                    enrollments[Object.keys(enrollments)[0]][course.course_id]
                  }
                  session={session}
                  setPos
                />
              )}
            </Grid>
          </Grid>
        </Grid> */}
                <Grid container>
                    <Grid align='left' item xs={12}>
                        <Box paddingBottom='25px'>
                            <Typography
                                variant='h4'
                                className={classes.current_session}
                            >
                                Current Sessions:
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    align='left'
                    className='session-view-details'
                    container
                    item
                    spacing={2}
                    xs={8}
                    xl={6}
                >
                    <Grid item md={3} lg={5} xl={6}>
                        <Typography
                            variant='h5'
                            className={classes.mini_titles_format}
                        >
                            DATE
                        </Typography>
                        <Typography>
                            {`${startDateFormat} - ${endDateFormat}`}
                        </Typography>
                    </Grid>
                    <Grid item md={6} lg={6} xl={6}>
                        <Box paddingBottom='25px'>
                            <Typography
                                variant='h5'
                                className={classes.mini_titles_format}
                            >
                                DAY & TIME
                            </Typography>
                            <Typography>
                                {`${dayOfWeek} at ${
                                    startSessionTime + ' - ' + endSessionTime
                                }`}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            variant='h5'
                            className={classes.mini_titles_format}
                        >
                            SUBJECT
                        </Typography>
                        <Typography>{courseCategory.name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            variant='h5'
                            className={classes.mini_titles_format}
                        >
                            INSTRUCTOR
                        </Typography>
                        {course && (
                            // <NavLink style={{ textDecoration: 'none' }} to={`/accounts/instructor/${instructor.user.id}`}>
                            <Typography>{fullName(instructor.user)}</Typography>
                            // </NavLink>
                        )}
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            align='left'
                            variant='h5'
                            className={classes.mini_titles_format}
                        >
                            STUDENTS
                        </Typography>
                        <Grid container direction='row'>
                            {enrollmentSet.length > 0 ? (
                                enrollmentSet.map((student) => (
                                    <NavLink
                                        key={student.student.user.id}
                                        style={{ textDecoration: 'none' }}
                                        to={`/accounts/student/${student.student.user.id}/${course_id}`}
                                    >
                                        <Tooltip
                                            title={fullName(
                                                student.student.user
                                            )}
                                        >
                                            <Avatar
                                                style={styles(
                                                    fullName(
                                                        student.student.user
                                                    )
                                                )}
                                            >
                                                {fullName(student.student.user)
                                                    .match(/\b(\w)/g)
                                                    .join('')}
                                            </Avatar>
                                        </Tooltip>
                                    </NavLink>
                                ))
                            ) : (
                                <Typography variant='body'>
                                    No students enrolled yet.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography
                            variant='h5'
                            className={classes.mini_titles_format}
                        >
                            ROOM
                        </Typography>
                        <Typography>{room || 'TBA'}</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default SessionDetails;
