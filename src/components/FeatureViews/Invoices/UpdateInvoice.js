import { Grid, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React from 'react';

const UpdateInvoice = () => { 
    const { invoiceId } = useParams();


    /**
     * Replace with queried data
     */
    const studentName = "Luther Hargreeves"

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
            <Grid item>
                <Typography variant='h3'>
                    {studentName}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default UpdateInvoice;