import React, {useState} from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import NoListAlert from 'components/OmouComponents/NoListAlert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import {makeStyles} from '@material-ui/core/styles';
import {skyBlue} from 'theme/muiTheme';

import DashboardSummary from './DashboardSummary';
import SmallStatusIndicator from './SmallStatusIndicator';
import PropTypes from "prop-types";

const useStyles = makeStyles({
    tableRowSelected: {
        backgroundColor: skyBlue,
    },
});

const RequestTable = ({ requests }) => {
    const [isExpanded, setIsExpanded] = useState(
        Array(requests.length).fill(false)
    );

    const handleExpandRow = (rowNumber) => {
        const updatedIsExpanded = [...isExpanded];
        updatedIsExpanded[rowNumber] = !updatedIsExpanded[rowNumber];
        setIsExpanded(updatedIsExpanded);
    };

    const classes = useStyles();

    return (
        <Grid item md={12}>
            <Table>
                <TableHead>
                    <TableRow className={classes.tableRow}>
                        <TableCell className={classes.tableHeader}>
                            Request ID
                        </TableCell>
                        <TableCell className={classes.tableHeader}>
                            Submitted Date
                        </TableCell>
                        <TableCell className={classes.tableHeader}>
                            Status
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {requests.map((request, index) => (
                        <>
                            <TableRow
                                hover={!isExpanded[index]}
                                className={`${classes.tableRow} ${
                                    isExpanded[index] &&
                                    classes.tableRowSelected
                                }`}
                                onClick={() => {
                                    handleExpandRow(index);
                                }}
                            >
                                <TableCell>#{request.ID}</TableCell>
                                <TableCell>{request.createdAt}</TableCell>
                                <TableCell>
                                    <SmallStatusIndicator
                                        status={request.status}
                                    />
                                </TableCell>
                                <TableCell>
                                    {isExpanded[index] ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </TableCell>
                            </TableRow>
                            {isExpanded[index] && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <DashboardSummary request={request} />
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
            {requests.length === 0 && <NoListAlert list='Requests'/>}
        </Grid>
    );
};

RequestTable.propTypes = {
    requests: PropTypes.any,
};

export default RequestTable;
