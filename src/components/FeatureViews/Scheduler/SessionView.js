import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import Box from '@material-ui/core/Box';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import {
    Tooltip,
    Typography,
    withStyles,
    makeStyles,
    Button,
    Divider,
} from '@material-ui/core';
import Loading from '../../OmouComponents/Loading';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
import { darkBlue, slateGrey } from '../../../theme/muiTheme';
import ConfirmIcon from '@material-ui/icons/CheckCircle';
import UnconfirmIcon from '@material-ui/icons/Cancel';
import Menu from '@material-ui/core/Menu';
import { USER_TYPES } from '../../../utils';
import moment from 'moment';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import { RescheduleBtn } from './RescheduleBtn';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { StudentCourseLabel, UserAvatarCircle } from '../Courses/StudentBadge';
import { fullName, gradeOptions } from 'utils';
import InputBase from '@material-ui/core/InputBase';

import 'date-fns';
import { FormControl } from '@material-ui/core';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
    current_session: {
        fontFamily: 'Roboto',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '1em',
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
}));

export const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #43B5D9',
        fontSize: 16,
        padding: '6px 26px 6px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        elevation={0}
        getContentAnchorEl={null}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const styles = (username) => ({
    backgroundColor: stringToColor(username),
    color: 'white',
    width: '3vw',
    height: '3vw',
    fontSize: 15,
    marginRight: 10,
});

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
    }
`;

const SessionView = () => {
    const { session_id } = useParams();
    const classes = useStyles();
    const [gradeFilterValue, setGradeFilterValue] = useState('');
    const [sessionStartTime, setSessionsStartTime] = useState('');
    const [sessionEndTime, setSessionsEndTime] = useState('');
    const [sessionDate, setSessionsDate] = useState('');

    const { data, loading, error } = useQuery(GET_SESSION, {
        variables: { sessionId: session_id },
    });

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Typography>There's been an error!</Typography>;
    }

    const {
        course,
        endDatetime,
        id,
        title,
        instructor,
        startDatetime,
    } = data.session;

    var { courseCategory, enrollmentSet, courseId, room } = course;

    const confirmed = course.isConfirmed;
    const course_id = course.id;
    //const student_full_name = course.enrollmentSet.student.user.firstName;

    const dayOfWeek = moment(startDatetime).format('dddd');
    const startSessionTime = moment(startDatetime).format('h:mm A');
    const endSessionTime = moment(endDatetime).format('h:mm A');

    return (
        <>
            <Grid
                className='session-view'
                container
                direction='row'
                spacing={1}
                style={{ marginBottom: '2em' }}
            >
                <Grid item sm={12} container direction='row' alignItems='center'>
                    <Grid item xs={6}>
                        <Typography
                            align='left'
                            className='session-view-title'
                            variant='h1'
                        >
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item direction='row' sm={4} alignItems='center'>
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
                    <Grid
                        align='left'
                        className='session-view-details'
                        item={12}
                    >
                        <Typography
                            variant='h4'
                            className={classes.current_session}
                        >
                            Current Sessions:
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    align='left'
                    className='session-view-details'
                    container
                    item
                    spacing={2}
                    xs={12}
                    direction='column'
                >
                    <Grid container item direction='row' justify='space-between'>
                        <Grid item xs={6}>
                            <Typography variant='h5'>Date Time</Typography>
                            <Typography>
                                {`${dayOfWeek} ${new Date(
                                    startDatetime
                                ).toLocaleDateString()} ${
                                    startSessionTime + ' - ' + endSessionTime
                                }`}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Link underline='always'>
                                View Course Page
                            </Link>
                        </Grid>
                    </Grid>

                <Grid item container direction='row' justify='flex-start'>
                    <Grid item xs={2}>
                        <Typography variant='h5'>Subject</Typography>
                        <Typography>{courseCategory.name}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='h5'>
                            Instructor
                        </Typography>
                        {course && (
                            // <NavLink style={{ textDecoration: 'none' }} to={`/accounts/instructor/${instructor.user.id}`}>
                            <Typography>{fullName(instructor.user)}</Typography>
                            // </NavLink>
                        )}
                    </Grid>
                    <Grid item xs={2}>
                        <Typography align='left' variant='h5'>
                            Student
                        </Typography>
                        <Grid container direction='row'>
                            {enrollmentSet.length > 0 ? (
                                enrollmentSet.map((student) => (
                                    <NavLink
                                        key={student.student.user.id}
                                        style={{ textDecoration: 'none' }}
                                        to={`/accounts/student/${student.student.user.id}/${course_id}`}
                                    >

                                    </NavLink>
                                ))
                            ) : (
                                <Typography variant='body'>
                                    {}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant='h5'>Room</Typography>
                        <Typography>{room || 'TBA'}</Typography>
                    </Grid>
                </Grid>

                    </Grid>

            </Grid>

            <Grid container direction='row' justify='flex-end' spacing={1}>
                <Grid item>
                    <AccessControlComponent
                        permittedAccountTypes={[
                            USER_TYPES.admin,
                            USER_TYPES.receptionist,
                            USER_TYPES.instructor,
                        ]}
                    >
                        <ResponsiveButton
                            component={NavLink}
                            to={`/scheduler/session/${session_id}/single-session-edit`}
                            variant='outlined'
                        >
                            edit this session
                        </ResponsiveButton>
                    </AccessControlComponent>
                </Grid>
                <Grid item>
                    <AccessControlComponent
                        permittedAccountTypes={[
                            USER_TYPES.admin,
                            USER_TYPES.receptionist,
                            USER_TYPES.instructor,
                        ]}
                    >
                        <ResponsiveButton
                            component={NavLink}
                            to={`/scheduler/session/${session_id}/all-sessions-edit`}
                            variant='outlined'
                        >
                            edit all sessions
                        </ResponsiveButton>
                    </AccessControlComponent>
                </Grid>
            </Grid>
        </>
    );
};

export default SessionView;
