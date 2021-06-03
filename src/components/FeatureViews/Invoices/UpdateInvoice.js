import { Grid, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { GET_PAYMENT } from './InvoiceReceipt';
import Loading from 'components/OmouComponents/Loading';
import { fullName } from 'utils';
import Box from '@material-ui/core/Box';

import PropTypes from 'prop-types';
import UpdateInvoiceRow from './UpdateInvoiceRow';


const UpdateInvoice = () => { 
    const { invoiceId } = useParams();
    const [registrationsByStudent, setRegistrationsByStudent] = useState([]);
    const [registrationsToBeCancelled, setRegistrationsToBeCancelled] = useState([]);

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

    const updateCancelledRegistrations = (registrationId) => {

        const indexToDelete = registrationsToBeCancelled.indexOf(registrationId);

        const newRegistrationsToBeCancelledState = registrationsToBeCancelled;

        if (indexToDelete === -1) {
            newRegistrationsToBeCancelledState.push(registrationId);
        } else {
            newRegistrationsToBeCancelledState.splice(indexToDelete, 1);
        }

        setRegistrationsToBeCancelled(newRegistrationsToBeCancelledState);

        // const newRegistrationState = registrationsByStudent;

        // newRegistrationState.forEach(student => {
        //     const [_, registrations] = student;

        //     registrations.forEach(registration => {
        //         if (registration.id === registrationId) {
        //             registration.isCancelled = !registration.isCancelled;
        //         }
        //     })
        // })
        
        // setRegistrationsByStudent(newRegistrationState);
    }

    if (loading) {
        return <Loading />;
    }
    if (error)
        return (
            <Typography>
                {`There's been an error! Error: ${error.message}`}
            </Typography>
        );

        console.log(registrationsToBeCancelled)
    return (
        <Grid
          container
          direction='column'
          justify='flex-start'
          alignItems='flex-start'
        >
            <Grid item>
                <Typography variant='h1' >
                    Invoice #{invoiceId}
                </Typography>
            </Grid>

            
            <Box width='100%'>
            {registrationsByStudent.map(student => {
                const [name, registrations] = student;
                return (
                    <>
                        <Grid item>
                            <Typography variant='h3' align='left'>
                                {name}
                            </Typography>
                        </Grid>


                        {registrations.map(registration => {
                            return <UpdateInvoiceRow key={registration.id} registration={registration} updateCancelledRegistrations={updateCancelledRegistrations}/>
                        })}
                    </>
                )
            })}
            </Box>
        </Grid>
    )
}

export default UpdateInvoice;