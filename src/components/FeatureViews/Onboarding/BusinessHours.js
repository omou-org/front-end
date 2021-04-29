import React from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import OnboardingControls from "./OnboardingControls";
import BusinessHoursForm from "../../Form/BusinessHoursForm";

const useStyles = makeStyles((theme) => ({
    Text: {
        marginTop: '65px',
    },
    Subtitle: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: 'center',
        marginTop: '45px',
        marginBottom: '40px',
    },
}));

const BusinessHours = () => {
    const classes = useStyles();
    const handleChange = (newValue, actionMeta) => {
    };
    return (
        <>
            <Box className={classes.Text}>
                <Typography variant='h3'>Business Hours</Typography>
                <Box fontSize='h5.fontSize' className={classes.Subtitle}>
                    <Typography variant='p'>
                        Please input your business hours. These hours will show up in invoices and instructor
                        timesheets.
                    </Typography>
                </Box>
            </Box>
            <Grid container layout='row' alignItems='center' justify='center'>
                <BusinessHoursForm/>
            </Grid>
            <OnboardingControls/>
        </>
    );
};

export default BusinessHours;
