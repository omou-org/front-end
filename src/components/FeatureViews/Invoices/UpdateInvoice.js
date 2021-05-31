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
                formattedRegistrations[studentName].push({...registration, isCancelled: false});
            } else {
                formattedRegistrations[studentName] = [{...registration, isCancelled: false}];
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

    const handleRowClick = (registrationId) => {
        const newRegistrationState = registrationsByStudent;

        newRegistrationState.forEach(student => {
            const [_, registrations] = student;

            registrations.forEach(registration => {
                if (registration.id === registrationId) {
                    registration.isCancelled = !registration.isCancelled;
                }
            })
        })
        
        setRegistrationsByStudent(newRegistrationState);
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

        console.log(registrationsByStudent)
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
                console.log('Rerender List')
                return (
                    <>
                        <Grid item>
                            <Typography variant='h3' align='left'>
                                {name}
                            </Typography>
                        </Grid>

                        {console.log("Rerender Name ", registrations)}

                        {registrations.map(registration => {
                            console.log('Rerender Registration ', registration)
                            return <UpdateInvoiceRow key={registration.id} registration={registration} state={registrationsByStudent} handleRowClick={handleRowClick}/>
                        })}
                    </>
                )
            })}
            </Box>
        </Grid>
    )
}

export default UpdateInvoice;