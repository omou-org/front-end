import React, { useState} from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import { OOOContext } from "./OOOContext"
import SubmitNotice from "./SubmitNotice";
import ConflictsDisplay from "./ConflictsDisplay";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import OOOConfirmation  from "./OOOConfirmation";
import checkMarkIcon from "components/FeatureViews/Scheduler/icons/bluecheckmark.svg";
import Typography from "@material-ui/core/Typography"

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
			color: "#43B5D9",
			fontWeight: "bold"
		},
		messageSubText: {
			fontSize: "16px",
	
		},
		cancelbutton: {
			backgroundColor: "#FFFFFF"
			
		},
		extraPadding : {
			paddingTop: "2em",
			paddingBottom: "1em"
		}

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

const CREATE_INSTRUCTOR_OOO = gql`mutation CreateInstructorOOO($endDatetime:DateTime!, $startDatetime:DateTime!, $instructorId:ID!, $description:String) {
  __typename
  createInstructorOoo(endDatetime: $endDatetime, startDatetime: $startDatetime, instructor: $instructorId, description: $description) {
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
}`

export default function CreateOOOForm() {
	const [activeStep, setActiveStep] = useState(0);
	const [OOOFormState, setOOOFormState] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const steps = getSteps();
	const AuthUser = useSelector(({ auth }) => auth);
	const [createOOO, createOOOResults] = useMutation(CREATE_INSTRUCTOR_OOO, {
		"onCompleted": () => {
			setSubmitted(!submitted);
		}
	})
	const classes = useStyles()
	const updateOOOFormState = (newState) => {
		setOOOFormState(newState);
	};

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleClose = () => {
		setSubmitted(false)
	}
	
	const handleSubmit = () => {
		
		createOOO({
			variables: {
				instructorId: AuthUser.user.id,
				startDatetime: OOOFormState.startDate.toDate().toISOString(),
				endDatetime: OOOFormState.endDate.toDate().toISOString(),
				description: OOOFormState.description,
			}
		});
	}



	return (<OOOContext.Provider value={{ OOOFormState, updateOOOFormState }}>
		<Grid container direction="row">
			{/* <Grid item>*/}
			{/*	<Stepper style={{width: "100%", backgroundColor: "transparent"}}>*/}
			{/*		{*/}
			{/*			steps.map((label) => {*/}
			{/*				return <Step key={label}>*/}
			{/*					<StepLabel>{label}</StepLabel>*/}
			{/*				</Step>*/}
			{/*			})*/}
			{/*		}*/}
			{/*	</Stepper>*/}
			{/*</Grid>*/}
			{/*<Grid item>*/}
			{/*	/!*{getStepContent(activeStep)}*!/*/}
			{/*</Grid>*/}
			{/*<Grid item>*/}
			{/*	<Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>*/}
			{/*	<Button disabled={activeStep === steps.length - 1} onClick={handleNext}>Next</Button>*/}
			{/*</Grid> */}
			<Grid item xs={12}>

				<h2 >Submit Out of Office Notice</h2>
				<Grid item xs={12} alignContent="left"> 
					<Typography variant="body1" >{`Instructor: ${AuthUser.user.firstName} ${AuthUser.user.lastName} `}</Typography>
				</Grid>

				{
					submitted ?
					<Grid container>
					<Grid item xs={12}>
						<img className={classes.extraPadding} src={checkMarkIcon} />
					</Grid>
					<Grid item xs={12} alignItems="center">
						<Typography className={classes.messageSent}>Your notice has been sent </Typography>
						<Typography className={classes.messageSubText}>You will recieve a confirmation of your OOO request</Typography>
					</Grid>
					<Grid item xs={12} alignItems="center" style={{paddingTop: "2em"}}>
						<Button className={classes.cancelbutton} variant="outlined"  onClick={handleClose}>Close</Button>
					</Grid>
				</Grid>
					
					: <SubmitNotice />
				}
			</Grid>
			<Grid item xs={8} />
			<Grid item xs={4}>
				{submitted ||<Button
						onClick={handleSubmit}
						color="primary"
						variant="outlined">
						Submit
					
				</Button>
				}
			</Grid>
		</Grid>
	</OOOContext.Provider>);
}