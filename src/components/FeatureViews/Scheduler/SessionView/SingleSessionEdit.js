import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Prompt, useParams } from 'react-router-dom';

import gql from 'graphql-tag';
// import LeavePageModal from '../../OmouComponents/LeavePageModal';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import Loading from '../../../OmouComponents/Loading';
import { darkBlue, darkGrey, statusRed } from '../../../../theme/muiTheme';
import { QueryBuilder } from '@material-ui/icons';
import { fullName, USER_TYPES } from '../../../../utils';
import moment from 'moment';
import AccessControlComponent from '../../../OmouComponents/AccessControlComponent';
import { EditSessionDropDown } from './EditSessionUtilComponents';
import { SnackBarComponent } from '../../../OmouComponents/SnackBarComponent';
import 'date-fns';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';
import SaveSessionEditsButton from './SaveSessionEditsButton';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import NavLinkNoDup from '../../../Routes/NavLinkNoDup';
import SessionEditReceipt from './SessionEditReceipt';
// import {renderCourseAvailabilitiesString} from "../../../OmouComponents/CourseAvailabilities";

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
                courseType
                availabilityList {
                    dayOfWeek
                    startTime
                    endTime
                }
                activeAvailabilityList {
                    dayOfWeek
                    startTime
                    endTime
                    id
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

const UPDATE_SESSION_MUTATION = gql`
    mutation updateSessionMutation(
        $endDateTime: DateTime
        $sessionId: ID!
        $instructorId: ID
        $startDateTime: DateTime
    ) {
        createSession(
            endDatetime: $endDateTime
            id: $sessionId
            instructor: $instructorId
            startDatetime: $startDateTime
        ) {
            created
            session {
                endDatetime
                id
                instructor {
                    user {
                        lastName
                        id
                        firstName
                    }
                }
                isConfirmed
                startDatetime
                title
                details
            }
        }
    }
`;

const CHECK_SCHEDULE_CONFLICTS = gql`
    query checkScheduleConflicts(
        $date: String!
        $startTime: String!
        $endTime: String!
        $instructorId: ID!
    ) {
        validateSessionSchedule(
            date: $date
            endTime: $endTime
            instructorId: $instructorId
            startTime: $startTime
        ) {
            reason
            status
        }
    }
`;

const SingleSessionEdit = () => {
    const { session_id } = useParams();
    const classes = useStyles();
    const [subjectValue, setSubjectValue] = useState('');
    const [instructorValue, setInstructorValue] = useState('');
    const [sessionStartTime, setSessionsStartTime] = useState('');
    const [sessionEndTime, setSessionsEndTime] = useState('');
    const [sessionDate, setSessionsDate] = useState('');
    const [snackBarState, setSnackBarState] = useState(false);
    const [newState, setNewState] = useState({});

    const [timeValidationError, setTimeValidationError] = useState(false);

    const { data, loading, error } = useQuery(GET_SESSION, {
        variables: { sessionId: session_id },
        onCompleted: (data) => {
            const {
                session: {
                    startDatetime,
                    endDatetime,
                    course: { instructor, courseCategory },
                },
            } = data;

            setSessionsDate(moment(startDatetime)._d);
            setSessionsStartTime(moment(startDatetime)._d);
            setSessionsEndTime(moment(endDatetime)._d);
            setInstructorValue(instructor.user.id);
            setSubjectValue(courseCategory.id);
            setNewState(true);
        },
    });

    useEffect(() => {
        if (
            instructorValue &&
            subjectValue &&
            sessionStartTime &&
            sessionEndTime
        ) {
            const instructorStateName = fullName(
                instructors.find(
                    (instructor) => instructor.user.id === instructorValue
                )?.user
            );
            const courseCategoryStateName = subjects.find(
                (subject) => subject.id === subjectValue
            )?.name;
            const courseStartTimeState = moment(sessionStartTime).format();
            const courseEndTimeState = moment(sessionEndTime).format();
            const courseTimeAndDateState = `${moment(sessionStartTime).format(
                'dddd, MMMM DD'
            )} at ${moment(sessionStartTime).format('h:mm A')} - ${moment(
                sessionEndTime
            ).format('h:mm A')}`;
            if (
                courseStartTimeState !== newState.startDateTime ||
                courseEndTimeState !== newState.endDateTime ||
                instructorStateName !== newState.instructor ||
                courseCategoryStateName !== newState.courseCategory
            ) {
                setNewState(
                    JSON.stringify({
                        subject: courseCategoryStateName,
                        instructor: instructorStateName,
                        'date & time': courseTimeAndDateState,
                    })
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subjectValue, sessionStartTime, sessionEndTime, instructorValue]);

    const [
        checkScheduleConflicts,
        { loading: conflictLoading, data: conflictData },
    ] = useLazyQuery(CHECK_SCHEDULE_CONFLICTS, {
        onCompleted: ({ validateSessionSchedule }) => {
            const { status } = validateSessionSchedule;
            if (!status) {
                setSnackBarState(true);
            }
            console.log('completed validation');
        },
    });

    const [updateSession] = useMutation(UPDATE_SESSION_MUTATION, {
        onError: (err) => console.error(err),
    });

    if (loading || conflictLoading || !subjectValue || !instructorValue)
        return <Loading />;

    if (error) return <Typography>{"There's been an error!"}</Typography>;

    const {
        session: { id: sessionId, startDatetime },
        courseCategories: subjects,
        instructors,
    } = data;

    // const subjectName = subjects.find(
    //     (subject) => subject.id == subjectValue
    // ).name;

    // const instructorName = fullName(
    //     instructors.find((instructor) => instructor.user.id == instructorValue)
    //         .user
    // );

    // const studentName = fullName(enrollmentSet[0].student.user);

    const dayOfWeek = moment(startDatetime).format('dddd');
    const monthAndDate = moment(sessionDate).format('MMMM DD');
    const startSessionTime = moment(sessionStartTime).format('h:mm A');
    const endSessionTime = moment(sessionEndTime).format('h:mm A');

    const handleUpdateSession = () => {
        const startSessionTime = moment(sessionStartTime).format('HH:mm');
        const endSessionTime = moment(sessionEndTime).format('HH:mm');
        const sessionISODate = moment(sessionDate).format('YYYY-MM-DD');
        const startDateTime = moment(
            sessionISODate + ' ' + startSessionTime
        ).format();
        const endDateTime = moment(
            sessionISODate + ' ' + endSessionTime
        ).format();

        updateSession({
            variables: {
                sessionId,
                startDateTime,
                endDateTime,
                instructorId: instructorValue,
            },
        });
    };

    const handleTimeDateChange = (setState, isEndTime) => async (date) => {
        const timeIsValid = isEndTime
            ? moment(sessionStartTime).isBefore(moment(date))
            : moment(date).isBefore(moment(sessionEndTime));

        !timeIsValid && setTimeValidationError(true);
        timeIsValid && setTimeValidationError(false);

        setState(date._d);
        if (!sessionStartTime || !sessionDate || !sessionEndTime) {
            // Place holder for other validation
            console.log('blocked');
        } else {
            await checkScheduleConflicts({
                variables: {
                    instructorId: instructorValue,
                    startTime: moment(date._d).format('HH:mm'),
                    endTime: moment(date._d).format('HH:mm'),
                    date: moment(date._d).format('YYYY-MM-DD'),
                },
            });
        }
    };

    const snackBarData = {
        title: 'SESSION CONFLICTS',
        icon: (
            <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <ellipse
                    cx='13.6799'
                    cy='10.8707'
                    rx='5.28'
                    ry='8.4'
                    fill='white'
                />
                <path
                    d='M12.0187 0C5.39338 0 0 4.8622 0 10.8393C0 16.8164 5.39338 21.6786 12.0187 21.6786C13.2582 21.6771 14.4917 21.5 15.6844 21.1521L19.8383 23.8774C19.9517 23.9524 20.0826 23.9946 20.2173 23.9995C20.3519 24.0044 20.4854 23.972 20.6037 23.9055C20.7219 23.839 20.8207 23.7409 20.8896 23.6215C20.9585 23.5022 20.9949 23.3659 20.9951 23.2271V18.0165C21.935 17.0871 22.6851 15.9734 23.2011 14.7408C23.7171 13.5082 23.9887 12.1817 23.9998 10.8393C24.0374 4.8622 18.644 0 12.0187 0ZM11.2149 5.13318C11.2026 4.98261 11.2207 4.83105 11.2682 4.68807C11.3156 4.5451 11.3913 4.41384 11.4905 4.30259C11.5897 4.19134 11.7103 4.10252 11.8445 4.04177C11.9787 3.98102 12.1237 3.94965 12.2703 3.94965C12.4169 3.94965 12.5619 3.98102 12.6962 4.04177C12.8304 4.10252 12.9509 4.19134 13.0501 4.30259C13.1493 4.41384 13.225 4.5451 13.2725 4.68807C13.3199 4.83105 13.338 4.98261 13.3257 5.13318V12.6975C13.338 12.848 13.3199 12.9996 13.2725 13.1426C13.225 13.2855 13.1493 13.4168 13.0501 13.528C12.9509 13.6393 12.8304 13.7281 12.6962 13.7889C12.5619 13.8496 12.4169 13.881 12.2703 13.881C12.1237 13.881 11.9787 13.8496 11.8445 13.7889C11.7103 13.7281 11.5897 13.6393 11.4905 13.528C11.3913 13.4168 11.3156 13.2855 11.2682 13.1426C11.2207 12.9996 11.2026 12.848 11.2149 12.6975V5.13318ZM12.2741 18.5662C11.9963 18.5662 11.7247 18.4812 11.4937 18.3222C11.2627 18.1631 11.0826 17.937 10.9763 17.6724C10.87 17.4078 10.8422 17.1167 10.8964 16.8359C10.9506 16.555 11.0844 16.2971 11.2808 16.0946C11.4773 15.8921 11.7276 15.7542 12 15.6983C12.2725 15.6425 12.555 15.6711 12.8116 15.7807C13.0683 15.8903 13.2877 16.0759 13.442 16.314C13.5964 16.5521 13.6788 16.832 13.6788 17.1183C13.6768 17.501 13.5279 17.8673 13.2647 18.1371C13.0015 18.4069 12.6453 18.5584 12.2741 18.5584V18.5662Z'
                    fill='#FF6766'
                />
            </svg>
        ),
        date: `${dayOfWeek}, ${monthAndDate} at ${startSessionTime} - ${endSessionTime}`,
        message: conflictData?.validateSessionSchedule.reason,
        messageColor: statusRed,
        vertical: 'bottom',
        horizontal: 'left',
    };

    const formatStates = () => {
        const {
            session: { startDatetime, endDatetime, course },
        } = data;
        const courseTimeAndDateState = `${moment(startDatetime).format(
            'dddd, MMMM DD'
        )} at ${moment(startDatetime).format('h:mm A')} - ${moment(
            endDatetime
        ).format('h:mm A')}`;
        return JSON.stringify({
            subject: course.courseCategory.name,
            instructor: fullName(course.instructor.user),
            'date & time': courseTimeAndDateState,
        });
    };

    return (
        <>
            <Prompt
                message={`Are you sure you want to leave? Any unsaved changes will be lost.`}
            />
            <Divider className={classes.divider} />
            <Grid container direction='row' style={{ marginTop: '2em' }}>
                <Grid item xs={12} style={{ marginBottom: '1.5em' }}>
                    <Typography className={classes.new_sessions_typography}>
                        Update Session:
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '1.5em' }}>
                    <Typography className={classes.subtitle}>
                        DATE & TIME
                    </Typography>
                </Grid>
                <Grid item container style={{ marginBottom: '2.8125em' }}>
                    <Grid item xs={2} lg={3} xl={2}>
                        <KeyboardDatePicker
                            style={{ float: 'left', width: '11em' }}
                            value={sessionDate}
                            onChange={handleTimeDateChange(setSessionsDate)}
                        />
                        <span>at</span>
                    </Grid>
                    <Grid item xs={2} lg={3} xl={2}>
                        <KeyboardTimePicker
                            keyboardIcon={<QueryBuilder />}
                            style={{ float: 'left', width: '11em' }}
                            value={sessionStartTime}
                            onChange={handleTimeDateChange(
                                setSessionsStartTime,
                                false
                            )}
                            error={timeValidationError}
                            helperText={timeValidationError && 'Invalid Time'}
                        />
                        <span>-</span>
                    </Grid>
                    <Grid item xs={2}>
                        <KeyboardTimePicker
                            keyboardIcon={<QueryBuilder />}
                            style={{ float: 'left' }}
                            value={sessionEndTime}
                            onChange={handleTimeDateChange(
                                setSessionsEndTime,
                                true
                            )}
                            error={timeValidationError}
                            helperText={timeValidationError && 'Invalid Time'}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        item
                        container
                        direction='column'
                        xs={2}
                        lg={3}
                        xl={2}
                        alignItems='flex-start'
                    >
                        <Grid item>
                            <Typography
                                className={classes.subtitle}
                                style={{ marginBottom: '1.5em' }}
                            >
                                SUBJECT
                            </Typography>
                        </Grid>
                        <Grid item>
                            <EditSessionDropDown
                                noValueLabel='All Subjects'
                                itemLabel={(item) => item.name}
                                itemId={(item) => item.id}
                                setState={setSubjectValue}
                                queryList={subjects}
                                value={subjectValue}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        direction='column'
                        xs={2}
                        lg={3}
                        xl={2}
                        alignItems='flex-start'
                    >
                        <Grid>
                            <Typography
                                className={classes.subtitle}
                                style={{ marginBottom: '1.5em' }}
                            >
                                INSTRUCTOR
                            </Typography>
                        </Grid>
                        <Grid>
                            <EditSessionDropDown
                                noValueLabel='All Instructors'
                                itemLabel={(item) => fullName(item.user)}
                                itemId={(item) => item.user.id}
                                setState={setInstructorValue}
                                queryList={instructors}
                                value={instructorValue}
                            />
                        </Grid>
                    </Grid>
                    {/* This section is for when we have a getRoom query */}
                    {/* <Grid item xs={2}>
                    <Typography className={classes.subtitle} style={{marginBottom: '.5em'}}>
                        ROOM
                    </Typography>
                    <EditSessionDropDown
                        initialValue='All Rooms'
                        setState={setSubjectValue}
                        value={subjectValue}
                    />
                    </Grid> */}
                </Grid>
                <SnackBarComponent
                    snackBarData={snackBarData}
                    snackBarState={snackBarState}
                    setSnackBarState={setSnackBarState}
                />
            </Grid>

            <Grid container direction='row' justify='flex-end' spacing={1}>
                <Grid item>
                    <ResponsiveButton
                        variant='outlined'
                        value='cancel'
                        component={NavLinkNoDup}
                        to={`/scheduler/session/${sessionId}`}
                    >
                        Cancel
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
                        <SaveSessionEditsButton
                            // studentName={studentName}
                            updateSession={handleUpdateSession}
                        >
                            <SessionEditReceipt
                                databaseState={formatStates()}
                                newState={newState}
                            />
                        </SaveSessionEditsButton>
                    </AccessControlComponent>
                </Grid>
            </Grid>
        </>
    );
};

export default SingleSessionEdit;