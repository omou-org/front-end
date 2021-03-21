/**
 * @description invoice componet to display table of parents invoices
 * @todo code to match figma design
 *
 *
 */

import React, { useCallback, useEffect, useState } from 'react';

import InvoiceTable from './InvoiceTable';
import gql from 'graphql-tag';
import { useSelector } from 'react-redux';

import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import { useApolloClient } from '@apollo/react-hooks';
import {
    Grid,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    Typography,
    Box,
    TextField,
    Input,
    InputAdornment,
    FormControl,
} from '@material-ui/core';

import { omouBlue } from '../../../theme/muiTheme';
import CalendarIcon from '@material-ui/icons/CalendarToday';
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
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

export default function Invoices() {
    const AuthUser = useSelector(({ auth }) => auth);
    const [results, setResults] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const client = useApolloClient();

    const [filter, setFilter] = useState({
        query: '',
        startDate: null,
        endDate: null,
        paymentStatus: 'PAID',
        page: 1,
        totalPages: totalPages,
    });

    const searchInvoices = useCallback(
        async (search, startDate, endDate, paymentStatus, page) => {
            let status = paymentStatus;

            if (paymentStatus === 'ALL') {
                status = null;
            }

            let currPage = !page ? 1 : page;

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

                let parsedTotal = Math.ceil(invoices.total / 15);
                console.log(invoices.results);
                setTotalPages(parsedTotal);
                setResults(invoices.results);
            } catch (err) {
                console.error(err);
            }
        }
    );

    // defualt date is "Start Date " & "End Date "

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
        searchInvoices(query);
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
        setPaymentStatus(event);
        searchInvoices(filter.query, filter.startDate, filter.endDate, event);
    };

    // if (loading || !called) return <Loading />;
    // if (error) return <div>An Error has occurred! {error.message}</div>;

    // const { results } = data.invoices;

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
                <Grid item container direction='row' alignItems='center'>
                    <Grid item xs={8} align='left'>
                        <ButtonGroup variant='contained'>
                            <Button style={{ backgroundColor: omouBlue }}>
                                <CalendarIcon style={{ color: 'white' }} />
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
                                            color: 'black',
                                            fontSize: '15px',
                                            margin: 0,
                                        }}
                                    >
                                        Start Date
                                    </span>
                                ) : (
                                    <Moment
                                        date={dateSelector[0].startDate}
                                        format='MM/DD/YYYY'
                                        style={{
                                            color: 'black',
                                            fontSize: '15px',
                                        }}
                                    />
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
                                {dateSelector[0].endDate === null ? (
                                    <span
                                        style={{
                                            color: 'black',
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
                                            color: 'black',
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
                            />
                            <DialogActions>
                                <ResponsiveButton
                                    variant='contained'
                                    onClick={handleSaveDateRange}
                                    color='primary'
                                >
                                    Save & Close
                                </ResponsiveButton>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid item xs={4}>
                        <form
                            onChange={(e) => handleInputChange(e.target.value)}
                        >
                            <TextField
                                type='text'
                                placeholder='Search Customer or ID'
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
