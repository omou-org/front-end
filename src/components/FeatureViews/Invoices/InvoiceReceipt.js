import React, { useMemo, useRef } from 'react';
import { Prompt, useHistory, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import * as registrationActions from 'actions/registrationActions';
import Loading from 'components/OmouComponents/Loading';
import { paymentToString, uniques, capitalizeString } from 'utils';
import Moment from 'react-moment';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { bindActionCreators } from 'redux';
import { fullName } from '../../../utils';
import { closeRegistrationCart } from '../../OmouComponents/RegistrationUtils';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge';
import {
    skyBlue,
    darkBlue,
    darkGrey,
    buttonThemeBlue,
    cloudy,
    charcoal,
} from 'theme/muiTheme';
import CourseAvailabilites from '../../OmouComponents/CourseAvailabilities';
import { makeStyles } from '@material-ui/core/styles';

export const GET_PAYMENT = gql`
    query Invoice($invoiceId: ID!) {
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
                        instructor {
                            user {
                                id
                                lastName
                                firstName
                            }
                        }
                        activeAvailabilityList {
                            id
                            startTime
                            endTime
                            dayOfWeek
                        }
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
            paymentStatus
        }
    }
`;

const useStyles = makeStyles({
    daysRemaining: {
        background: skyBlue,
        color: darkBlue,
        padding: '1em',
        height: '35%',
    },
    courseInfo: {
        color: darkGrey,
    },
    dividerStyle: {
        width: '100%',
        color: cloudy,
        marginTop: '0.5em',
        marginBottom: '1em',
    },
});

const InvoiceReceipt = ({ invoiceId }) => {
    const history = useHistory();
    const location = useLocation();
    const params = useParams();
    const classes = useStyles();

    const printComponentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
    });

    const { data, loading, error } = useQuery(GET_PAYMENT, {
        variables: {
            invoiceId: params.paymentID || invoiceId || params.invoiceId,
        },
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
    const { parent, registrationSet, paymentStatus } = invoice;
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
        const { course, student } = enrollment;
        const { instructor, activeAvailabilityList } = course;
        return (
            <Grid style={{ marginLeft: '2.5em' }} item key={enrollment.id}>
                <Grid container direction='column' justify='flex-start'>
                    <Grid style={{ marginBottom: '1.5em' }} item>
                        <Typography align='left' variant='h4'>
                            {course.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction='column' justify='flex-start'>
                            <Grid item>
                                <Grid container direction='row'>
                                    <Grid item xs={2}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Student Name
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            align='left'
                                            variant='body1'
                                        >
                                            {student.user.firstName}{' '}
                                            {student.user.lastName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Dates
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            align='left'
                                            variant='body1'
                                        >
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
                                    <Grid item xs={1}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Sessions
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Typography
                                            align='left'
                                            variant='body1'
                                        >
                                            {registration.numSessions}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction='row'>
                                    <Grid item xs={2}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Instructor
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography
                                            align='left'
                                            variant='body1'
                                        >
                                            {instructor.user.firstName}{' '}
                                            {instructor.user.lastName}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Day & Time
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <CourseAvailabilites
                                            availabilityList={
                                                activeAvailabilityList
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Typography
                                            className={classes.courseInfo}
                                            align='left'
                                            variant='body2'
                                        >
                                            Tuition Fee
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <Typography
                                            align='left'
                                            variant='body1'
                                        >
                                            $
                                            {Math.round(
                                                course.hourlyTuition *
                                                    registration.numSessions
                                            )}
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
                {registrations.map((registration) =>
                    renderCourse(registration)
                )}
            </Grid>
        );
    };

    return (
        <div className='registration-receipt'>
            {params.paymentID && <>{/* <hr /> */}</>}
            <Prompt
                message='Remember to please close out the parent first!'
                when={
                    currentPayingParent !== null &&
                    location.pathname.includes('receipt')
                }
            />
            <Grid ref={printComponentRef} container direction='row' spacing={2}>
                <Grid container direction='row'>
                    <Grid direction='row' item xs={9}>
                        <Typography
                            align='left'
                            variant='h2'
                            data-cy='payment-header'
                        >
                            Invoice Details
                            <LabelBadge
                                style={{ marginLeft: '1.5em' }}
                                variant={
                                    paymentStatus === 'PAID'
                                        ? 'status-positive'
                                        : paymentStatus === 'UNPAID'
                                        ? 'status-negative'
                                        : 'status-neutral'
                                }
                            >
                                {capitalizeString(paymentStatus)}
                            </LabelBadge>
                        </Typography>
                    </Grid>
                    <Grid style={{ whiteSpace: 'nowrap' }} item xs={3}>
                        {paymentStatus === 'UNPAID' && (
                            <ResponsiveButton
                                style={{
                                    marginLeft: '5.5em',
                                    marginRight: '0.75em',
                                    background: buttonThemeBlue,
                                }}
                                variant='contained'
                            >
                                update invoice
                            </ResponsiveButton>
                        )}

                        <ResponsiveButton
                            style={{
                                marginLeft:
                                    paymentStatus === 'UNPAID'
                                        ? '0.75em'
                                        : '13em',
                            }}
                            variant='outlined'
                            onClick={handlePrint}
                        >
                            print
                        </ResponsiveButton>
                    </Grid>
                </Grid>
                <Grid className='receipt-info' item xs={12}>
                    <Grid container direction='column'>
                        <Grid item xs={12}>
                            <Grid container direction='row'>
                                <Grid item xs={2}>
                                    <Typography
                                        align='left'
                                        className={classes.courseInfo}
                                        variant='body2'
                                    >
                                        Invoice ID
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align='left'>
                                        {invoice.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        align='left'
                                        className={classes.courseInfo}
                                        variant='body2'
                                    >
                                        Date Issued
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align='left'>
                                        <Moment
                                            format='M/DD/YYYY'
                                            date={invoice.createdAt}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        align='left'
                                        className={classes.courseInfo}
                                        variant='body2'
                                    >
                                        Payment Method
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align='left'>
                                        {paymentToString(invoice.method.toLowerCase())}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction='row'>
                                <Grid item xs={2}>
                                    <Typography
                                        align='left'
                                        className={classes.courseInfo}
                                        variant='body2'
                                    >
                                        Bill To
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align='left'>
                                        {fullName(parent.user)} - ID#:{' '}
                                        {parent.user.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography
                                        align='left'
                                        className={classes.courseInfo}
                                        variant='body2'
                                    >
                                        Date Due
                                    </Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align='left'>
                                        <Moment
                                            format='M/DD/YYYY'
                                            date={invoice.createdAt}
                                        />
                                    </Typography>
                                </Grid>
                                {paymentStatus === 'PAID' && (
                                    <>
                                        <Grid item xs={2}>
                                            <Typography
                                                align='left'
                                                className={classes.courseInfo}
                                                variant='body2'
                                            >
                                                Stripe ID
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography align='left'>
                                                { !invoice.method.toLowerCase().includes('card') ? 'N/A' : '##' }
                                            </Typography>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Divider className={classes.dividerStyle} />
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
                <Divider className={classes.dividerStyle} />
                <Grid style={{ marginTop: '2em' }} container justify='flex-end'>
                    {paymentStatus === 'UNPAID' && (
                        <Grid
                            className={classes.daysRemaining}
                            alignItems='flex-start'
                            item
                            xs={3}
                        >
                            <Typography variant='h4'>
                                Days Remaining To Pay: 0 days
                            </Typography>
                        </Grid>
                    )}
                    <Grid
                        alignItems='flex-end'
                        container
                        item
                        xs={9}
                        direction='column'
                    >
                        <Grid item style={{ width: '100%' }} xs={3}>
                            <Grid
                                style={{
                                    marginBottom: '2em',
                                    marginRight: '2em',
                                    paddingTop: '1em',
                                }}
                                container
                                direction='row'
                            >
                                <Grid item xs={7}>
                                    <Typography
                                        align='right'
                                        variant='body2'
                                        style={{ color: darkGrey }}
                                    >
                                        Subtotal
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography align='right' variant='h4'>
                                        ${invoice.subTotal}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {invoice.discountTotal >= 0 && (
                            <Grid item style={{ width: '100%' }} xs={3}>
                                <Grid
                                    container
                                    style={{ marginBottom: '2em' }}
                                    direction='row'
                                >
                                    <Grid item xs={7}>
                                        <Typography
                                            align='right'
                                            variant='body2'
                                            style={{ color: darkGrey }}
                                        >
                                            Discount
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography
                                            align='right'
                                            variant='h4'
                                            style={{ color: darkBlue }}
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
                                    <Typography
                                        align='right'
                                        variant='body2'
                                        style={{ color: darkGrey }}
                                    >
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Typography align='right' variant='h4'>
                                        ${invoice.total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid style={{ marginTop: '4.125em' }} item xs={12}>
                    <Grid
                        container
                        direction='row'
                        justify='flex-end'
                        spacing={1}
                    >
                        {location.pathname.includes('registration') && (
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

export default InvoiceReceipt;
