import React, {useContext} from "react";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import {OnboardingContext} from "./OnboardingContext";
import useOnboardingActions from "./ImportStepperActions";
import {onboardingSteps} from "./ImportFlow";
import Grid from "@material-ui/core/Grid";

export default function OnboardingControls(props) {
	const doNothing = () => {
	};
	const {
		preBackHandler = doNothing,
		postBackHandler = doNothing,
		preSkipHandler = doNothing,
		postSkipHandler = doNothing,
		preNextHandler = doNothing,
		postNextHandler = doNothing,
	} = props;

	const {activeStep} = useContext(OnboardingContext);
	const [
		handleBack,
		handleSkip,
		handleNext,
	] = useOnboardingActions();
	const steps = onboardingSteps;

	const handleBackButton = () => {
		preBackHandler();
		handleBack();
		postBackHandler();
	}

	const handleSkipButton = () => {
		preSkipHandler();
		handleSkip();
		postSkipHandler();
	}

	const handleNextButton = () => {
		preNextHandler();
		handleNext();
		postNextHandler();
	}

	const isStepOptional = (step) => {
		return false;
	};

	return (<Grid item container>
		{activeStep !== 0 && (
			<ResponsiveButton
				disabled={activeStep === 0}
				onClick={handleBackButton}
			>
				Back
			</ResponsiveButton>
		)}
		{isStepOptional(activeStep) && (
			<ResponsiveButton
				variant='contained'
				onClick={handleSkipButton}
			>
				Skip
			</ResponsiveButton>
		)}
		<ResponsiveButton
			variant='contained'
			onClick={handleNextButton}
		>
			{activeStep === steps.length - 1
				? 'Finish'
				: 'Submit & Continue'}
		</ResponsiveButton>
	</Grid>)
}