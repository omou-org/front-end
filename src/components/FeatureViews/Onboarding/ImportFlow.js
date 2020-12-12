import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import DownloadTemplate from "./DownloadTemplates";
import CourseUpload from "./CourseUpload";
import BusinessInfo from "./BusinessInfo";
import CategorySelect from "./CategorySelect";
import AccountsUpload from "./AccountsUpload";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	button: {
		margin: "0 35px"
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getSteps() {
	return [
		'Business info',
		'Templates',
		'Course Categories',
		'Accounts',
		'Courses'
	];
}

function getStepContent(step) {
	switch (step) {
		case 0:
			return <BusinessInfo/>;
		case 1:
			return <DownloadTemplate/>;
		case 2:
			return <CategorySelect/>;
		case 3:
			return <AccountsUpload/>;
		case 4:
			return <CourseUpload/>;
		default:
			return 'Unknown step';
	}
}

const ImportFlow = () => {
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);
	const [skipped, setSkipped] = React.useState(new Set());
	const steps = getSteps();

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
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className={classes.root}>
			<Stepper alternativeLabel activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepOptional(index)) {
						labelProps.optional = <Typography variant="caption">Optional</Typography>;
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
			<div>
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed - you're finished
						</Typography>
						<Button onClick={handleReset} className={classes.button}>
							Reset
						</Button>
					</div>
				) : (
					<div>
						<div className={classes.instructions}>{getStepContent(activeStep)}</div>
						<div>
							{
								activeStep !== 0 &&
								<Button
									disabled={activeStep === 0}
									onClick={handleBack}
									className={classes.button}
								>
									Back
								</Button>
							}
							{isStepOptional(activeStep) && (
								<Button
									variant="contained"
									color="primary"
									onClick={handleSkip}
									className={classes.button}
								>
									Skip
								</Button>
							)}

							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
								className={classes.button}
							>
								{activeStep === steps.length - 1 ? 'Finish' : 'Submit & Continue'}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImportFlow;