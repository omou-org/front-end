/**
 * @description invoice component to display table of parents invoices
 * @todo  Improve component state,
 *  - pagination bug - if you go to page 2, and filter, updated page will not be set on the front-end.
 *
 */

import React, { useCallback, useEffect, useState } from 'react';
import InvoiceTable from './InvoiceTable';
import gql from 'graphql-tag';
import { useSelector } from 'react-redux';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { useApolloClient } from '@apollo/client';
import {
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { omouBlue } from '../../../theme/muiTheme';
import DateRangeIcon from '@material-ui/icons/DateRange';
import EventBusyIcon from '@material-ui/icons/EventBusy';
import Moment from 'react-moment';
import SearchIcon from '@material-ui/icons/Search';
import { DateRange } from 'react-date-range';

export const GET_INVOICES_FILTERED = gql`
    query GetInvoices(
        $endDate: String
        $startDate: String
        $query: String
        $paymentStatus: PaymentChoiceEnum
        $page: Int
    ) {
        invoices(
            query: $query
            startDate: $startDate
            endDate: $endDate
            paymentStatus: $paymentStatus
            page: $page
            pageSize: 15
        ) {
            total
            results {
                id
                total
                paymentStatus
                createdAt
                parent {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const useStyles = makeStyles({
    root: {
        boxShadow: 'none',
        textTransform: 'none',
    },
    dateSelector: {
        border: 0,
        backgroundColor: omouBlue,
        boxShadow: 'none',
        fontVariant: 'none',
    },
    contained: {
        fontVariant: 'none',
    },
    startDate: {
        border: '2px solid #C4C4C4',
        borderLeft: 0,
    },
    searchBox: {
        width: '256px',
    },
});

export default function Invoices() {
    const AuthUser = useSelector(({ auth }) => auth);
    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const client = useApolloClient();
    const classes = useStyles();
    const [filter, setFilter] = useState({
        query: '',
        startDate: null,
        endDate: null,
        paymentStatus: null,
        page: 1,
        totalPages: totalPages,
    });

    const searchInvoices = useCallback(
        async (search, startDate, endDate, paymentStatus, page) => {
            let currPage = page || 1;
            let status = paymentStatus;
            if (paymentStatus === 'ALL') {
                status = null;
            }

            try {
                const {
                    data: { invoices },
                } = await client.query({
                    query: GET_INVOICES_FILTERED,
                    variables: {
                        query: search,
                        startDate: startDate,
                        endDate: endDate,
                        paymentStatus: status,
                        page: currPage,
                        pageSize: 15,
                    },
                });

                let parsedPageTotal = Math.ceil(invoices.total / 15);
                setTotalPages(parsedPageTotal);
                setResults(invoices.results);
            } catch (err) {
                console.error(err);
            }
        }
    );

    const [openCalendar, setOpenCalendar] = useState(false);
    const [dateSelector, setDateSelector] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection',
        },
    ]);

    useEffect(() => {
        searchInvoices('', '', '');
    }, []);

    const handleInputChange = (query) => {
        searchInvoices(
            query,
            filter.startDate,
            filter.endDate,
            filter.paymentStatus,
            filter.page
        );
        setFilter({
            ...filter,
            query: query,
        });
    };

    const handleDateRangeCalendarChange = (item) => {
        const newDateRange = item.selection;
        setDateSelector([newDateRange]);

        setFilter({
            ...filter,
            startDate: newDateRange.startDate,
            endDate: newDateRange.endDate,
        });
    };

    const handleResetDateRange = () => {
        setDateSelector([{ startDate: null, key: 'selection', endDate: null }]);
        searchInvoices(filter.query, null, null, filter.paymentStatus);

        setFilter({
            ...filter,
            startDate: null,
            endDate: null,
        });
    };

    const handleSaveDateRange = () => {
        setOpenCalendar(false);
        searchInvoices(
            filter.query,
            filter.startDate,
            filter.endDate,
            filter.paymentStatus
        );
    };

    const handlePageChange = (newPage) => {
        searchInvoices(
            filter.query,
            filter.startDate,
            filter.endDate,
            filter.paymentStatus,
            newPage
        );

        setFilter({
            ...filter,
            page: newPage,
        });
    };

    const handleStatusChange = (event) => {
        searchInvoices(filter.query, filter.startDate, filter.endDate, event);
    };

    const isParent = AuthUser.accountType === 'PARENT';

    return (
        <Grid container direction='row' spacing={4}>
            <Grid item xs={12} container>
                <Grid item xs={12}>
                    <Box paddingBottom='1em'>
                        <Typography align='left' variant='h1'>
                            Invoices
                        </Typography>
                    </Box>
                </Grid>
                <Grid
                    item
                    container
                    direction='row'
                    justify='space-between'
                    alignItems='center'
                >
                    <Grid item xs={8} align='left'>
                        <ButtonGroup
                            classes={{
                                root: classes.root,
                                contained: classes.contained,
                                groupedContainedHorizontal:
                                    classes.dateSelector,
                                groupedContained: classes.startDate,
                            }}
                            variant='contained'
                        >
                            <Button className={classes.startDate}>
                                {filter.startDate ? (
                                    <EventBusyIcon
                                        style={{ color: 'white' }}
                                        onClick={handleResetDateRange}
                                    />
                                ) : (
                                    <DateRangeIcon style={{ color: 'white' }} />
                                )}
                            </Button>
                            <Button
                                style={{
                                    fontWeight: 500,
                                    backgroundColor: 'white',
                                    color: 'black',
                                }}
                                onClick={() => setOpenCalendar(true)}
                            >
                                {dateSelector[0].startDate === null ? (
                                    <span
                                        style={{
                                            color: '#999999',
                                            fontSize: '15px',
                                            margin: 0,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Start Date
                                    </span>
                                ) : (
                                    <Moment
                                        date={dateSelector[0].startDate}
                                        format='MM/DD/YYYY'
                                        style={{
                                            color: '#999999',
                                            fontSize: '15px',
                                        }}
                                    />
                                )}
                            </Button>
                            <Button
                                style={{
                                    fontWeight: 500,
                                    backgroundColor: 'white',
                                    color: '#999999',
                                    textTransform: 'none',
                                }}
                                onClick={() => setOpenCalendar(true)}
                            >
                                {dateSelector[0].endDate === null ? (
                                    <span
                                        style={{
                                            color: '#999999',
                                            fontSize: '15px',
                                            margin: 0,
                                        }}
                                    >
                                        End Date
                                    </span>
                                ) : (
                                    <Moment
                                        date={dateSelector[0].endDate}
                                        format='MM/DD/YYYY'
                                        style={{
                                            color: '#999999',
                                            fontSize: '15px',
                                        }}
                                    />
                                )}
                            </Button>
                        </ButtonGroup>
                        <Dialog
                            open={openCalendar}
                            onClose={handleSaveDateRange}
                        >
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleDateRangeCalendarChange}
                                moveRangeOnFirstSelection={false}
                                ranges={dateSelector}
                                rangeColors={omouBlue}
                                color={omouBlue}
                            />
                            <DialogActions>
                                <ResponsiveButton
                                    style={{ border: 'none' }}
                                    variant='contained'
                                    onClick={handleSaveDateRange}
                                    color='primary'
                                >
                                    Save & Close
                                </ResponsiveButton>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid item xs={3}>
                        <form
                            onChange={(e) => handleInputChange(e.target.value)}
                        >
                            <TextField
                                className={classes.searchBox}
                                size='small'
                                type='text'
                                placeholder={
                                    isParent
                                        ? 'Search by Invoice ID'
                                        : 'Search by Parent or Invoice ID'
                                }
                                value={filter.query}
                                variant='outlined'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={(e) =>
                                    setFilter({
                                        ...filter,
                                        query: e.target.value,
                                    })
                                }
                            />
                        </form>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <InvoiceTable
                    invoiceList={results}
                    rootRoute='/invoices/'
                    type='parent'
                    handleStatusChange={handleStatusChange}
                    page={filter.page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
            </Grid>
        </Grid>
    );
}
