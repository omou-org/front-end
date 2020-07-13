import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import {OOOContext} from "./OOOContext"
import {deepEqual} from "../../../utils";
import Typography from "@material-ui/core/Typography";
import {omouBlue, outlineGrey} from "../../../theme/muiTheme";
import Moment from "react-moment";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {DateRange} from "react-date-range";
import CalendarIcon from "@material-ui/icons/CalendarToday"
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import {KeyboardTimePicker} from "@material-ui/pickers/TimePicker";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import {TextField} from "@material-ui/core";

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
}));

function getSteps() {
	return ['Submit Notice', 'Conflicts', 'Confirmation'];
}

const SubmitNotice = () => {
	const [openCalendar, setOpenCalendar] = useState(false);
	const [state, setState] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: 'selection'
		}
	]);
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);
	const [outAllDay, setOutAllDay] = useState(false);
	const [description, setDescription] = useState("");

	const handleTimeChange = (setStartOrEndTime) => (e) => {
		setStartOrEndTime(e);
	};

	const handleOutAllDay = () => {
		setOutAllDay(!outAllDay);
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
	};

	return (<Grid container direction="column">
		<Grid item>
			<Typography variant="h5">Submit Out of Office Notice</Typography>
		</Grid>
		<Grid item>
			<ButtonGroup variant="contained">
				<Button style={{backgroundColor: omouBlue}}>
					<CalendarIcon style={{color: 'white'}}/>
				</Button>
				<Button style={{fontWeight: 500, backgroundColor: "white"}}
						onClick={() => setOpenCalendar(true)}>
					<Moment date={state[0].startDate} format="MM/DD/YYYY"/>
				</Button>
				<Button style={{fontWeight: 500, backgroundColor: "white"}}
						onClick={() => setOpenCalendar(true)}>
					<Moment date={state[0].endDate} format="MM/DD/YYYY"/>
				</Button>
			</ButtonGroup>
		</Grid>
		<Grid item>
			<KeyboardTimePicker
				disabled={outAllDay}
				style={{backgroundColor: outAllDay ? outlineGrey : "white"}}
				value={startTime} onChange={handleTimeChange(setStartTime)}
				inputVariant="outlined"
			/>
			<KeyboardTimePicker
				disabled={outAllDay}
				style={{backgroundColor: outAllDay ? outlineGrey : "white"}}
				value={endTime} onChange={handleTimeChange(setEndTime)}
				inputVariant="outlined"
			/>
			<FormControlLabel
				control={<Checkbox checked={outAllDay} onChange={handleOutAllDay}
								   name="Out All Day" color="primary"/>}
				label="Out all day"
			/>
		</Grid>
		<Grid item>
			<TextField multiline rows={4} variant="outlined"
					   onChange={handleDescriptionChange} value={description}
			/>
		</Grid>
		<Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
			<DateRange
				editableDateInputs={true}
				onChange={item => setState([item.selection])}
				moveRangeOnFirstSelection={false}
				ranges={state}
			/>
			<DialogActions>
				<Button onClick={() => setOpenCalendar(false)} color="primary">
					Save & Close
				</Button>
			</DialogActions>
		</Dialog>
	</Grid>)
};

function getStepContent(step) {
	switch (step) {
		case 0:
			return <SubmitNotice/>;
		case 1:
			return 'Conflicts';
		case 2:
			return 'Confirmation';
		default:
			return 'Unknown step';
	}
}

export default function CreateOOOForm() {
	const [activeStep, setActiveStep] = useState(0);
	const [OOOFormState, setOOOFormState] = useState(null);
	const steps = getSteps();

	const updateOOOFormState = ((newState) => {
		setOOOFormState((prevState) => {
			if (deepEqual(prevState, newState)) {
				// const {startDate, endDate, startTime, endTime, description, ...rest} = newState;
				return newState;
			}
			return prevState;
		});
	});

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	return (<OOOContext.Provider value={{OOOFormState, updateOOOFormState}}>
		<Grid container direction="column">
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
				{getStepContent(activeStep)}
			</Grid>
			<Grid item>
				<Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
				<Button disabled={activeStep === steps.length - 1} onClick={handleNext}>Next</Button>
			</Grid>
		</Grid>
	</OOOContext.Provider>);
}