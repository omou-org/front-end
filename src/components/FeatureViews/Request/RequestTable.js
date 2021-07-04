import React, { useEffect, useState } from "react"

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { fullName } from 'utils';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import NoListAlert from 'components/OmouComponents/NoListAlert';
import Moment from 'react-moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import StatusBadge from '../../OmouComponents/StatusBadge';

import DashboardSummary from './DashboardSummary'

const testRequestData = [
    {
        ID: "12345",
        createdAt: "May 25, 2021",
        status: "submitted",
        dates: "July 15 - August 15",
        times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
        subject: "Math",
        instructor: "Tim Yang",
        student: "Ben Miller"
    },
    {
        ID: "12346",
        createdAt: "May 26, 2021",
        status: "submitted",
        dates: "July 15 - August 15",
        times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
        subject: "Math",
        instructor: "Tim Yang",
        student: "Ben Miller"
    },
    {
        ID: "12347",
        createdAt: "May 27, 2021",
        status: "submitted",
        dates: "July 15 - August 15",
        times: "Wednesdays, Saturdays at 2:00 pm - 3:00 pm",
        subject: "Math",
        instructor: "Tim Yang",
        student: "Ben Miller"
    }
]

const useStyles = makeStyles({
    statusSelect: {
        color: 'inherit',
        fontSize: '16px',
        fontFamily: 'Roboto',
        fontWeight: '500',
        textTransform: 'none',
    },
    expandIcon: {
        color: 'black',
        paddingTop: '7px',
        paddingLeft: '12px',
    },
    tableFooter: {
        paddingTop: '1vh',
    },
    tableRowSelected: {
        backgroundColor: '#EBFAFF'
    },
});

const RequestTable = ({
    requests,
    handlePageChange,
    page,
    totalPages,
}) => {
    requests = testRequestData;

    const [isExpanded, setIsExpanded] = useState(Array(requests.length).fill(false));

    const handleExpandRow = (rowNumber) => {
        const updatedIsExpanded = [...isExpanded];
        updatedIsExpanded[rowNumber] = !updatedIsExpanded[rowNumber];
        console.log(updatedIsExpanded)
        setIsExpanded(updatedIsExpanded);
    }

    const classes = useStyles();
    console.log({isExpanded})
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
                                className={`${classes.tableRow} ${isExpanded[index] && classes.tableRowSelected}`}
                                onClick={() => {handleExpandRow(index)}}
                            >
                                <TableCell>{request.ID}</TableCell>
                                <TableCell>
                                    {request.createdAt}
                                    {/* <Moment
                                        date={invoice.createdAt}
                                        format='MMM D YYYY'
                                    /> */}
                                </TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>
                                    {isExpanded[index] ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                                </TableCell>
                            </TableRow>
                            {isExpanded[index] && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <DashboardSummary request={request}/>
                                    </TableCell>
                                </TableRow>
                            )}
                        </>
                    ))}
                </TableBody>
            </Table>
            {requests.length === 0 && <NoListAlert list='Requests' />}

            <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
                className={classes.tableFooter}
            >
                {/* {requests.length > 15 && (
                    <InvoiceTablePagination
                        // page={page}
                        colSpan={3}
                        rowsPerPageOptions={10}
                        totalPages={totalPages}
                        // onChangePage={handlePageChange}
                    />
                )} */}
            </Grid>
        </Grid>
    );
}

export default RequestTable;