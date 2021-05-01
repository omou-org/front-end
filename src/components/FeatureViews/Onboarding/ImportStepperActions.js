import React, { useContext, useState } from 'react';
import { OnboardingContext } from './OnboardingContext';
import { useURLQuery } from '../../../utils';
import { useHistory, useLocation } from 'react-router-dom';

export default function useOnboardingActions() {
    const { activeStep, setActiveStep } = useContext(OnboardingContext);
    const [skipped, setSkipped] = useState(new Set());

    const location = useLocation();
    const history = useHistory();
    const urlQuery = useURLQuery();

    const isStepOptional = (step) => {
        return false;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);

        //Set new URL
        const currentStep = Number(urlQuery.get('step'));
        history.push({
            path: location.pathname,
            search: `?step=${currentStep + 1}`,
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

        //Set new URL
        const currentStep = Number(urlQuery.get('step'));
        history.push({
            path: location.pathname,
            search: `?step=${currentStep - 1}`,
        });
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
        //Set new URL
        const currentStep = Number(urlQuery.get('step'));
        history.push({
            path: location.pathname,
            search: `?step=${currentStep + 1}`,
        });
    };

    return [handleBack, handleSkip, handleNext];
}
