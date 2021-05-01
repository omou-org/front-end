import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import BusinessHoursForm from "../../Form/BusinessHoursForm";

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '24px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '24px',
        marginBottom: '40px',
    },
}));

const BusinessHours = () => {
    const classes = useStyles();
    const handleChange = (newValue, actionMeta) => {
    };
    return (
        <Grid
            container
            spacing={3}
            direction='column'
            alignItems='center'
            justify='center'
        >
            <Grid item>
                <Box className={classes.Text}>
                    <Typography variant='h1'>Business Hours</Typography>
                    <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                        <Typography variant='p'>
                            Please input your business hours. These hours will show up in invoices and instructor
                            timesheets.
                        </Typography>
                    </Box>
                </Box>
            </Grid>
            <Grid item container layout='row' alignItems='center' justify='center'>
                <BusinessHoursForm isOnboarding/>
            </Grid>
        </Grid>
    );
};

export default BusinessHours;
