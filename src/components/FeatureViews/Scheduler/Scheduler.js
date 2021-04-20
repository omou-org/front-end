import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { SchedulerContext } from './SchedulerContext';
import Popover from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { fullName } from '../../../utils';
import { useHistory } from 'react-router-dom';
import { instructorPalette } from '../../../theme/muiTheme';
import { findCommonElement } from '../../Form/FormUtils';
import { SessionPopover } from './SessionPopover';
import { OmouSchedulerToolbar } from './OmouSchedulerToolbar';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    sessionPopover: {
        padding: theme.spacing(3),
        height: '100%',
        cursor: 'pointer',
    },
    popover: {
        pointerEvents: 'none',
    },
    sessionInfo: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: theme.spacing(1),
    },
}));

const EventPopoverWrapper = ({ children, popover }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory();

    const handleClick = () => {
        // history.push(`/scheduler/session/${popover.props.session.id}`);
    };

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.target);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <div
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup='true'
                onMouseEnter={handlePopoverOpen}
                // onMouseLeave={handlePopoverClose}
                onClick={handleClick}
            >
                {children}
            </div>
            <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handlePopoverClose}
      >
        <MenuItem onClick={handlePopoverClose}>Profile</MenuItem>
        <MenuItem onClick={handlePopoverClose}>My account</MenuItem>
      </Menu>
            {/* <Popover
                id='mouse-over-popover'
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'left',
                }}
                className={classes.popover}
                disableRestoreFocus
            >
                {popover}
            </Popover> */}
        </>
    );
};

const localizer = momentLocalizer(moment);

const BigCalendar = (props) => {
    const eventStyleGetter = ({ instructor }) => {
        const hashCode = (string) => {
            let hash = 0;
            for (let i = 0; i < string.length; i += 1) {
                hash += string.charCodeAt(i);
            }
            return hash;
        };
        const colorizer = (string) => {
            return instructorPalette[(hashCode(string) % 40) - 2];
        };

        return {
            style: {
                backgroundColor: colorizer(fullName(instructor)),
            },
        };
    };

    return (
        <Calendar
            popup
            localizer={localizer}
            events={props.eventList}
            timeslots={4}
            components={{
                toolbar: OmouSchedulerToolbar,
                eventWrapper: (props) => (
                    <EventPopoverWrapper
                        {...props}
                        popover={<SessionPopover session={props.event} />}
                    />
                ),
            }}
            startAccessor='start'
            endAccessor='end'
            onSelectEvent={props.onSelectEvent}
            style={{ height: 700 }}
            eventPropGetter={eventStyleGetter}
        />
    );
};

const GET_SESSIONS = gql`
    query GetSessionsQuery($timeFrame: String, $timeShift: Int, $userId: ID) {
        sessions(
            timeFrame: $timeFrame
            timeShift: $timeShift
            userId: $userId
        ) {
            id
            endDatetime
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
                enrollmentSet {
                    student {
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                    id
                }
                title
                id
            }
        }
    }
`;

export default function Scheduler() {
    const defaultSchedulerState = {
        timeFrame: 'month',
        timeShift: 0,
        instructorOptions: [],
        selectedInstructors: [],
        courseOptions: [],
        selectedCourses: [],
        studentOptions: [],
        selectedStudents: [],
    };
    const AuthUser = useSelector(({ auth }) => auth);
    const [schedulerState, setSchedulerState] = useState(defaultSchedulerState);
    const [sessionsInView, setSessionsInView] = useState([]);
    const [filteredSessionsInView, setFilteredSessionsInView] = useState([]);

    const setFilteredSessions = (schedulerState, allSessionsInView) => {
        const atLeastOneFilter = (selectedOptions) =>
            selectedOptions.length > 0;

        const filterSessionsBySelectedOptions = (
            selectedOptions,
            sessionsList,
            getMatchId
        ) => {
            if (atLeastOneFilter(selectedOptions)) {
                const selectedIds = selectedOptions.map(
                    (option) => option.value
                );
                const bySelectedOptions = (selectedOptionsList, id) => {
                    if (Array.isArray(id)) {
                        return findCommonElement(selectedOptionsList, id);
                    } else {
                        return selectedOptionsList.includes(id);
                    }
                };
                return sessionsList.filter((session) =>
                    bySelectedOptions(selectedIds, getMatchId(session))
                );
            } else {
                return sessionsList;
            }
        };
        const getInstructorId = (session) => session.instructor.id;
        const sessionsFilteredByInstructors = filterSessionsBySelectedOptions(
            schedulerState.selectedInstructors,
            allSessionsInView,
            getInstructorId
        );

        const getCourseId = (session) => session.course.id;
        const sessionsFilteredByInstructorsAndCourses = filterSessionsBySelectedOptions(
            schedulerState.selectedCourses,
            sessionsFilteredByInstructors,
            getCourseId
        );

        const getStudentId = (session) =>
            session.students.map((student) => student.id);
        const sessionsFilteredByInstructorsCoursesStudents = filterSessionsBySelectedOptions(
            schedulerState.selectedStudents,
            sessionsFilteredByInstructorsAndCourses,
            getStudentId
        );

        setFilteredSessionsInView(sessionsFilteredByInstructorsCoursesStudents);
    };

    useEffect(() => {
        setSchedulerState(defaultSchedulerState);
    }, []);

    useEffect(() => {
        const { timeFrame, timeShift, ...rest } = schedulerState;
        if (timeFrame && timeShift) {
            setSchedulerState({
                ...rest,
                timeFrame,
                timeShift,
            });
        }
    }, [schedulerState.timeFrame, schedulerState.timeShift]);

    useEffect(() => {
        setFilteredSessions(schedulerState, sessionsInView);
    }, [
        schedulerState.selectedInstructors.length,
        schedulerState.selectedCourses.length,
        schedulerState.selectedStudents.length,
    ]);

    const uniqueValuesById = (objectList) => {
        const result = [];
        const map = new Map();
        for (const item of objectList) {
            if (!map.has(item.id)) {
                map.set(item.id, true); // set any value to Map
                result.push(item);
            }
        }
        return result;
    };

    const createOptions = (objectList, labelFunc) =>
        objectList.map((object) => ({
            value: object.id,
            label: labelFunc(object),
        }));

    const isParentOrInstructorLoggedIn =
        AuthUser.accountType === 'PARENT' ||
        AuthUser.accountType === 'INSTRUCTOR';

    const { data, loading, error } = useQuery(GET_SESSIONS, {
        variables: {
            timeFrame: schedulerState.timeFrame,
            timeShift: schedulerState.timeShift,
            ...(isParentOrInstructorLoggedIn && { userId: AuthUser.user.id }),
        },
        onCompleted: (data) => {
            const { sessions } = data;
            const parsedBigCalendarSessions = sessions.map(
                ({
                    id,
                    endDatetime,
                    startDatetime,
                    title,
                    instructor,
                    course,
                }) => ({
                    id,
                    title,
                    course,
                    students: course.enrollmentSet.map(
                        (enrollment) => enrollment.student.user
                    ),
                    start: new Date(startDatetime),
                    end: new Date(endDatetime),
                    instructor: instructor.user,
                })
            );
            setSessionsInView(parsedBigCalendarSessions);
            setFilteredSessions(schedulerState, parsedBigCalendarSessions);

            const instructors = sessions.map(
                (session) => session.instructor.user
            );
            const uniqueInstructors = uniqueValuesById(instructors);
            const instructorOptions = createOptions(
                uniqueInstructors,
                (instructor) => fullName(instructor)
            );

            const courses = sessions.map((session) => session.course);
            const uniqueCourses = uniqueValuesById(courses);
            const courseOptions = createOptions(
                uniqueCourses,
                (course) => course.title
            );

            const enrollmentLists = sessions.map(
                (session) => session.course.enrollmentSet
            );
            const students = enrollmentLists
                .flat()
                .map((enrollment) => enrollment.student.user);
            const uniqueStudents = uniqueValuesById(students);
            const studentOptions = createOptions(uniqueStudents, (student) =>
                fullName(student)
            );

            setSchedulerState((prevState) => ({
                ...prevState,
                instructorOptions,
                courseOptions,
                studentOptions,
            }));
        },
    });

    const updateSchedulerState = (newState) => setSchedulerState(newState);

    return (
        <SchedulerContext.Provider
            value={{ schedulerState, updateSchedulerState }}
        >
            <Typography
                variant='h1'
                align='left'
                style={{ marginBottom: '24px' }}
            >
                Scheduler
            </Typography>
            <BigCalendar eventList={filteredSessionsInView} />
        </SchedulerContext.Provider>
    );
}
