import React, { useContext, useState, forwardRef, } from "react";
import { OOOContext } from "./OOOContext";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import { omouBlue, outlineGrey } from "../../../theme/muiTheme";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import Moment from "react-moment";
import { KeyboardTimePicker } from "@material-ui/pickers/TimePicker";
import TimeIcon from "@material-ui/icons/Schedule";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import { TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import { DateRange } from "react-date-range";
import { useSelector } from "react-redux";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useImperativeHandle } from "react";

const useStyles = makeStyles({
	root: {
		padding: "1rem"
	},
	boldText: {
		fontSize: "16px",
		fontWeight: "bold"
	},
	normalText: {
		fontWeight: 400
	},
	selectDateText: {
		fontSize: "17px",
		paddingTop: "2%"
	},
	timePicker: {
		maxWidth: 200
	}
})

export const SubmitNotice = forwardRef((props, ref) => {
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
	const { updateOOOFormState } = useContext(OOOContext);
	const AuthUser = useSelector(({ auth }) => auth);
	const classes = useStyles();
	const handleUpdateForm = (updatedState) => {
		updateOOOFormState({
			startTime: startTime,
			endTime: endTime,
			description: description,
			startDate: moment(state[0].startDate),
			endDate: moment(state[0].endDate),
			outAllDay: outAllDay,
			...updatedState
		});
	}

	const handleTimeChange = (setStartOrEndTime, time) => (e) => {
		setStartOrEndTime(e);
		handleUpdateForm({ [time]: e });
	};

	const handleOutAllDay = () => {
		setOutAllDay(!outAllDay);
		handleUpdateForm({ outAllDay: !outAllDay });
	};

	const handleDescriptionChange = (e) => {
		setDescription(e.target.value);
		handleUpdateForm({ description: e.target.value });
	};

	const handleDateRangeChange = (item) => {
		setState([item.selection]);
		handleUpdateForm({
			startDate: moment(item.selection.startDate),
			endDate: moment(item.selection.endDate)
		});
	}

	const disablePrevDates = (startDate) => {
		const startSeconds = Date.parse(startDate);
		return (date) => {
			return Date.parse(date) < startSeconds;
		}
	}

	useImperativeHandle(ref, () => ({
		handleClearForm() {
			setStartTime(null);
			setEndTime(null);
			setDescription("");
			setOutAllDay(false);
		}
	}))

	const startDate = new Date();


	return (<Grid container style={{ paddingLeft: "8rem" }} direction="row" >

		<Grid item xs={11} >
			<Typography className={classes.boldText} align="left">Instructor: <span className={classes.normalText}>{`${AuthUser.user.firstName} ${AuthUser.user.lastName} `}</span></Typography>

		</Grid>

		<Grid item xs={12} lg={7} >
			<Typography className={classes.selectDateText} align="left" >Select Date:</Typography>
		</Grid>
		<Grid container xs={12} justify="flex-start" style={{ paddingTop: "2%" }}>
			<ButtonGroup variant="contained">
				<Button style={{ backgroundColor: omouBlue }}>
					<CalendarIcon style={{ color: 'white' }} />
				</Button>
				<Button style={{ fontWeight: 500, backgroundColor: "white" }}
					onClick={() => setOpenCalendar(true)}>
					<Moment date={state[0].startDate} format="MM/DD/YYYY" />
				</Button>
				<Button style={{ fontWeight: 500, backgroundColor: "white" }}
					onClick={() => setOpenCalendar(true)}>
					<Moment date={state[0].endDate} format="MM/DD/YYYY" />
				</Button>
			</ButtonGroup>
		</Grid>

		<Grid container>

			<Grid item xs={12} md={11}>
				<Typography align="left" style={{ paddingTop: "3%" }} >Select OOO Start Time</Typography>
			</Grid>
		</Grid>

		<Grid container direction="row" justify="flex-start" className={classes.root}>

			<Grid item xs={12} md={4}>
				<KeyboardTimePicker
					id="keyboardTimePickerOOO"
					className={classes.timePicker}
					disabled={outAllDay}
					style={{ backgroundColor: outAllDay ? outlineGrey : "white" }}
					keyboardIcon={<TimeIcon />}
					value={startTime} onChange={handleTimeChange(setStartTime, "start")}
					inputVariant="outlined"
				/>
			</Grid>
			<Grid item xs={12} md={1} />
			<Grid item xs={12} md={6}>
				<KeyboardTimePicker

					className={classes.timePicker}
					disabled={outAllDay}
					style={{ backgroundColor: outAllDay ? outlineGrey : "white" }}
					keyboardIcon={<TimeIcon />}
					value={endTime} onChange={handleTimeChange(setEndTime, "end")}
					inputVariant="outlined"
				/>
				<FormControlLabel
					control={<Checkbox checked={outAllDay} onChange={handleOutAllDay}
						name="Out All Day" color="primary" />}
					label="Out all day"
				/>
			</Grid>
		</Grid >
		<Grid container spacing={0} justify="flex-start">
			<Grid item xs={2}>
				<Typography className={classes.boldText} variant="subtitle1" align="left" >Description:</Typography>
			</Grid>
			<Grid item >
				<TextField multiline rows={4} size={"medium"} variant="outlined" style={{ width: 350, backgroundColor: "white" }}
					onChange={handleDescriptionChange} value={description}
				/>
			</Grid>
		</Grid>
		<Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
			<DateRange
				editableDateInputs={true}
				onChange={handleDateRangeChange}
				minDate={moment().toDate()}
				shouldDisableDate={disablePrevDates(startDate)}
				moveRangeOnFirstSelection={false}
				ranges={state}
			/>
			<DialogActions>
				<Button onClick={() => setOpenCalendar(false)} color="primary">
					Save & Close
				</Button>
			</DialogActions>
		</Dialog>
	</Grid >)
})