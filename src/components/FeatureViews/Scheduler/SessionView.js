import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { NavLink, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Tooltip, Typography, withStyles } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Loading from '../../OmouComponents/Loading';
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../Accounts/accountUtils';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import ConfirmIcon from '@material-ui/icons/CheckCircle';
import UnconfirmIcon from '@material-ui/icons/Cancel';
import BackButton from 'components/OmouComponents/BackButton';
import Menu from '@material-ui/core/Menu';
import { fullName } from '../../../utils';
import moment from 'moment';

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

const EDIT_ALL_SESSIONS = 'all';
const EDIT_CURRENT_SESSION = 'current';

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
    const [edit, setEdit] = useState(false);
    const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);

    const { data, loading, error } = useQuery(GET_SESSION, {
        variables: { sessionId: session_id },
    });

    const handleEditToggle = (cancel) => (event) => {
        event.preventDefault();
        if (!cancel && edit) {
            handleToggleEditing(editSelection);
        } else {
            setEdit(!edit);
        }
    };

    const handleToggleEditing = (editSelection) => {
        this.setState((oldState) => {
            return {
                ...oldState,
                editing: !oldState.editing,
                editSelection: editSelection,
            };
        });
    };

    const handleEditSelection = (event) => {
        setEditSelection(event.target.value);
    };

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
                    <BackButton />
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
            <Grid
                className='session-detail-action-control'
                container
                direction='row'
                justify='flex-end'
            >
                <Grid item>
                    <Button
                        className='button'
                        color='secondary'
                        component={NavLink}
                        to={`/registration/course/${course_id}`}
                        variant='outlined'
                    >
                        Course Page
                    </Button>
                </Grid>
                <Grid item></Grid>
                <Grid item>
                    <Button
                        className='editButton'
                        color='primary'
                        onClick={handleEditToggle(true)}
                        variant='outlined'
                    >
                        Reschedule
                    </Button>
                    <Dialog
                        aria-describedby='form-dialog-description'
                        aria-labelledby='form-dialog-title'
                        className='session-view-modal'
                        fullWidth
                        maxWidth='xs'
                        onClose={handleEditToggle(true)}
                        open={edit}
                    >
                        <DialogTitle disableTypography id='form-dialog-title'>
                            Edit Session
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <RadioGroup
                                aria-label='delete'
                                name='delete'
                                onChange={handleEditSelection}
                                value={editSelection}
                            >
                                <FormControlLabel
                                    control={<Radio color='primary' />}
                                    label='This Session'
                                    labelPlacement='end'
                                    value={EDIT_CURRENT_SESSION}
                                />
                                <FormControlLabel
                                    control={<Radio color='primary' />}
                                    label='All Sessions'
                                    labelPlacement='end'
                                    value={EDIT_ALL_SESSIONS}
                                />
                            </RadioGroup>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                color='primary'
                                onClick={handleEditToggle(true)}
                            >
                                Cancel
                            </Button>
                            <Button
                                color='primary'
                                component={NavLink}
                                to={{
                                    pathname: `/scheduler/edit-session/${course_id}/${session_id}/${instructor.user.id}/edit`,
                                    state: { allOrCurrent: editSelection },
                                }}
                            >
                                Confirm to Edit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </>
    );
};

export default SessionView;
