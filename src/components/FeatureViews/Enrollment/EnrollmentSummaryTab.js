import React, {useCallback, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import EnrollmentSessionRow from './EnrollmentSessionRow';
import NoListAlert from '../../OmouComponents/NoListAlert';
import {ResponsiveButton} from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {TableCell} from '@material-ui/core';
import TableBody from '@material-ui/core/TableBody';
import PropTypes from "prop-types";

function EnrollmentSummaryTab({sessions, enrollment}) {
    const [highlightSession, setHighlightSession] = useState(false);

    const handleHighlightSwitch = useCallback(() => {
        setHighlightSession((prevHighlight) => !prevHighlight);
    }, []);

    return (
        <Grid container direction='column' spacing={3}>
            <Grid item container direction='row' justify='space-between'>
                <Grid item>Tuition Rate: $$</Grid>
                <Grid item>
                    <ResponsiveButton
                        onClick={handleHighlightSwitch}
                        variant={highlightSession ? 'contained' : 'outlined'}
                        color={highlightSession ? 'primary' : ''}
                    >
                        Upcoming
                    </ResponsiveButton>
                </Grid>
            </Grid>
            <Grid item>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Session Date</TableCell>
                            <TableCell>Class Day</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Tuition</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.length !== 0 &&
                            sessions.map((session) => {
                                return (
                                    <EnrollmentSessionRow
                                        key={session.id}
                                        session={session}
                                        enrollmentData={enrollment}
                                        highlightSession={highlightSession}
                                    />
                                );
                            })}
                    </TableBody>
                    {sessions.length === 0 && <NoListAlert list='Course'/>}
                </Table>
            </Grid>
        </Grid>
    );
}

EnrollmentSummaryTab.propTypes = {
    sessions: PropTypes.array,
    enrollment: PropTypes.object,
};

export default EnrollmentSummaryTab;
