import React from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Tooltip, Typography, withStyles } from '@material-ui/core';
import Loading from '../../OmouComponents/Loading';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
import ConfirmIcon from '@material-ui/icons/CheckCircle';
import UnconfirmIcon from '@material-ui/icons/Cancel';
import Menu from '@material-ui/core/Menu';
import { fullName, USER_TYPES } from '../../../utils';
import moment from 'moment';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import AccessControlComponent from '../../OmouComponents/AccessControlComponent';
import { RescheduleBtn } from './RescheduleBtn';

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
                <Grid
                    align='left'
                    className='session-view-details'
                    container
                    item
                    spacing={2}
                    xs={6}
                >
                    <Grid item xs={6}>
                        <Typography variant='h5'>Subject</Typography>
                        <Typography>{courseCategory.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Room</Typography>
                        <Typography>{room || 'TBA'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h5'>
                            Instructor
                            {confirmed ? (
                                <ConfirmIcon className='confirmed course-icon' />
                            ) : (
                                <UnconfirmIcon className='unconfirmed course-icon' />
                            )}
                        </Typography>
                        {course && (
                            <NavLink
                                style={{ textDecoration: 'none' }}
                                to={`/accounts/instructor/${instructor.user.id}`}
                            >
                                <Tooltip
                                    aria-label='Instructor Name'
                                    title={fullName(instructor.user)}
                                >
                                    <Avatar
                                        style={styles(
                                            fullName(instructor.user)
                                        )}
                                    >
                                        {fullName(instructor.user)
                                            .match(/\b(\w)/g)
                                            .join('')}
                                    </Avatar>
                                </Tooltip>
                            </NavLink>
                        )}
                    </Grid>
                    <Grid item xs={12}>
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
                        <Typography variant='h5'>Day</Typography>
                        <Typography>{dayOfWeek}</Typography>
                        <Typography>
                            {new Date(startDatetime).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Time</Typography>
                        <Typography>
                            {startSessionTime + ' - ' + endSessionTime}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    {/* <InstructorSchedule instructorID={instructor_id} /> */}
                </Grid>
            </Grid>
            <Grid container direction='row' justify='flex-end' spacing={1}>
                <Grid item>
                    <ResponsiveButton
                        component={NavLink}
                        to={`/courses/class/${course_id}`}
                        variant='outlined'
                    >
                        Course Page
                    </ResponsiveButton>
                </Grid>
                <Grid item>
                    <AccessControlComponent
                        permittedAccountTypes={[
                            USER_TYPES.admin,
                            USER_TYPES.receptionist,
                            USER_TYPES.instructor,
                        ]}
                    >
                        <RescheduleBtn />
                    </AccessControlComponent>
                </Grid>
            </Grid>
        </>
    );
};

export default SessionView;
