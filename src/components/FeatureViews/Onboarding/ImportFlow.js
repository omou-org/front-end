import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

import DownloadTemplate from './DownloadTemplates';
import CourseUpload from './CourseUpload';
import BusinessInfo from './BusinessInfo';
import CategorySelect from './CategorySelect';
import AccountsUpload from './AccountsUpload';
import {OnboardingContext} from "./OnboardingContext";
import {useURLQuery} from "../../../utils";

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
}));

export const onboardingSteps = [
    'Business info',
    'Templates',
    'Course Categories',
    'Accounts',
    'Courses',
];

const ImportFlow = () => {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [importState, setImportState] = useState({});
    const urlQuery = useURLQuery();
    const steps = onboardingSteps;

    useEffect(() => {
        const currentStep = Number(urlQuery.get("step")) - 1;
        if (currentStep !== activeStep) {
            setActiveStep(currentStep);
        }
    }, [urlQuery])

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <BusinessInfo step={0}/>;
            case 1:
                return <DownloadTemplate step={1}/>;
            case 2:
                return <CategorySelect step={2}/>;
            case 3:
                return <AccountsUpload step={3}/>;
            case 4:
                return <CourseUpload step={4}/>;
            default:
                return 'Error: Invalid step. No content to display';
        }
    }

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    return (
        <OnboardingContext.Provider value={{importState, setImportState, activeStep, setActiveStep}}>
            <div className={classes.root}>
                <Stepper alternativeLabel activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (isStepOptional(index)) {
                            labelProps.optional = (
                                <Typography variant='caption'>Optional</Typography>
                            );
                        }
                        if (isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className={classes.instructions}>
                    {getStepContent(activeStep)}
                </div>
            </div>
        </OnboardingContext.Provider>
    );
};

export default ImportFlow;
