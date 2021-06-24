import React, { useEffect, useState } from 'react';
import {
    Typography,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import gql from 'graphql-tag';
import { Form as ReactForm } from 'react-final-form';

import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';

import SelectStudentStep from './SelectStudentStep';
import SelectInstructorStep from './SelectInstructorStep';
import ReviewRequestStep from './ReviewRequestStep';
import RequestSubmittedModal from './RequestSubmittedModal';

const GET_STUDENT_LIST = gql`
    query getStudentList($parentID: ID) {
        parent(userId: $parentID) {
            studentIdList
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    contentMargin: {
        marginLeft: '20px',
        marginRight: '20px',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    stepper: {
        // LoginPage.scss is overriding the MUI stepper component,
        // recommend fixing that to use MUI classes in stepper component instead of
        // changing it globaly
        // This needs !important
        background: '#FAFAFA !important',
        margin: '1em 1em !important',
    },
}));

function getSteps() {
    return ['Select Student', 'Select Schedule', 'Review'];
}

const RequestScheduler = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();
    const loggedInParentID = useSelector(({ auth }) => auth.user.id);
    const [initalFormState, setInitalFormState] = useState({});
    const { data, loading, error } = useQuery(GET_STUDENT_LIST, {
        variables: { parentID: loggedInParentID },
    });
    const [isDisabled, setIsDisabled] = useState(true);
    const [modalOpen, setModalOpen] = useState();
    useEffect(() => {
        const studentIdList = data.parent.studentIdList;
        if (studentIdList.length === 1) {
            setInitalFormState({ selectStudent: studentIdList[0] });
        }
    }, [data.parent.studentIdList]);
    if (loading) return 'loading';
    if (error) return console.error(error);

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return (
                    <SelectStudentStep
                        studentIdList={data.parent.studentIdList}
                    />
                );
            case 1:
                return <SelectInstructorStep />;
            case 2:
                return <ReviewRequestStep />;
            default:
                return 'Unknown Step';
        }
    };

    const submit = () => {
        // submit the form on complete
    };

    const handleModalOpen = () => setModalOpen(true);
    const handleModalClose = () => setModalOpen(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if (activeStep === 2) {
            setActiveStep(2);
            handleModalOpen();
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validate = (formData) => {
        let keys = Object.keys(formData);
        // let values = Object.values(formData);
        // let hasSelectedDate = values.some((date) => date === true);
        switch (activeStep) {
            case 0:
                if (keys.length === 2) {
                    setIsDisabled(false);
                }
                break;
            // case 1:
            //     if (keys.length >= 6 && hasSelectedDate) {
            //         setIsDisabled(false);
            //     } else {
            //         setIsDisabled(true);
            //     }
            //     break;
        }
    };

    return (
        <>
            <Grid container direction='row'>
                <Grid item xs={5}>
                    <Typography align='left' variant='h1'>
                        Submit Tutoring Request
                    </Typography>
                </Grid>
            </Grid>

            <Grid
                container
                direction='row'
                justify='center'
                alignItems='center'
            >
                <ReactForm
                    onSubmit={submit}
                    initialValues={initalFormState}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form style={{ width: '100%' }} onSubmit={handleSubmit}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Stepper
                                        activeStep={activeStep}
                                        alternativeLabel
                                        classes={{
                                            root: classes.stepper,
                                        }}
                                    >
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <div>
                                        {
                                            <Grid
                                                container
                                                justify='center'
                                                direction='row'
                                                className={
                                                    classes.contentMargin
                                                }
                                            >
                                                {(values) => {
                                                    return values['field-name'];
                                                }}
                                                {!modalOpen ? (
                                                    getStepContent(activeStep)
                                                ) : (
                                                    <RequestSubmittedModal
                                                        handleModalClose={
                                                            handleModalClose
                                                        }
                                                    />
                                                )}
                                                {!modalOpen && (
                                                    <div>
                                                        <Button
                                                            disabled={
                                                                activeStep === 0
                                                            }
                                                            onClick={handleBack}
                                                            className={
                                                                classes.backButton
                                                            }
                                                        >
                                                            Back
                                                        </Button>
                                                        <Button
                                                            variant='contained'
                                                            color='primary'
                                                            disabled={
                                                                isDisabled
                                                            }
                                                            onClick={handleNext}
                                                        >
                                                            {activeStep ===
                                                            steps.length - 1
                                                                ? 'Submit'
                                                                : 'Next'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </Grid>
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                />
            </Grid>
        </>
    );
};

export default RequestScheduler;
