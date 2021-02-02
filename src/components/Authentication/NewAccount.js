import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './styles.js';
import Typography from '@material-ui/core/Typography';
import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';
import { PHONE_NUMBER_FIELD, stringField } from '../Form/FormFormats';
import { FORM_ERROR } from 'final-form';
import * as Yup from 'yup';
import gql from 'graphql-tag';
import { useApolloClient } from '@apollo/react-hooks';
import { Form as ReactForm } from 'react-final-form';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Grid from '@material-ui/core/Grid';
import * as Fields from '../Form/FieldComponents/Fields';
import './LoginPage.scss';
import { ReactComponent as Ellipse3 } from './loginImages/ellipse3.svg';
import { ReactComponent as Ellipse4 } from './loginImages/ellipse4.svg';
import { ReactComponent as Picture2 } from './loginImages/picture2.svg';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeValidate } from 'mui-rff';

const basicInfo = [
    <Fields.TextField
        className='TextField'
        fullWidth={false}
        key='firstName'
        label='First Name'
        margin='dense'
        name='firstName'
        required
        variant='outlined'
    />,
    <Fields.TextField
        className='TextField'
        fullWidth={false}
        key='lastName'
        label='Last Name'
        margin='dense'
        name='lastName'
        required
        variant='outlined'
    />,
    <Fields.TextField
        className='TextField'
        fullWidth={false}
        key='email'
        label='Email'
        margin='dense'
        name='email'
        required
        type='email'
        variant='outlined'
    />,
    <Fields.PasswordInput
        className='TextField'
        fullWidth={false}
        key='password'
        margin='dense'
        name='password'
        required
        variant='outlined'
    />,
    <Fields.TextField
        className='TextField'
        fullWidth={false}
        key='phone'
        label='Phone Number'
        margin='dense'
        name='phoneNumber'
        variant='outlined'
    />,
];

const CHECK_EMAIL = gql`
    query CheckEmail($email: String) {
        userType(userName: $email)
    }
`;

const NewAccount = () => {
    const client = useApolloClient();
    const [type, setType] = useState();
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);

    const parentSchema = Yup.object().shape({
        firstName: stringField('First Name').validator.required(),
        lastName: stringField('Last Name').validator.required(),
        email: Yup.string()
            .email('Invalid email')
            .test('uniqueEmail', 'Email already exists', async (email) => {
                try {
                    const response = await client.query({
                        query: CHECK_EMAIL,
                        variables: { email },
                    });
                    return response.data.userType === null;
                } catch {
                    return false;
                }
            })
            .required(),
        password: Yup.string()
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d\s@$!%*#?&]{8,}$/,
                'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
            )
            .required(),
        phoneNumber: PHONE_NUMBER_FIELD.validator,
    });

    const parentValidate = makeValidate(parentSchema);

    const handleSelect = (event, newAlignment) => {
        setType(newAlignment);
    };

    const submit = async (formData) => {
        const CREATE_PARENT = gql`
            mutation CreateParentAccount(
                $firstName: String!
                $lastName: String!
                $email: String!
                $password: String!
                $phoneNumber: String
            ) {
                createParent(
                    user: {
                        firstName: $firstName
                        lastName: $lastName
                        email: $email
                        password: $password
                    }
                    phoneNumber: $phoneNumber
                ) {
                    parent {
                        accountType
                    }
                }
            }
        `;
        try {
            await client.mutate({
                mutation: CREATE_PARENT,
                variables: formData,
                update: (cache) => {
                    cache.writeQuery({
                        data: {
                            userType: 'Parent',
                        },
                        query: CHECK_EMAIL,
                        variables: { email: formData.email },
                    });
                },
            });
            setActiveStep((prevStep) => prevStep + 1);
        } catch (error) {
            return {
                [FORM_ERROR]: error,
            };
        }
    };

    const renderWithForm = () => {
        const renderStep = (email) => {
            switch (activeStep) {
                case 0:
                    return (
                        <>
                            {basicInfo}
                            <br />
                            <Grid
                                alignItems='center'
                                container
                                justify='center'
                            >
                                <ResponsiveButton
                                    style={{ margin: '10px 20px' }}
                                    component={Link}
                                    data-cy='return'
                                    to={{
                                        pathname: '/login',
                                        state: { email },
                                    }}
                                    variant='contained'
                                >
                                    Back to login
                                </ResponsiveButton>
                                <ResponsiveButton
                                    style={{ margin: '10px 20px' }}
                                    type='submit'
                                    variant='contained'
                                >
                                    Create Account
                                </ResponsiveButton>
                            </Grid>
                        </>
                    );
                case 1:
                    return (
                        <>
                            <Typography
                                style={{ margin: '80px 0' }}
                                variant='body1'
                            >
                                You can now log in to your new account.
                            </Typography>
                            <ResponsiveButton
                                className='formButton'
                                color='primary'
                                component={Link}
                                data-cy='return'
                                to={{
                                    pathname: '/login',
                                    state: { email },
                                }}
                                variant='contained'
                            >
                                Login
                            </ResponsiveButton>
                        </>
                    );
                // no default
            }
        };

        const labels = ['Basic Information', 'Account Created'];
        return (
            <>
                <Typography className='welcomeText formTitle'>
                    Create a Parent Account
                </Typography>
                <ReactForm
                    validateOnBlur
                    onSubmit={submit}
                    render={({ handleSubmit, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Stepper
                                activeStep={activeStep}
                                alternativeLabel
                                orientation='horizontal'
                                style={{
                                    margin: '-300px 0 -20px 0',
                                }}
                            >
                                {labels.map((label) => (
                                    <Step className={classes.step} key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            {renderStep(values.email)}
                        </form>
                    )}
                    validate={parentValidate}
                />
            </>
        );
    };

    const renderNoForm = () => (
        <>
            <Typography className='welcomeText'>Create an Account</Typography>
            <Typography className='iam'>I am a ...</Typography>
            <ToggleButtonGroup
                aria-label='text alignment'
                exclusive
                onChange={handleSelect}
                value={type}
            >
                <ToggleButton
                    aria-label='parent'
                    className='btn'
                    value='parent'
                >
                    Parent
                </ToggleButton>
                <ToggleButton
                    aria-label='student'
                    className='btn'
                    value='student'
                >
                    Student
                </ToggleButton>
            </ToggleButtonGroup>
            {type === 'student' && (
                <Typography
                    className='iam'
                    style={{
                        width: '75%',
                        margin: 'auto',
                    }}
                    variant='body1'
                >
                    For students, you will receive an email to create an account
                    when a parent adds you to their profile.
                </Typography>
            )}
        </>
    );

    return (
        <div className='createAccContainer'>
            <Ellipse3 className='ellipse3' />
            <Ellipse4 className='ellipse4' />
            <Picture2 className='picture1' />
            <div className='logo2'>
                <Typography align='left' className='title'>
                    omou
                </Typography>
            </div>

            <div className={`Login ${type === 'parent' && 'formLogin'}`}>
                <Grid container>
                    <Grid item md={6} />
                    <Grid className='createAccount' item md={6}>
                        {type === 'parent' ? renderWithForm() : renderNoForm()}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default NewAccount;
