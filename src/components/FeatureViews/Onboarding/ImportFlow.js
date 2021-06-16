import React, { useEffect, useState, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import BusinessInfo from './BusinessInfo';
import BusinessHours from './BusinessHours';
import { OnboardingContext, initalState, reducer } from './OnboardingContext';
import { useURLQuery } from '../../../utils';
import BulkImportStep from './BulkImportStep';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        margin: '0 35px',
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    stepper: {
        margin: '0 2em',
    },
}));

export const onboardingSteps = [
    'Business Info',
    'Business Hours',
    'Accounts',
    'Courses',
    'Enrollments',
];

const ImportFlow = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(1);
    const [skipped] = useState(new Set());
    const [importState, setImportState] = useState({ uploadedResponse: null });
    const urlQuery = useURLQuery();
    const steps = onboardingSteps;
    // This is where BulkImportStep lives

    const [state, dispatch] = useReducer(reducer, initalState);

    useEffect(() => {
        const currentStep = Number(urlQuery.get('step'));
        if (currentStep !== activeStep) {
            setActiveStep(currentStep);
        }
    }, [urlQuery, activeStep]);

    const getStepContent = (step) => {
        switch (step) {
            case 1:
                return <BusinessInfo step={1} />;
            case 2:
                return <BusinessHours step={2} />;
            case 3:
                return <BulkImportStep templateType='Accounts' step={3} />;
            case 4:
                return <BulkImportStep templateType='Courses' step={4} />;
            case 5:
                return <BulkImportStep templateType='Enrollments' step={5} />;

            default:
                return 'Error: Invalid step. No content to display';
        }
    };

    const isStepOptional = () => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    return (
        <OnboardingContext.Provider
            value={{
                importState,
                setImportState,
                activeStep,
                setActiveStep,
                state,
                dispatch,
            }}
        >
            <div className={classes.root}>
                <div className={classes.stepper}>
                    <Stepper alternativeLabel activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            if (isStepOptional(index)) {
                                labelProps.optional = (
                                    <Typography variant='caption'>
                                        Optional
                                    </Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>
                                        {label}
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                </div>
                <div className={classes.instructions}>
                    {getStepContent(activeStep)}
                </div>
            </div>
        </OnboardingContext.Provider>
    );
};

export default ImportFlow;
