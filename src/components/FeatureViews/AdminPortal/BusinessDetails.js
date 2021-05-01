import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import BusinessHoursForm from '../../Form/BusinessHoursForm';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { white, omouBlue, darkGrey, body1 } from '../../../theme/muiTheme';

const useStyles = makeStyles({
    containerStyles: {
        height: '100vh',
    },
    buttons: {
        marginTop: '1.5rem',
    },
    updateButtons: {
        marginTop: '0.8rem',
    },
    businessData: {
        marginTop: '2rem',
    },
    businessLabel: {
        color: darkGrey,
        marginBottom: '0.5rem',
        fontSize: '1rem',
    },
    input: {
        background: white,
        border: `1px solid ${omouBlue}`,
        borderRadius: '5px',
        width: '16.5rem',
        height: '2rem',
        ...body1
    },
});

const businessInfo = {
    name: 'Bright Stars Academy',
    phone: '456-456-3577',
    email: 'ask@brightstars.com',
    address: '123 North Ln San Francisco, CA 94578',
    businessHours: [
        { day: 'Mon', hours: '9:00 - 5:00 pm' },
        { day: 'Tue', hours: '9:00 - 5:00 pm' },
        { day: 'Wed', hours: '9:00 - 5:00 pm' },
        { day: 'Thu', hours: '9:00 - 5:00 pm' },
        { day: 'Fri', hours: '9:00 - 5:00 pm' },
        { day: 'Sat', hours: '9:00 - 5:00 pm' },
        { day: 'Sun', hours: 'Closed' },
    ],
};

const BusinessDetails = () => {
    const classes = useStyles();
    const { name, phone, email, address, businessHours } = businessInfo;
    const [activeStep, setActiveStep] = useState(0);

    const handleStepChange = (e) => {
        setActiveStep((prevState) => prevState + 1);
    };

    const handleBackStep = () => {
        setActiveStep((prevState) => prevState - 1);
    };

    const getBusinessDetailsContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid
                        container
                        className={classes.containerStyles}
                        justify='flex-start'
                        alignContent='flex-start'
                    >
                        <Grid
                            className={classes.buttons}
                            justify='flex-start'
                            item
                            xs={1}
                        >
                            <ResponsiveButton
                                variant='outlined'
                                onClick={handleStepChange}
                            >
                                edit
                            </ResponsiveButton>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Name
                            </Typography>
                            <Typography align='left' variant='body1'>
                                {name}
                            </Typography>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Phone
                            </Typography>
                            <Typography align='left' variant='body1'>
                                {phone}
                            </Typography>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Email
                            </Typography>
                            <Typography align='left' variant='body1'>
                                {email}
                            </Typography>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Address
                            </Typography>
                            <Typography align='left' variant='body1'>
                                {address}
                            </Typography>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Hours
                            </Typography>
                            {businessHours.map(({ day, hours }) => (
                                <Typography align='left' variant='body1'>
                                    {day}: {hours}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                );
            case 1:
                return (
                    <Grid
                        container
                        className={classes.containerStyles}
                        justify='flex-start'
                        alignContent='flex-start'
                    >
                        <Grid
                            className={classes.updateButtons}
                            container
                            alignItems='flex-start'
                            spacing={3}
                        >
                            <Grid item>
                                <ResponsiveButton
                                    variant='outlined'
                                    onClick={handleBackStep}
                                >
                                    cancel
                                </ResponsiveButton>
                            </Grid>
                            <Grid item>
                                <ResponsiveButton
                                    variant='contained'
                                    // onClick={}
                                >
                                    update
                                </ResponsiveButton>
                            </Grid>
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Name
                            </Typography>
                            <TextField
                                variant='outlined'
                                defaultValue={name}
                                // value={}
                                // onChange={}
                                fullWidth
                                InputProps={{
                                    classes: {
                                        root: classes.input,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Phone
                            </Typography>
                            <TextField
                                variant='outlined'
                                defaultValue={phone}
                                // value={}
                                // onChange={}
                                fullWidth
                                InputProps={{
                                    classes: {
                                        root: classes.input,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Email
                            </Typography>
                            <TextField
                                variant='outlined'
                                defaultValue={email}
                                // value={}
                                // onChange={}
                                fullWidth
                                InputProps={{
                                    classes: {
                                        root: classes.input,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Address
                            </Typography>
                            <TextField
                                variant='outlined'
                                defaultValue={address}
                                // value={}
                                // onChange={}
                                fullWidth
                                InputProps={{
                                    classes: {
                                        root: classes.input,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid
                            className={classes.businessData}
                            justify='flex-start'
                            item
                            xs={12}
                        >
                            <Typography
                                className={classes.businessLabel}
                                align='left'
                                variant='h5'
                            >
                                Business Hours
                            </Typography>
                            <BusinessHoursForm />
                        </Grid>
                    </Grid>
                );
            default:
                return 'Unknown';
        }
    };

    return <>{getBusinessDetailsContent(activeStep)}</>;
};

export default BusinessDetails;
