import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { OOOContext } from './OOOContext';
import { SubmitNotice } from './SubmitNotice';
import ConflictsDisplay from './ConflictsDisplay';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import OOOConfirmation from './OOOConfirmation';
import checkMarkIcon from 'components/FeatureViews/Scheduler/icons/bluecheckmark.svg';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { omouBlue } from '../../../theme/muiTheme';
import { GET_UPCOMING_INSTRUCTOR_OOO } from './UpcomingLogOOO';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    messageSent: {
        fontSize: '30px',
        color: '#43B5D9',
        fontWeight: 'bold',
    },
    messageSubText: {
        fontSize: '16px',
    },
}));

function getSteps() {
    return ['Submit Notice', 'Conflicts', 'Confirmation'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return <SubmitNotice />;
        case 1:
            return <ConflictsDisplay />;
        case 2:
            return 'Confirmation';
        default:
            return 'Unknown step';
    }
}

const CREATE_INSTRUCTOR_OOO = gql`
    mutation CreateInstructorOOO(
        $endDatetime: DateTime!
        $startDatetime: DateTime!
        $instructorId: ID!
        $description: String
    ) {
        __typename
        createInstructorOoo(
            endDatetime: $endDatetime
            startDatetime: $startDatetime
            instructor: $instructorId
            description: $description
        ) {
            instructorOoo {
                description
                endDatetime
                id
                instructor {
                    user {
                        id
                        lastName
                        firstName
                    }
                }
                startDatetime
            }
        }
    }
`;

export default function CreateOOOForm() {
    const [activeStep, setActiveStep] = useState(0);
    const [OOOFormState, setOOOFormState] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const steps = getSteps();
    const AuthUser = useSelector(({ auth }) => auth);
    const [createOOO, createOOOResults] = useMutation(CREATE_INSTRUCTOR_OOO, {
        onCompleted: () => {
            setSubmitted(true);
        },
        update: (cache, { data }) => {
            const newOOO = data.createInstructorOoo.instructorOoo;
            const cachedOOO = cache.readQuery({
                query: GET_UPCOMING_INSTRUCTOR_OOO,
                variables: { instructorID: AuthUser.user.id },
            }).instructorOoo;

            const updatedCache = [...cachedOOO, newOOO];

            cache.writeQuery({
                data: {
                    instructorOoo: updatedCache,
                },
                query: GET_UPCOMING_INSTRUCTOR_OOO,
                variables: { instructorID: AuthUser.user.id },
            });
        },
    });

    const SubmitNoticeChild = useRef();
    const updateOOOFormState = (newState) => setOOOFormState(newState);

    const handleNext = () =>
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const handleBack = () =>
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const handleClose = (event) => {
        event.preventDefault();
        setSubmitted(false);
    };

    const handleSubmit = () => {
        createOOO({
            variables: {
                instructorId: AuthUser.user.id,
                startDatetime: OOOFormState.startDate.toDate().toISOString(),
                endDatetime: OOOFormState.endDate.toDate().toISOString(),
                description: OOOFormState.description,
            },
        });
    };

    return (
        <OOOContext.Provider value={{ OOOFormState, updateOOOFormState }}>
            <Grid container direction="row">
                {/* 
                
                We need to comment this out because the final design is a step feature. I believe we are waiting
                 for an api to check if there will be schedule conflicts with the instructors OOO and their working hours. 
                
                <Grid item>
				<Stepper style={{width: "100%", backgroundColor: "transparent"}}>
					{
				steps.map((label) => {
							return <Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						})
					}
				</Stepper>
			</Grid>
			<Grid item>
			<h2 >Submit Out of Office Notice</h2>
				<Grid item xs={12} alignContent="left"> 
					// <Typography variant="body1" >{`Instructor: ${AuthUser.user.firstName} ${AuthUser.user.lastName} `}</Typography>
				</Grid> */}
                {/* {getStepContent(activeStep)} */}
                {/* </Grid>
			<Grid item>
				<Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
				<Button disabled={activeStep === steps.length - 1} onClick={handleNext}>Next</Button>
			</Grid> */}

                <Grid item xs={12}>
                    <Typography
                        style={{ paddingBottom: '3%' }}
                        data-cy="submit-OOO-text"
                        variant="h4"
                    >
                        Submit Out of Office Notice{' '}
                    </Typography>
                    {submitted ? (
                        <OOOConfirmation handleClose={handleClose} />
                    ) : (
                            <SubmitNotice ref={SubmitNoticeChild} />
                        )}
                </Grid>

                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item style={{ padding: '5%' }}>
                        {!submitted && (
                            <ResponsiveButton
                            // style={{
                            //     backgroundColor: 'white',
                            //     color: 'black',
                            //     width: '150px',
                            // }}
                            onClick={() =>
                                SubmitNoticeChild.current.handleClearForm()
                            }
                            // color="primary"
                            variant="outlined"
                            data-cy="clear-OOO-button"
                        >
                            clear
                        </ResponsiveButton>
                        
                            // <Button
                            //     style={{
                            //         backgroundColor: 'white',
                            //         color: 'black',
                            //         width: '150px',
                            //     }}
                            //     onClick={() =>
                            //         SubmitNoticeChild.current.handleClearForm()
                            //     }
                            //     color="primary"
                            //     variant="outlined"
                            //     data-cy="clear-OOO-button"
                            // >
                            //     Clear
                            // </Button>
                        )}
                    </Grid>
                    <Grid item>
                        {!submitted && (
                            <ResponsiveButton
                                onClick={handleSubmit}
                                // color="primary"
                                variant="outlined"
                                data-cy="submit-OOO-button"
                            >
                                submit
                            </ResponsiveButton>
                            // <Button
                            //     style={{
                            //         backgroundColor: omouBlue,
                            //         color: 'white',
                            //         width: '150px',
                            //     }}
                            //     onClick={handleSubmit}
                            //     color="primary"
                            //     variant="outlined"
                            //     data-cy="submit-OOO-button"
                            // >
                            //     Submit
                            // </Button>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </OOOContext.Provider>
    );
}
