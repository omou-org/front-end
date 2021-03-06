import React, { useMemo } from 'react';
import { Prompt, useHistory, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import * as registrationActions from 'actions/registrationActions';
import Loading from 'components/OmouComponents/Loading';
import { paymentToString, uniques } from 'utils';
import Moment from 'react-moment';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { bindActionCreators } from 'redux';
import { fullName } from '../../../utils';
import { closeRegistrationCart } from '../../OmouComponents/RegistrationUtils';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';

export const GET_PAYMENT = gql`
    query Payment($invoiceId: ID!) {
        invoice(invoiceId: $invoiceId) {
            id
            createdAt
            registrationSet {
                id
                enrollment {
                    course {
                        hourlyTuition
                        title
                        startDate
                        endDate
                        id
                    }
                    id
                    student {
                        user {
                            lastName
                            firstName
                            id
                        }
                    }
                }
                numSessions
            }
            total
            method
            parent {
                user {
                    firstName
                    lastName
                    id
                }
            }
            priceAdjustment
            subTotal
            discountTotal
        }
    }
`;

const PaymentReceipt = ({ invoiceId }) => {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();

    const { data, loading, error } = useQuery(GET_PAYMENT, {
        variables: { invoiceId: params.paymentID || invoiceId },
    });

    const currentPayingParent = useSelector(
        ({ Registration }) => Registration.CurrentParent
    );

    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(registrationActions, dispatch),
        [dispatch]
    );

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return (
            <Typography>
                There's been an error! Error: {error.message}
            </Typography>
        );
    }

    const { invoice } = data;
    const { parent, registrationSet } = invoice;
    const studentIDs = uniques(
        registrationSet.map(
            (registration) => registration.enrollment.student.user.id
        )
    );
    // Array of student registrations (array)
    const registrations = studentIDs.map((studentID) =>
        registrationSet.filter(
            (registration) =>
                registration.enrollment.student.user.id === studentID
        )
    );

    const handleCloseReceipt = () => (e) => {
        e.preventDefault();
        history.push('/registration');
        dispatch(api.closeRegistration());
        closeRegistrationCart();
    };

    const renderCourse = (registration) => {
        const { enrollment } = registration;
        const { course } = enrollment;
        return (
            <Grid item key={enrollment.id}>
                <Grid
                    className='enrolled-course'
                    container
                    direction='column'
                    justify='flex-start'
                >
                    <Grid item>
                        <Typography
                            align='left'
                            className='enrolled-course-title'
                        >
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction='column' justify='flex-start'>
                            <Grid item>
                                <Grid container direction='row'>
                                    <Grid item xs={2}>
                                        <Typography
                                            align='left'
                                            className='course-label'
                                        >
                                            Dates
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography align='left'>
                                            <Moment
                                                format='M/D/YYYY'
                                                date={course.startDate}
                                            />
                                            {` - `}
                                            <Moment
                                                format='M/D/YYYY'
                                                date={course.endDate}
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid className='course-label' item xs={2}>
                                        <Typography
                                            align='left'
                                            className='course-label'
                                        >
                                            Tuition
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography align='left'>
                                            $
                                            {Math.round(
                                                course.hourlyTuition *
                                                    registration.numSessions
                                            )}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction='row'>
                                    <Grid item xs={2}>
                                        <Typography
                                            align='left'
                                            className='course-label'
                                        >
                                            Sessions
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography align='left'>
                                            {registration.numSessions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            align='left'
                                            className='course-label'
                                        >
                                            Hourly Tuition
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Typography align='left'>
                                            ${course.hourlyTuition}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const renderStudentReceipt = (registrations) => {
        // we're given a student's list of registrations so we can take the first registration's student user object
        const student = registrations[0].enrollment.student.user;
        return (
            <Grid container direction='column' key={student.id}>
                <Paper elevation={2} className='course-receipt'>
                    <Grid item>
                        <Typography
                            align='left'
                            className='student-name'
                            variant='h5'
                        >
                            {fullName(student)} <span>- ID# {student.id}</span>
                        </Typography>
                    </Grid>
                    {registrations.map((registration) =>
                        renderCourse(registration)
                    )}
                </Paper>
            </Grid>
        );
    };

    return (
        <div className='registration-receipt'>
            {params.paymentID && (
                <>
                    <hr />
                </>
            )}
            <Prompt
                message='Remember to please close out the parent first!'
                when={
                    currentPayingParent !== null &&
                    location.pathname.includes('receipt')
                }
            />
            <Grid container direction='column' spacing={2}>
                <Grid item>
                    <Typography
                        align='left'
                        variant='h2'
                        data-cy='payment-header'
                    >
                        Payment Confirmation
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography align='left' variant='h5'>
                        Thank you for your payment, {parent.user.firstName}.
                    </Typography>
                </Grid>
                <Grid className='receipt-info' item xs={12}>
                    <Grid container direction='column'>
                        <Grid item xs={8}>
                            <Grid container direction='row'>
                                <Grid item xs={3}>
                                    <Typography align='left' className='label'>
                                        Order ID#:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left'>
                                        {invoice.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left' className='label'>
                                        Paid By:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left'>
                                        {fullName(parent.user)} - ID#:{' '}
                                        {parent.user.id}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={8}>
                            <Grid container direction='row'>
                                <Grid item xs={3}>
                                    <Typography align='left' className='label'>
                                        Order Date:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left'>
                                        <Moment
                                            format='M/DD/YYYY'
                                            date={invoice.createdAt}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left' className='label'>
                                        Payment Method:
                                    </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                    <Typography align='left'>
                                        {paymentToString(invoice.method)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        container
                        direction='column'
                        justify='center'
                        spacing={1}
                    >
                        <Grid item xs={12}>
                            {registrations.map((registration) =>
                                renderStudentReceipt(registration)
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className='receipt-details' item xs={12}>
                    <Grid alignItems='flex-end' container direction='column'>
                        {invoice.discountTotal >= 0 && (
                            <Grid item style={{ width: '100%' }} xs={3}>
                                <Grid container direction='row'>
                                    <Grid item xs={7}>
                                        <Typography align='right'>
                                            Discount Amount
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            align='right'
                                            variant='subtitle1'
                                        >
                                            - ${invoice.discountTotal}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {invoice.priceAdjustment > 0 && (
                            <Grid item style={{ width: '100%' }} xs={3}>
                                <Grid container direction='row'>
                                    <Grid item xs={7}>
                                        <Typography align='right' variant='p'>
                                            Price Adjustment
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            align='right'
                                            variant='subtitle1'
                                        >
                                            {invoice.priceAdjustment}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        <Grid item style={{ width: '100%' }} xs={3}>
                            <Grid container direction='row'>
                                <Grid item xs={7}>
                                    <Typography align='right' variant='h6'>
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography align='right' variant='h6'>
                                        ${invoice.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className='receipt-actions' item xs={12}>
                    <Grid
                        container
                        direction='row'
                        justify='flex-end'
                        spacing={1}
                    >
                        {!location.pathname.includes('parent') && (
                            <Grid item>
                                <ResponsiveButton
                                    variant='contained'
                                    data-cy='close-parent'
                                    className='button primary'
                                    onClick={handleCloseReceipt()}
                                >
                                    close parent
                                </ResponsiveButton>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default PaymentReceipt;
