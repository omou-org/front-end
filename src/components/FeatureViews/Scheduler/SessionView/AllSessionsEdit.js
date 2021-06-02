/*eslint no-unused-vars: "warn"*/
import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import Loading from '../../../OmouComponents/Loading';
import { darkBlue, darkGrey } from '../../../../theme/muiTheme';
import { ResponsiveButton } from '../../../../theme/ThemedComponents/Button/ResponsiveButton';
import AccessControlComponent from '../../../OmouComponents/AccessControlComponent';
import {
    EditMultiSessionFields,
    EditSessionDropDown,
} from './EditSessionUtilComponents';
import { SnackBarComponent } from '../../../OmouComponents/SnackBarComponent';
import Grid from '@material-ui/core/Grid';
import { fullName, USER_TYPES } from '../../../../utils';
import SaveSessionEditsButton from './SaveSessionEditsButton';
import Box from '@material-ui/core/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { KeyboardDatePicker } from '@material-ui/pickers';
import moment from 'moment';
import SessionEditReceipt from './SessionEditReceipt';
import { renderCourseAvailabilitiesString } from '../../../OmouComponents/CourseAvailabilities';

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
    dayPicker: {
        margin: '0px',
        padding: '0px',
        width: '11em',
        float: 'left',
    },
}));

const GET_SESSION = gql`
    query SessionViewQuery($sessionId: ID!) {
        session(sessionId: $sessionId) {
            id
            course {
                id
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
            }
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

const UPDATE_ALL_SESSIONS_MUTATION = gql`
    mutation updateAllSessionsMutation(
        $courseId: ID!
        $instructorId: ID
        $startDate: DateTime
        $endDate: DateTime
        $availabilities: [CourseAvailabilityInput]
    ) {
        createCourse(
            id: $courseId
            instructor: $instructorId
            startDate: $startDate
            endDate: $endDate
            availabilities: $availabilities
        ) {
            course {
                id
                startDate
                endDate
                instructor {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
                availabilityList {
                    endTime
                    dayOfWeek
                    startTime
                    id
                }
            }
        }
    }
`;

const AllSessionsEdit = () => {
    const { session_id } = useParams();
    const classes = useStyles();
    const [subjectValue, setSubjectValue] = useState(null);
    const [instructorValue, setInstructorValue] = useState(null);
    const [courseStartDate, setCourseStartDate] = useState(null);
    const [courseEndDate, setCourseEndDate] = useState(null);
    const [snackBarState, setSnackBarState] = useState(false);
    const [courseAvailabilities, setCourseAvailabilities] = useState([]);
    const [newState, setNewState] = useState({});
    const [snackData, setSnackData] = useState({});

    const { data, loading, error } = useQuery(GET_SESSION, {
        variables: { sessionId: session_id },
        onCompleted: (data) => {
            const {
                session: {
                    course: {
                        instructor,
                        courseCategory,
                        activeAvailabilityList,
                        startDate,
                        endDate,
                    },
                },
                instructors,
                courseCategories: subjects,
            } = data;

            setCourseAvailabilities(activeAvailabilityList);
            setInstructorValue(instructor.user.id);
            setSubjectValue(courseCategory.id);
            setCourseStartDate(moment(startDate));
            setCourseEndDate(moment(endDate));
            setNewState(true);
        },
    });

    const [updateAllSessions] = useMutation(UPDATE_ALL_SESSIONS_MUTATION);

    useEffect(() => {
        if (
            courseAvailabilities.length > 0 &&
            instructorValue &&
            subjectValue &&
            courseStartDate &&
            courseEndDate
        ) {
            const newCourseAvailabilities = renderCourseAvailabilitiesString(
                JSON.parse(JSON.stringify(courseAvailabilities))
            );
            const instructorStateName = fullName(
                instructors.find(
                    (instructor) => instructor.user.id === instructorValue
                )?.user
            );
            const courseCategoryStateName = subjects.find(
                (subject) => subject.id === subjectValue
            )?.name;
            const courseStartDateState =
                courseStartDate.format('YYYY-MM-DD[T]HH:mm');
            const courseEndDateState =
                courseEndDate.format('YYYY-MM-DD[T]HH:mm');
            if (
                newCourseAvailabilities !== newState.availabilities ||
                courseStartDateState !== newState.startDate ||
                courseEndDateState !== newState.endDate ||
                instructorStateName !== newState.instructor ||
                courseCategoryStateName !== newState.courseCategory
            ) {
                // const courseTimeAndDateState = `${moment(startDatetime).format('dddd, MMMM DD')} at ${moment(startDatetime).format('h:mm A')} - ${moment(endDatetime).format('h:mm A')}`;
                setNewState(
                    JSON.stringify({
                        subject: courseCategoryStateName,
                        instructor: instructorStateName,
                        availabilities: newCourseAvailabilities,
                        startDate: courseStartDateState,
                        endDate: courseEndDateState,
                    })
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        courseAvailabilities,
        subjectValue,
        courseStartDate,
        courseEndDate,
        instructorValue,
    ]);

    if (loading) return <Loading />;

    if (error) return <Typography>{`There's been an error!`}</Typography>;

    const {
        courseCategories: subjects,
        instructors,
        session: { course },
    } = data;
    //
    // const { courseCategories: subjects, instructors } = data;

    const handleCourseAvailabilities = (courseAvailability) => {
        setCourseAvailabilities((prevState) => {
            const courseAvailabilityIndex = prevState.findIndex(
                (availability) => availability.id == courseAvailability.id
            );
            let newAvailabilities = JSON.parse(JSON.stringify(prevState));
            if (courseAvailabilityIndex > -1) {
                newAvailabilities[courseAvailabilityIndex] = JSON.parse(
                    JSON.stringify(courseAvailability)
                );
            } else {
                newAvailabilities.push(courseAvailability);
            }
            return newAvailabilities;
        });
    };

    const handleAddCourseAvailability = () => {
        setCourseAvailabilities((prevState) => {
            const newAvailability = {
                id: `new-${prevState.length}`,
                dayOfWeek: '',
                startTime: null,
                endTime: null,
            };
            return [...prevState, newAvailability];
        });
    };

    const removeCourseAvailability = (availabilityId) => {
        setCourseAvailabilities((prevState) => {
            const newCourseAvailabilities = prevState.filter(
                (availability) => availability.id !== availabilityId
            );
            return newCourseAvailabilities;
        });
    };

    const handleDateChange = (setDate) => (e) => {
        setDate(e);
    };

    const formatTime = (time) =>
        time.length < 11 ? `2021-01-01T${time}` : time;

    const formatAvailabilities = (courseAvailabilities) =>
        courseAvailabilities.map(({ dayOfWeek, startTime, endTime }) => ({
            dayOfWeek,
            startTime: moment(formatTime(startTime)).format('HH:mm'),
            endTime: moment(formatTime(endTime)).format('HH:mm'),
        }));

    const handleSubmitEdits = () => {
        const availabilities = formatAvailabilities(courseAvailabilities);
        console.log(availabilities);
        updateAllSessions({
            variables: {
                courseId: course.id,
                startDate: courseStartDate.format('YYYY-MM-DD[T]HH:mm'),
                endDate: courseEndDate.format('YYYY-MM-DD[T]HH:mm'),
                availabilities,
            },
        });
    };

    const formatStates = () => {
        const {
            session: { course },
        } = data;
        return {
            subject: course.courseCategory.name,
            instructor: fullName(course.instructor.user),
            availabilities: renderCourseAvailabilitiesString(
                course.activeAvailabilityList
            ),
            startDate: moment(course.startDate).format('YYYY-MM-DD[T]HH:mm'),
            endDate: moment(course.endDate).format('YYYY-MM-DD[T]HH:mm'),
        };
    };

    return (
        <>
            <Divider className={classes.divider} />
            <Grid
                container
                direction='column'
                style={{ marginTop: '2em' }}
                alignItems='flex-start'
                spacing={2}
            >
                <Grid item xs={12} style={{ marginBottom: '1.5em' }}>
                    <Typography className={classes.new_sessions_typography}>
                        Update Sessions:
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography className={classes.subtitle}>
                        DATE & TIME
                    </Typography>
                </Grid>
                <Grid item container direction='row' spacing={3}>
                    <Grid item>
                        <KeyboardDatePicker
                            format='M/D/YYYY'
                            id='course-start-date'
                            value={courseStartDate}
                            onChange={handleDateChange(setCourseStartDate)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            label='Start Date'
                        />
                    </Grid>
                    <Grid item>
                        <KeyboardDatePicker
                            format='M/D/YYYY'
                            id='course-end-date'
                            value={courseEndDate}
                            onChange={handleDateChange(setCourseEndDate)}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            label='End Date'
                        />
                    </Grid>
                </Grid>
                <Grid item container>
                    {courseAvailabilities.map((availability) => (
                        <EditMultiSessionFields
                            getCourseAvailability={handleCourseAvailabilities}
                            removeCourseAvailability={removeCourseAvailability}
                            availability={availability}
                            key={availability.id}
                            setSnackData={setSnackData}
                            instructorValue={instructorValue}
                        />
                    ))}
                </Grid>
                <Box paddingBottom='25px'>
                    <Grid item container direction='row' alignItems='center'>
                        <ResponsiveButton
                            onClick={handleAddCourseAvailability}
                            startIcon={<AddCircleIcon />}
                        >
                            Add Day & Time
                        </ResponsiveButton>
                    </Grid>
                </Box>
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
                        <Grid>
                            <Typography
                                className={classes.subtitle}
                                style={{ marginBottom: '1.5em' }}
                            >
                                SUBJECT
                            </Typography>
                        </Grid>
                        <Grid>
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
                        snackBarData={snackData}
                    snackBarState={snackData?.open}
                    setSnackBarState={setSnackData}
                    />
            </Grid>

            <Grid container direction='row' justify='flex-end' spacing={1}>
                <Grid item>
                    <ResponsiveButton
                        component={NavLink}
                        to={`/scheduler/session/${session_id}`}
                        variant='outlined'
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
                            courseConfirmationData="Jimmy"
                            updateSession={handleSubmitEdits}
                            isAll
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
/*eslint no-unused-vars: "warn"*/
export default AllSessionsEdit;
