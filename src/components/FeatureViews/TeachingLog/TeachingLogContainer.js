import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import Loading from '../../OmouComponents/Loading';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Grid from '@material-ui/core/Grid';
import { fullName, getDuration } from '../../../utils';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TeachingLogEntry from './TeachingLogEntry';
import { ReactComponent as IDIcon } from '../../identifier.svg';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { lightPrimaryFontColor, omouBlue } from '../../../theme/muiTheme';
import SummaryEntry from './SummaryEntry';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';
import { DateRange } from 'react-date-range';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import NoListAlert from '../../OmouComponents/NoListAlert';

const GET_INSTRUCTOR_SESSIONS = gql`
    query GetInstructorSessions(
        $instructorId: ID!
        $startDate: String!
        $endDate: String!
    ) {
        __typename
        sessions(
            instructorId: $instructorId
            startDate: $startDate
            endDate: $endDate
        ) {
            id
            title
            endDatetime
            startDatetime
            instructor {
                user {
                    id
                    lastName
                    firstName
                }
            }
            course {
                id
                title
                enrollmentSet {
                    student {
                        user {
                            lastName
                            firstName
                        }
                    }
                }
                endDate
                startDate
                academicLevel
            }
        }
    }
`;

const iconSpacing = 16;

const useStyles = makeStyles({
    profileInfo: {
        display: 'flex',
        alignItems: 'center',
        '& *': {
            marginRight: iconSpacing + 'px',
        },
        color: lightPrimaryFontColor,
        height: '2.5em',
        fontSize: '14px',
    },
    profileName: {
        fontSize: '24px',
        fontWeight: 500,
        marginBottom: '6px;',
    },
    summaryLogRoot: {
        border: 'solid 1px rgba(224, 224, 224, 1)',
    },
    slHead: {
        backgroundColor: omouBlue,
    },
    slHeadCell: {
        color: 'white',
    },
    calendarPickerRoot: {},
});

const TeachingLogHeader = () => (
    <TableHead>
        <TableRow>
            <TableCell>Session ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Session Title</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Total (hours)</TableCell>
            <TableCell />
        </TableRow>
    </TableHead>
);

export default function TeachingLogContainer() {
    const classes = useStyles();
    const AuthUser = useSelector(({ auth }) => auth);
    const [getSessions, { loading, data }] = useLazyQuery(
        GET_INSTRUCTOR_SESSIONS
    );
    const [state, setState] = useState([
        {
            startDate: moment().subtract(2, 'week').toDate(),
            endDate: moment().toDate(),
            key: 'selection',
        },
    ]);
    const [openCalendar, setOpenCalendar] = useState(false);

    useEffect(() => {
        getSessions({
            variables: {
                instructorId: AuthUser.user.id,
                startDate: moment().subtract(2, 'week').toISOString(),
                endDate: moment().toISOString(),
            },
        });
    }, []);

    const handleDateRangeCalendarChange = (item) => {
        const newDateRange = item.selection;
        setState([newDateRange]);
    };

    const handleSaveDateRange = () => {
        setOpenCalendar(false);
        getSessions({
            variables: {
                instructorId: AuthUser.user.id,
                startDate: state[0].startDate.toISOString(),
                endDate: state[0].endDate.toISOString(),
            },
        });
    };

    const { sessions } = data || { sessions: [] };
    const getGrade = {
        COLLEGE_LVL: 'College',
        HIGH_LVL: 'High School',
        MIDDLE_LVL: 'Middle School',
        ELEMENTARY_LVL: 'Elementary School',
    };

    const summaryHoursLog =
        sessions.length > 0
            ? sessions.reduce((acc, session) => {
                  acc[session.course.id] =
                      acc[session.course.id] +
                          Number(
                              getDuration(
                                  session.startDatetime,
                                  session.endDatetime
                              )
                          ) ||
                      Number(
                          getDuration(
                              session.startDatetime,
                              session.endDatetime
                          )
                      );
                  return acc;
              })
            : [];
    let courses = {};
    const summaryLog =
        sessions.length > 0
            ? sessions
                  .map(({ course: { id, title, academicLevel } }) => ({
                      courseId: id,
                      title: title,
                      grade: getGrade[academicLevel],
                      hours: summaryHoursLog[id],
                  }))
                  .filter((session) => {
                      if (courses[session.courseId]) {
                          return false;
                      }
                      courses[session.courseId] = true;
                      return true;
                  })
            : [];

    const teachingLogCSVData =
        sessions.length > 0
            ? sessions.map(({ title, endDatetime, startDatetime, id }) => ({
                  id: id,
                  date: moment(startDatetime).format('MM/DD/YYYY'),
                  title: title,
                  startTime: moment(startDatetime).format('h:mm a'),
                  endTime: moment(endDatetime).format('h:mm a'),
                  duration: moment
                      .duration(moment(endDatetime).diff(moment(startDatetime)))
                      .asHours(),
              }))
            : [];
    const teachingLogHeader = [
        { label: 'Session ID', key: 'id' },
        { label: 'Date', key: 'date' },
        { label: 'Session Title', key: 'title' },
        { label: 'Start Time', key: 'startTime' },
        { label: 'End Time', key: 'endTime' },
        { label: 'Duration', key: 'duration' },
    ];
    const fileName = `${AuthUser.user.firstName}${
        AuthUser.user.lastName
    }_${moment(state[0].startDate).format('MMDD')}-${moment(
        state[0].endDate
    ).format('MMDD')}_${moment(state[0].endDate).format('YYYY')}_log.csv`;

    return (
        <>
            <Grid container direction='row' spacing={4}>
                <Grid item container justify='space-between'>
                    <Grid item>
                        <ButtonGroup variant='contained'>
                            <Button style={{ backgroundColor: omouBlue }}>
                                <CalendarIcon style={{ color: 'white' }} />
                            </Button>
                            <Button
                                style={{
                                    fontWeight: 500,
                                    backgroundColor: 'white',
                                }}
                                onClick={() => setOpenCalendar(true)}
                            >
                                <Moment
                                    date={state[0].startDate}
                                    format='MM/DD/YYYY'
                                />
                            </Button>
                            <Button
                                style={{
                                    fontWeight: 500,
                                    backgroundColor: 'white',
                                }}
                                onClick={() => setOpenCalendar(true)}
                            >
                                <Moment
                                    date={state[0].endDate}
                                    format='MM/DD/YYYY'
                                />
                            </Button>
                        </ButtonGroup>
                        <Dialog
                            open={openCalendar}
                            onClose={handleSaveDateRange}
                        >
                            <DateRange
                                editableDateInputs={true}
                                onChange={(item) =>
                                    handleDateRangeCalendarChange(item)
                                }
                                moveRangeOnFirstSelection={false}
                                ranges={state}
                            />
                            <DialogActions>
                                <ResponsiveButton
                                    variant='outlined'
                                    onClick={handleSaveDateRange}
                                >
                                    Save & Close
                                </ResponsiveButton>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid item>
                        <ButtonGroup>
                            <CSVLink
                                headers={teachingLogHeader}
                                data={teachingLogCSVData}
                                filename={fileName}
                                style={{ textDecorationLine: 'none' }}
                            >
                                <ResponsiveButton variant='outlined'>
                                    Download
                                </ResponsiveButton>
                            </CSVLink>
                            <ResponsiveButton variant='outlined'>
                                Print
                            </ResponsiveButton>
                        </ButtonGroup>
                    </Grid>
                </Grid>
                <Grid item container direction='row' justify='space-between'>
                    <Grid item>
                        <Typography
                            align='left'
                            className={classes.profileName}
                        >
                            {fullName(AuthUser.user)}
                        </Typography>
                        <Typography
                            align='left'
                            className={classes.profileInfo}
                        >
                            <IDIcon />
                            {AuthUser.user.id}
                        </Typography>
                        <Typography
                            align='left'
                            className={classes.profileInfo}
                        >
                            <PhoneIcon />
                            {AuthUser.phoneNumber}
                        </Typography>
                        <Typography
                            align='left'
                            className={classes.profileInfo}
                        >
                            <EmailIcon />
                            {AuthUser.user.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Table className={classes.summaryLogRoot}>
                            <TableHead>
                                <TableRow className={classes.slHead}>
                                    <TableCell className={classes.slHeadCell}>
                                        Course Title
                                    </TableCell>
                                    <TableCell className={classes.slHeadCell}>
                                        Total Hours
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sessions.length > 0 &&
                                    summaryLog.map(
                                        ({ title, hours, grade, courseId }) => (
                                            <SummaryEntry
                                                key={courseId}
                                                title={title}
                                                hours={hours}
                                                grade={grade}
                                            />
                                        )
                                    )}
                                <TableRow>
                                    <TableCell>
                                        <b>Total Hours</b>
                                    </TableCell>
                                    <TableCell>
                                        {sessions.length > 0 &&
                                        summaryLog.reduce(
                                            (totalHours, course) =>
                                                totalHours + course.hours,
                                            0
                                        ) === Number.NaN
                                            ? 'Error'
                                            : summaryLog.reduce(
                                                  (totalHours, course) =>
                                                      totalHours + course.hours,
                                                  0
                                              )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {loading ? (
                        <Loading small />
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TeachingLogHeader />
                                    {sessions.length > 0 &&
                                        sessions.map((session) => (
                                            <TeachingLogEntry
                                                key={session.id}
                                                session={session}
                                            />
                                        ))}
                                </Table>
                            </TableContainer>
                            {sessions.length === 0 && (
                                <Grid contianer>
                                    <NoListAlert
                                        list={`sessions have been taught`}
                                    />
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </>
    );
}
