import { Grid, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GET_PAYMENT } from './InvoiceReceipt';
import Loading from 'components/OmouComponents/Loading';
import { fullName } from 'utils';
import Box from '@material-ui/core/Box';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';

import UpdateInvoiceRow from './UpdateInvoiceRow';
import { makeStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

    const classes = useStyles();

    const { data, loading, error } = useQuery(GET_PAYMENT, {
        variables: {
            invoiceId: invoiceId,
        },
    });

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
        if (data) {
            registrationData = formatRegistrationsByStudent(data.invoice.registrationSet);
        }
        setRegistrationsByStudent(registrationData);
    }, [ data ])    

    // TODO 
    // [x] Grey out enrollment 
    // [] Update invoice total using priceQuote query
    // [x] change x to +
    // [x] Disable/ grey out Pay Now button
    // [x] display save button
    const updateCancelledRegistrations = (registrationId) => {

        const indexToDelete = registrationsToBeCancelled.indexOf(registrationId);

        const newRegistrationsToBeCancelledState = registrationsToBeCancelled;

        if (indexToDelete === -1) {
            newRegistrationsToBeCancelledState.push(registrationId);
        } else {
            newRegistrationsToBeCancelledState.splice(indexToDelete, 1);
        }

        setRegistrationsToBeCancelled(newRegistrationsToBeCancelledState);
        setUnsavedChanges(true);
    }

    // TODO
    // [] Display Save Popup
    const handleSaveClick = () => {

    }

    
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

    if (loading) {
        return <Loading />;
    }
    if (error)
        return (
            <Typography>
                {`There's been an error! Error: ${error.message}`}
            </Typography>
        );

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
                            // onChange={handleMethodChange}
                            // value={paymentMethod}
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
                        <Typography variant='body2'>$ the monies</Typography>
                    </Grid>
                    <Grid item container direction='row' alignItems='center'>
                        <Typography variant='body'>Total</Typography>
                        <Typography variant='body2'>$ the monies</Typography>
                    </Grid>
                </Grid>    
            </Grid>
            <Grid container justify='flex-end' spacing='3'>
                <Grid item>
                    <ResponsiveButton variant='outlined'>Drop Invoice</ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton variant={unsavedChanges ? 'outlined' : 'disabled'}>Save</ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton variant={unsavedChanges ? 'disabled' : 'contained'}>Pay Now</ResponsiveButton>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default UpdateInvoice;