import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { InvoiceTablePagination } from './InvoiceTablePagination';

import { paymentToString, tuitionAmount, fullName } from 'utils';
import Loading from 'components/OmouComponents/Loading';
import NavLinkNoDup from 'components/Routes/NavLinkNoDup';
import NoListAlert from 'components/OmouComponents/NoListAlert';
import Moment from 'react-moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import StatusBadge from '../../OmouComponents/StatusBadge';

import './invoice.scss';

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
    tableHeader: {
        padding: '2px',
    },
});

const InvoiceTable = ({
    invoiceList,
    courseID,
    handleStatusChange,
    handlePageChange,
    page,
}) => {
    const isParent = useSelector(({ auth }) => auth.accountType === 'PARENT');

    const [status, setStatus] = useState(null);

    const classes = useStyles();
    if (!invoiceList) {
        return <Loading />;
    }

    const handleClick = (event) => {
        setStatus(event.currentTarget);
    };

    const handleFilterSelect = (e) => {
        let lowerCase = e.target.innerText.toUpperCase();

        handleStatusChange(lowerCase);
        setStatus(null);
    };

    const statusKeys = {
        PAID: 'grn',
        UNPAID: 'red',
        CANCELED: 'gry',
    };

    return (
        <Grid className='payments-history' item md={12}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableHeader}>
                            Invoice ID
                        </TableCell>
                        <TableCell className={classes.tableHeader}>
                            Created On
                        </TableCell>
                        {!isParent && (
                            <TableCell className={classes.tableHeader}>
                                Customer Name
                            </TableCell>
                        )}

                        <TableCell className={classes.tableHeader}>
                            <Button
                                aria-controls='status-menu'
                                aria-haspopup='true'
                                onClick={handleClick}
                                className={classes.statusSelect}
                            >
                                Status
                                <span className={classes.expandIcon}>
                                    <ExpandMoreIcon />
                                </span>
                            </Button>
                            <Menu
                                id='status-menu'
                                anchorEl={status}
                                keepMounted
                                open={Boolean(status)}
                                onClose={handleFilterSelect}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                            >
                                <MenuItem onClick={handleFilterSelect}>
                                    All
                                </MenuItem>
                                <MenuItem onClick={handleFilterSelect}>
                                    Paid
                                </MenuItem>
                                <MenuItem onClick={handleFilterSelect}>
                                    Unpaid
                                </MenuItem>
                                <MenuItem onClick={handleFilterSelect}>
                                    Canceled
                                </MenuItem>
                            </Menu>
                        </TableCell>
                        <TableCell className={classes.tableHeader}>
                            Total ($){' '}
                        </TableCell>
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
                                    format='MMM D YYYY'
                                />
                            </TableCell>
                            {!isParent && (
                                <TableCell>
                                    {fullName(invoice.parent.user)}
                                </TableCell>
                            )}

                            <TableCell>
                                {StatusBadge(
                                    statusKeys[invoice.paymentStatus],
                                    invoice.paymentStatus
                                )}
                            </TableCell>
                            <TableCell>{`$${invoice.total}`}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    {/* <div className={classes.tableFooter}>
                        <TablePagination
                            page={page}
                            colSpan={3}
                            rowsPerPageOptions={10}
                            count={[]}
                            ActionsComponent={InvoiceTablePagination}
                            onChangePage={handlePageChange}
                        />
                    </div> */}
                </TableFooter>
            </Table>
            {invoiceList.length === 0 && <NoListAlert list='Payments' />}
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
