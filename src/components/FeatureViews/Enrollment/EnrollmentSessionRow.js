import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import SessionPaymentStatusChip from 'components/OmouComponents/SessionPaymentStatusChip';
import moment from 'moment';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    darkRow: {
        backgroundColor: '#EEEEEE',
    },
}));

function EnrollmentSessionRow({ session, enrollmentData, highlightSession }) {
    const classes = useStyles();
    const { id } = enrollmentData.enrollment;
    const tuitionStartTime = moment(session.startDatetime).format('hh');
    const tuitionEndTime = moment(session.endDatetime).format('hh');
    const tuition =
        session.course.hourlyTuition * (tuitionEndTime - tuitionStartTime);
    const today = moment(new Date());
    const sessionDate = moment(session.startDatetime);
    const sessionDaysFromToday = sessionDate.diff(today, 'days');
    const isUpcomingSession =
        7 >= sessionDaysFromToday && sessionDaysFromToday > 0;
    const isHighlightSession = highlightSession && isUpcomingSession;

    return (
        <TableRow
            component={Link}
            data-cy='view-session-link'
            key={id}
            to={`/scheduler/session/${session.id}`}
            className={`session-info
                    ${isHighlightSession && classes.darkRow}
                    ${session.id == session.id && 'upcoming-session'}
                 `}
        >
            <TableCell>
                <Typography align='left'>
                    <Moment date={session.startDatetime} format='M/D/YYYY' />
                </Typography>
            </TableCell>
            <TableCell>
                <Typography align='left'>
                    <Typography align='left'>
                        <Moment date={session.startDatetime} format='dddd' />
                    </Typography>
                </Typography>
            </TableCell>
            <TableCell>
                <Typography align='left'>
                    <Moment date={session.startDatetime} format='h:mm A' />
                    {' - '}
                    <Moment date={session.endDatetime} format='h:mm A' />
                </Typography>
            </TableCell>
            <TableCell>
                {/* hourly rate * endtime-starttime */}
                <Typography align='left'>${tuition}</Typography>
            </TableCell>
            <TableCell>
                <SessionPaymentStatusChip
                    enrollment={enrollmentData.enrollment}
                    session={session}
                    setPos
                />
            </TableCell>
        </TableRow>
    );
}

export default EnrollmentSessionRow;
