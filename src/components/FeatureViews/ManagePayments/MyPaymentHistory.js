import React, {useEffect, useState} from 'react';
import PaymentTable from '../Accounts/TabComponents/PaymentTable';
import gql from 'graphql-tag';
import {useSelector} from 'react-redux';
import {useLazyQuery} from '@apollo/client';
import moment from 'moment';
import {ResponsiveButton} from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import Loading from '../../OmouComponents/Loading';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {omouBlue} from '../../../theme/muiTheme';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import Moment from 'react-moment';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {DateRange} from 'react-date-range';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';

export const GET_PARENT_PAYMENTS_FILTERED = gql`
    query ParentPayments($parentId: ID!, $startDate: String, $endDate: String) {
        payments(
            parentId: $parentId
            startDate: $startDate
            endDate: $endDate
        ) {
            id
            createdAt
            registrationSet {
                id
            }
            total
            method
        }
    }
`;

export default function MyPaymentHistory() {
    const AuthUser = useSelector(({ auth }) => auth);
    const [getPayments, { loading, data, error, called }] = useLazyQuery(
        GET_PARENT_PAYMENTS_FILTERED,
        {
            variables: {
                parentId: AuthUser.user.id,
            },
        }
    );
    const [openCalendar, setOpenCalendar] = useState(false);
    const [state, setState] = useState([
        {
            startDate: moment().subtract(1, 'month').toDate(),
            endDate: moment().toDate(),
            key: 'selection',
        },
    ]);

    useEffect(() => {
        getPayments({
            variables: {
                startDate: moment().subtract(1, 'month').toISOString(),
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
        getPayments({
            variables: {
                startDate: state[0].startDate.toISOString(),
                endDate: state[0].endDate.toISOString(),
            },
        });
    };

    if (loading || !called) return <Loading />;
    if (error) return <div>An Error has occurred! {error.message}</div>;

    const { payments } = data;

    return (
        <Grid container direction='row' spacing={4}>
            <Grid item xs={12} container>
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
                    <Dialog open={openCalendar} onClose={handleSaveDateRange}>
                        <DateRange
                            editableDateInputs={true}
                            onChange={handleDateRangeCalendarChange}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
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
            </Grid>
            <Grid item xs={12}>
                <PaymentTable
                    paymentList={payments}
                    rootRoute='/my-payments/payment/'
                    type='parent'
                />
            </Grid>
        </Grid>
    );
}
