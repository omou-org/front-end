import React, { useEffect, useCallback, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_PAYMENT } from './InvoiceReceipt';
import Loading from 'components/OmouComponents/Loading';
import { fullName } from 'utils';
import Box from '@material-ui/core/Box';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import gql from 'graphql-tag';

import UpdateInvoiceRow from './UpdateInvoiceRow';
import { makeStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const GET_PRICE_QUOTE = gql`
    query GetPriceQuote(
        $method: String!
        $disabledDiscounts: [ID]
        $priceAdjustment: Float
        $classes: [ClassQuote]
        $tutoring: [TutoringQuote]
        $parent: ID!
    ) {
        priceQuote(
            method: $method
            disabledDiscounts: $disabledDiscounts
            priceAdjustment: $priceAdjustment
            classes: $classes
            tutoring: $tutoring
            parent: $parent
        ) {
            subTotal
            priceAdjustment
            accountBalance
            total
            discounts {
                id
                name
                amount
            }
        }
    }
`;


const useStyles = makeStyles({
    heading: {
        marginBottom: '32px',
        
    },
    studentName: {
        marginBottom: '24px'
    },
    paymentFormHeading: {
        textAlign: 'left',
    },
    paymentForm: {
        marginTop: '20px'
    }
});

const UpdateInvoice = () => { 
    const { invoiceId } = useParams();
    const [registrationsByStudent, setRegistrationsByStudent] = useState([]);
    const [registrationsToBeCancelled, setRegistrationsToBeCancelled] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [numberOfUnsavedChanges, setNumberOfUnsavedChanges] = useState(0);
    const [displayPopup, setDisplayPopup] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [displayedPrice, setDisplayedPrice] = useState({
        total: 0,
        subTotal: 0
    })

    const classes = useStyles();

    const { data: paymentInfoData, loading: paymentInfoLoading, error: paymentInfoError } = useQuery(GET_PAYMENT, {
        variables: {
            invoiceId: invoiceId,
        },
    });

    // classRegistraitons to be 
    /**
     * {
     *      course: courseId
     *      sessions: numSessions
     *      student: studentId
     * }
     */
    const [classRegistrations, setClassRegistrations] = useState([]);

    const formatRegistrationsForPriceAdjustmentQuery = (arrOfRegistrations) => {
        const filteredClassRegistrations = [];

        for (const registration of arrOfRegistrations) {
            if (!registrationsToBeCancelled.includes(registration.id)) {
                filteredClassRegistrations.push({
                    course: registration.enrollment.course.id,
                    sessions: registration.numSessions,
                    student: registration.enrollment.student.user.id
                })
            }
        }
        console.log({filteredClassRegistrations})
        setClassRegistrations(filteredClassRegistrations);
    }

    const [priceAdjustment, setPriceAdjustment] = useState(0);
    const [getPriceQuote, { loading: priceQuoteLoading, data: priceQuoteData }] = useLazyQuery(
        GET_PRICE_QUOTE,
        {
            variables: {
                method: paymentMethod,
                classes: classRegistrations,
                parent: paymentInfoData?.invoice.parent.user.id,
                disabledDiscounts: [],
                priceAdjustment,
            },
            onCompleted: (data) => {
                console.log({data})
                setDisplayedPrice({
                    total: data.priceQuote.total,
                    subTotal: data.priceQuote.subTotal
                })
            },
            skip: !paymentInfoData,
        }
    );

    const formatRegistrationsByStudent = (registrations) => {
        const formattedRegistrations = {};
        let studentName;
        for (const registration of registrations) {
            studentName = fullName(registration.enrollment.student.user);

            if (formattedRegistrations[studentName]) {
                formattedRegistrations[studentName].push(registration);
            } else {
                formattedRegistrations[studentName] = [registration];
            }
        }

        return Object.entries(formattedRegistrations)
    }

    useEffect(() => {
        let registrationData = [];
        let invoicePrice = displayedPrice;

        if (paymentInfoData) {
            registrationData = formatRegistrationsByStudent(paymentInfoData.invoice.registrationSet);
            invoicePrice.subTotal = paymentInfoData.invoice.subTotal;
            invoicePrice.total = paymentInfoData.invoice.total;
            formatRegistrationsForPriceAdjustmentQuery(paymentInfoData.invoice.registrationSet);
        }
        setRegistrationsByStudent(registrationData);
        setDisplayedPrice(invoicePrice);
    }, [ paymentInfoData ])    

    // TODO 
    // [x] Grey out enrollment 
    // [x] Update invoice total using priceQuote query
    // [x] change x to +
    // [x] Disable/ grey out Pay Now button if number of unsaved changes is not 0
    // [x] display save button
    const updateCancelledRegistrations = (registrationId) => {

        const indexToDelete = registrationsToBeCancelled.indexOf(registrationId);

        const newRegistrationsToBeCancelledState = registrationsToBeCancelled;

        let updatedCountOfUnsavedChanges = numberOfUnsavedChanges;

        if (indexToDelete === -1) {
            newRegistrationsToBeCancelledState.push(registrationId);
            updatedCountOfUnsavedChanges++;
        } else {
            newRegistrationsToBeCancelledState.splice(indexToDelete, 1);
            updatedCountOfUnsavedChanges--;
        }
        setNumberOfUnsavedChanges(updatedCountOfUnsavedChanges);
        setRegistrationsToBeCancelled(newRegistrationsToBeCancelledState);
        setUnsavedChanges(updatedCountOfUnsavedChanges !== 0);
        formatRegistrationsForPriceAdjustmentQuery(paymentInfoData.invoice.registrationSet);
        getPriceQuote();
    }

    // TODO
    // [x] Display Save Popup
    const handleSaveClick = () => {
        setDisplayPopup(true);
    }

    const handlePopupClose = () => {
        setDisplayPopup(false);
    }

    // TODO
    // [] Make createInvoice mutation with new changes
    //     [] Update cache
    // [x] Hide the Save Button
    // [x] Enable Pay Now Button
    const handleSaveChanges = () => {
        setUnsavedChanges(false);
        handlePopupClose()
    }

    const handlePaymentMethodChange = useCallback((_, value) => {
        setPaymentMethod(value);
    }, []);

    
const paymentOptions = [
    {
        label: 'Credit Card',
        value: 'credit_card',
    },
    {
        label: 'Cash',
        value: 'cash',
    },
    {
        label: 'Check',
        value: 'check',
    },
];

    if (paymentInfoLoading) {
        return <Loading />;
    }
    if (paymentInfoError)
        return (
            <Typography>
                {`There's been an error! Error: ${paymentInfoError.message}`}
            </Typography>
        );
    console.log({paymentInfoData})

    return (
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='flex-start'
          
        >
            <Grid item className={classes.heading}>
                <Typography variant='h1' >
                    Invoice #{invoiceId}
                </Typography>
            </Grid>
            
            <Box width='100%'>
            {registrationsByStudent.map(student => {
                const [name, registrations] = student;
                return (
                    <>
                        <Grid item className={classes.studentName}>
                            <Typography variant='h3' align='left'>
                                {name}
                            </Typography>
                        </Grid>

                        {registrations.map((registration, index, array) => {
                            const isLastItem = index === array.length - 1;

                            return <UpdateInvoiceRow key={registration.id} registration={registration} updateCancelledRegistrations={updateCancelledRegistrations} isLastItem={isLastItem}/>
                        })}
                    </>
                )
            })}
            </Box>
            <Grid container className={classes.paymentForm} justify='space-between'>
                <Grid item>
                    <FormControl component='fieldset'>
                        <FormLabel component='legend' className={classes.paymentFormHeading}>
                            <Typography
                                align='left'
                                style={{ fontWeight: '600' }}
                            >
                                Payment Method
                            </Typography>
                        </FormLabel>
                        <RadioGroup
                            aria-label='gender'
                            name='gender1'
                            row
                            onChange={handlePaymentMethodChange}
                            value={paymentMethod}
                        >
                            {paymentOptions.map(({ label, value }) => (
                                <FormControlLabel
                                    color='primary'
                                    control={<Radio />}
                                    data-cy={`${label}-checkbox`}
                                    key={value}
                                    label={label}
                                    value={value}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Grid item container direction='row' alignItems='center'>
                        <Typography variant='body'>Subtotal</Typography>
                        <Typography variant='body2'>$ {displayedPrice.subTotal}</Typography>
                    </Grid>
                    <Grid item container direction='row' alignItems='center'>
                        <Typography variant='body'>Total</Typography>
                        <Typography variant='body2'>$ {displayedPrice.total}</Typography>
                    </Grid>
                </Grid>    
            </Grid>
            <Grid container justify='flex-end' spacing='3'>
                <Grid item>
                    <ResponsiveButton variant={unsavedChanges ? 'outlined' : 'disabled'} onClick={handleSaveClick}>Save</ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton variant={(unsavedChanges || paymentMethod === null) ? 'disabled' : 'contained'}>Pay Now</ResponsiveButton>
                </Grid>
            </Grid>
            <Dialog
                open={displayPopup}
                onClose={handlePopupClose}
            >
                <DialogTitle disableTypography id='dialog-title'>
                    Dropping Courses
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id='dialog-description'>
                        <Typography>- Name of Courses</Typography>
                        <Typography>- New Total</Typography>
                        <Typography>- How Many Days Left to Pay</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ResponsiveButton onClick={handlePopupClose} color='primary'>
                        nevermind
                    </ResponsiveButton>
                    <ResponsiveButton onClick={handleSaveChanges} color='primary'>
                        confirm
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default UpdateInvoice;