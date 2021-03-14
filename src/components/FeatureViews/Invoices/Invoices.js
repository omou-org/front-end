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
import { useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Loading from '../../OmouComponents/Loading';
import { useApolloClient } from '@apollo/react-hooks';
import {
    Grid,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    Typography,
    Box,
    Input,
    FormControl,
} from '@material-ui/core';

import { omouBlue } from '../../../theme/muiTheme';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import Moment from 'react-moment';

import { DateRange } from 'react-date-range';

export const GET_INVOICES_FILTERED = gql`
    query GetInvoices(
        $endDate: String
        $startDate: String
        $query: String
        $paymentStatus: PaymentChoiceEnum
    ) {
        invoices(
            query: $query
            startDate: $startDate
            endDate: $endDate
            paymentStatus: $paymentStatus
            page: 1
            pageSize: 15
        ) {
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
    const [search, setSearch] = useState();
    const [results, setResults] = useState([]);
    const [paymentStatus, setPaymentStatus] = useState('');
    const client = useApolloClient();
    const [getInvoices, { loading, data, error, called }] = useLazyQuery(
        GET_INVOICES_FILTERED
    );

    const [filter, setFilter] = useState({
        query: '',
        startDate: null,
        endDate: null,
        paymentStatus: null,
    });

    const paymenyKeys = {
        PAID: 'PAID',
        UNPAID: 'UNPAID',
        CANCEL: 'CANCEL',
    };

    const searchInvoices = useCallback(
        async (search, startDate, endDate, paymentStatus) => {
            try {
                const {
                    data: {
                        invoices: { results },
                    },
                } = await client.query({
                    query: GET_INVOICES_FILTERED,
                    variables: {
                        query: search,
                        startDate: startDate,
                        endDate: endDate,
                        paymentStatus: paymentStatus,
                    },
                });

                setResults(results);
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
        searchInvoices();
        // getInvoices({});
    }, []);

    const handleDateRangeCalendarChange = (item) => {
        const newDateRange = item.selection;
        setDateSelector([newDateRange]);
        searchInvoices(search, newDateRange.startDate, newDateRange.endDate);
    };

    const handleSaveDateRange = () => {
        setOpenCalendar(false);
        getInvoices({});
    };

    const handleStatusChange = (e) => {
        setPaymentStatus(e.target.value);
    };

    // if (loading || !called) return <Loading />;
    if (error) return <div>An Error has occurred! {error.message}</div>;

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
                    <Grid item xs={5} align='left'>
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
                    <Grid item xs={6}>
                        <form onChange={(e) => searchInvoices(e.target.value)}>
                            <input
                                type='text'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                    paymentStatus={paymentStatus}
                />
            </Grid>
        </Grid>
    );
}
