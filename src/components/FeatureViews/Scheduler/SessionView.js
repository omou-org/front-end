import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Tooltip, Typography, withStyles, makeStyles, Button } from '@material-ui/core';
import Loading from '../../OmouComponents/Loading';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
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

const CourseFilterDropdown = ({
    initialValue,
    filterList,
    setState,
    filter,
    filterKey,
}) => {
    const classes = useStyles();
    const handleChange = (event) => setState(event.target.value);
    const filterOptionsMapper = {
        instructors: (option) => ({
            value: option.instructor.user.id,
            label: fullName(option.instructor.user),
        }),
        subjects: (option) => ({
            value: option.courseCategory.id,
            label: option.courseCategory.name,
        }),
        grades: (option) => ({
            value: option.value.toUpperCase(),
            label: option.label,
        }),
        students: (option) => ({
            value: option.value,
            label: option.label,
        }),

    }[filterKey];

    const ChosenFiltersOption = filterList.map(filterOptionsMapper);
    return (
        <Grid container>
            <Grid item>
                <FormControl className={classes.margin}>
                    <Select
                        labelId='course-management-sort-tab'
                        id='course-management-sort-tab'
                        displayEmpty
                        value={filter}
                        onChange={handleChange}
                        classes={{ select: classes.menuSelect }}
                        input={<BootstrapInput />}
                        MenuProps={{
                            classes: { list: classes.dropdown },
                            anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                            },
                            transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                            },
                            getContentAnchorEl: null,
                        }}
                    >
                        <MenuItem
                            ListItemClasses={{ selected: classes.menuSelected }}
                            value=''
                        >
                            {initialValue}
                        </MenuItem>
                        {ChosenFiltersOption.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                className={classes.menuSelect}
                                ListItemClasses={{ selected: classes.menuSelected }}
                            >
                                {filterKey === 'students' ? (
                                    <UserAvatarCircle label={option.label} />
                                ) : (
                                    ''
                                )}
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                
            </Grid>
            <Grid item>
                <KeyboardDatePicker />
            </Grid>
            <Grid item>
                <KeyboardTimePicker />
            </Grid>
            <Grid item>
                <KeyboardTimePicker />
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles((theme) => ({
    current_session: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '1em',
      color: '#1F82A1'
    },
    course_icon: {
        width: '.75em',
        height: '.75em'
    },
  }));

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
            >
                <Grid item sm={12}>
                    <Typography
                        align='left'
                        className='session-view-title'
                        variant='h1'
                    >
                        {title}
                    </Typography>
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
        <Grid align='left' className='session-view-details' item={12}>
            <Typography variant='h4' className={classes.current_session}>Current Sessions:</Typography>
        </Grid>
        </Grid>
                <Grid
                    align='left'
                    className='session-view-details'
                    container
                    item
                    spacing={2}
                    xs={6}
                >
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
                                    <Typography>
                                        {fullName(instructor.user)}
                                    </Typography>
                        // </NavLink>
                        )}
                    </Grid>
                    <Grid item xs={8}>
                        <Typography align='left' variant='h5'>
                            Students Enrolled
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
                    <Grid item xs={6}>
                        <Typography variant='h5'>Date Time</Typography>
                        <Typography>
                            {`${dayOfWeek} ${new Date(startDatetime).toLocaleDateString()} ${startSessionTime + ' - ' + endSessionTime}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Room</Typography>
                        <Typography>{room || 'TBA'}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {/* <InstructorSchedule instructorID={instructor_id} /> */}
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
                            to={`/scheduler/session/${session_id}/singlesession`}
                            variant='outlined'
                        >
                            Edit this session
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
                            to={`/scheduler/session/${session_id}/singlesession`}
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
