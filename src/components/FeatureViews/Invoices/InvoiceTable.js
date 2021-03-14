import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { useCallback } from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { paymentToString, tuitionAmount, fullName } from 'utils';
import Loading from 'components/OmouComponents/Loading';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import NoListAlert from 'components/OmouComponents/NoListAlert';
import Moment from 'react-moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import TableDropdown from '../../OmouComponents/TableDropdown';

const InvoiceTable = ({
    invoiceList,
    courseID,
    handleStatusChange,
    paymentStatus,
}) => {
    const course = useSelector(({ Course }) => Course.NewCourseList[courseID]);

    if (!invoiceList) {
        return <Loading />;
    } else if (invoiceList.length === 0) {
        return <NoListAlert list='Payments' />;
    }

    const statusSelection = [
        {
            id: 0,
            title: 'All',
            value: 'ALL',
        },
        {
            id: 1,
            title: 'Paid',
            value: 'PAID',
        },
        {
            id: 2,
            title: ' Unpaid',
            value: 'UNPAID',
        },
    ];

    return (
        <Grid className='payments-history' item md={12}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Created On</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>
                            <TableDropdown
                                title='Status'
                                items={statusSelection}
                            />
                            {/* <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                }}
                            >
                                Status
                                <span onChange={}>
                                    <ExpandMoreIcon />
                                </span>
                            </div> */}
                        </TableCell>
                        <TableCell>Total ($) </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoiceList.map((invoice) => (
                        <TableRow
                            component={NavLinkNoDup}
                            hover
                            key={invoice.id}
                            to={`${invoice.id}`}
                        >
                            <TableCell>{invoice.id}</TableCell>
                            <TableCell>
                                <Moment
                                    date={invoice.createdAt}
                                    format='M/DD/YYYY'
                                />
                            </TableCell>

                            <TableCell>
                                {fullName(invoice.parent.user)}
                            </TableCell>
                            <TableCell>{invoice.paymentStatus}</TableCell>
                            <TableCell>{`$${invoice.total}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Grid>
    );
};

InvoiceTable.propTypes = {
    courseID: PropTypes.number.isRequired,
    enrollmentID: PropTypes.number.isRequired,
    paymentList: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['enrollment', 'parent']).isRequired,
};

export default InvoiceTable;
