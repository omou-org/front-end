import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import BusinessHoursForm from '../../Form/BusinessHoursForm';
import Loading from '../../OmouComponents/Loading';
import { capitalizeString } from '../../../utils';
import moment from 'moment';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { white, omouBlue, darkGrey, body1 } from '../../../theme/muiTheme';
import { useQuery, useMutation, gql } from '@apollo/client';

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
        ...body1,
    },
});

const GET_BUSINESS = gql`
    query {
        business {
            id
            name
            phoneNumber
            email
            address
            availabilityList {
                dayOfWeek
                startTime
                endTime
            }
        }
    }
`;

const UPDATE_BUSINESS = gql`
    mutation MyMutation(
        $address: String
        $email: String
        $name: String
        $phoneNumber: String
    ) {
        updateBusiness(
            address: $address
            email: $email
            name: $name
            phoneNumber: $phoneNumber
            availabilities: {
                dayOfWeek: MONDAY
                startTime: "11:00"
                endTime: "3:00"
            }
        ) {
            business {
                id
                name
                address
                email
                phoneNumber
            }
            updated
        }
    }
`;

const BusinessDetails = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [updateData, setUpdateData] = useState({
        businessName: '',
        businessPhone: '',
        businessEmail: '',
        businessAddress: '',
    });

    const [submitData] = useMutation(UPDATE_BUSINESS, {
        onCompleted: () => {
            handleBackStep();
        },
        update: (cache, data) => {
            const updatedBusiness = data.data.updateBusiness.business;
            cache.writeQuery(
                { 
                    query: GET_BUSINESS, 
                    data: {
                        business: updatedBusiness
                    }
                });
        }
    });

    const handleStepChange = () => setActiveStep((prevState) => prevState + 1);
    const handleBackStep = () => setActiveStep((prevState) => prevState - 1);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const onSubmit = () => {
        submitData({
            variables: {
                name: updateData.businessName,
                phone: updateData.businessPhone,
                email: updateData.email,
                address: updateData.businessAddress,
            },
        });
    };

    const { loading, error, data } = useQuery(GET_BUSINESS, {
        onCompleted: () => {
            setUpdateData({
                businessName: business.name,
                businessPhone: business.phoneNumber,
                businessEmail: business.email,
                businessAddress: business.address
            });
        },
    });

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return (
            <Typography>
                There has been an error! Error: {error.message}
            </Typography>
        );
    }

    const { business } = data;

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
                                {business.name}
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
                                {business.phoneNumber}
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
                                {business.email}
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
                                {business.address}
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
                            {business.availabilityList.map((avail, i) => (
                                <Typography key={i} align='left' variant='body1'>
                                    {capitalizeString(avail.dayOfWeek)}:{' '}
                                    {moment(avail.startTime, [
                                        'HH:mm:ss',
                                    ]).format('h:mm')}{' '}
                                    -{' '}
                                    {moment(avail.endTime, ['HH:mm:ss']).format(
                                        'h:mm '
                                    )}
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
                                    onClick={onSubmit}
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
                                defaultValue={business.name}
                                value={updateData.businessName}
                                name='businessName'
                                onChange={handleOnChange}
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
                                defaultValue={business.phoneNumber}
                                value={updateData.businessPhone}
                                name='businessPhone'
                                onChange={handleOnChange}
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
                                defaultValue={business.email}
                                value={updateData.businessEmail}
                                name='businessEmail'
                                onChange={handleOnChange}
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
                                defaultValue={business.address}
                                value={updateData.businessAddress}
                                name='businessAddress'
                                onChange={handleOnChange}
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
