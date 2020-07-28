import React, { useContext, useState } from "react";
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
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

export default function SubmitNotice() {
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

	return (<Grid container direction="column">

		<Grid item>
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
		<Grid item>
			<KeyboardTimePicker
				disabled={outAllDay}
				style={{ backgroundColor: outAllDay ? outlineGrey : "white" }}
				keyboardIcon={<TimeIcon />}
				value={startTime} onChange={handleTimeChange(setStartTime, "start")}
				inputVariant="outlined"
			/>
			<KeyboardTimePicker
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
		<Grid item>
			<TextField multiline rows={4} variant="outlined"
				onChange={handleDescriptionChange} value={description}
			/>
		</Grid>
		<Dialog open={openCalendar} onClose={() => setOpenCalendar(false)}>
			<DateRange
				editableDateInputs={true}
				onChange={handleDateRangeChange}
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
}