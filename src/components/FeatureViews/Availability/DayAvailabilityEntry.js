import React, {useContext, useEffect, useState} from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {KeyboardTimePicker} from "@material-ui/pickers/TimePicker";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import {TimeAvailabilityContext} from "./TimeAvailabilityContext";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import * as moment from "moment";
import {checkTimeSegmentOverlap, setCurrentDate} from "../../../utils";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import {errorRed} from "../../../theme/muiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(() => ({
	availabilityRow: {
		display: "block",
		margin: "10px 0",
		position: "relative"
	}
}));

const AvailabilityRow = ({startTime, endTime, dayIndex, availabilityId, setDisplayNewAvailability, conflictError}) => {
	const {updateAvailability} = useContext(TimeAvailabilityContext);
	const classes = useStyles();

	const timesNotValid = (startTime, endTime) => {
		if (startTime && endTime) {
			const startTimeVal = setCurrentDate(startTime),
				endTimeVal = setCurrentDate(endTime);
			const timeDiff = moment.duration(endTimeVal.diff(startTimeVal));
			return timeDiff <= 0;
		}
		return false;
	};

	const handleOnStartChange = (e) => {
		updateAvailability(e, endTime, dayIndex, availabilityId, false);
		setDisplayNewAvailability(false);
	};

	const handleOnEndChange = (e) => {
		updateAvailability(startTime, e, dayIndex, availabilityId, false);
	};

	return <div className={classes.availabilityRow}>
		<KeyboardTimePicker value={startTime || null} onChange={handleOnStartChange}
							inputVariant="outlined"
							error={endTime && !startTime || conflictError || timesNotValid(startTime, endTime)}/>
		<div style={{
			margin: "25px", width: "10px", borderBottom: "solid black 1px",
			display: "inline-block"
		}}/>
		<KeyboardTimePicker value={endTime || null} onChange={handleOnEndChange}
							inputVariant="outlined"
							error={!endTime && startTime || conflictError || timesNotValid(startTime, endTime)}/>
		{
			(startTime && endTime) &&
			<IconButton style={{top: "5px", position: "absolute", color: errorRed}}
						onClick={() => updateAvailability(null, null, dayIndex, availabilityId, true)}
			>
				<DeleteIcon/>
			</IconButton>
		}
	</div>
};

export default function DayAvailabilityEntry({dayOfWeek, availabilities, dayIndex}) {
	const [displayNewAvailability, setDisplayNewAvailability] = useState(false);
	const [conflictErrorMessage, setConflictErrorMessage] = useState(false);
	const [conflictErrorDialogOpen, setConflictErrorDialogOpen] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		const availabilitySegments = Object.values(availabilities)
			.map(({startTime, endTime}) => [startTime || endTime, endTime || startTime]);
		const conflict = checkTimeSegmentOverlap(availabilitySegments);
		setConflictErrorMessage(conflict);
		if (conflict) setConflictErrorDialogOpen(true);
	}, [availabilities]);

	const handleDialogClose = (e) => {
		e.preventDefault();
		setConflictErrorDialogOpen(false);
	};

	return (<><TableRow>
		<TableCell>{dayOfWeek}</TableCell>
		<TableCell style={{width: "45vw"}}>
			{
				Object.values(availabilities).map(({startTime, endTime, id}) =>
					<AvailabilityRow
						key={id}
						startTime={startTime || ""}
						endTime={endTime || ""}
						dayIndex={dayIndex}
						availabilityId={id}
						setDisplayNewAvailability={setDisplayNewAvailability}
						conflictError={conflictErrorMessage}
					/>)
			}
			{
				(displayNewAvailability || Object.keys(availabilities).length === 0) &&
				<AvailabilityRow dayIndex={dayIndex} setDisplayNewAvailability={setDisplayNewAvailability}/>
			}
			{
				(!displayNewAvailability && Object.keys(availabilities).length > 0) &&
				<div className={classes.availabilityRow}>
					<Button color="primary"
							onClick={(e) => {
								e.preventDefault();
								setDisplayNewAvailability(true)
							}}
					>
						<AddCircleIcon style={{marginRight: "10px"}}/> Add Availability
					</Button>
				</div>
			}
		</TableCell>
		<TableCell>
			<FormControlLabel
				control={
					<Checkbox
						// checked={method.checked}
						// onChange={() => handlePaymentMethodStateChange(index)}
						// name={method.label}
						color="primary"
					/>
				}
				label="Not Available All Day"
			/>
		</TableCell>
	</TableRow>
		<Dialog
			open={conflictErrorDialogOpen}
			onClose={handleDialogClose}
		>
			<DialogTitle style={{color: errorRed}}>
				Sorry, the times don't quite make sense. Please check again!
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{conflictErrorMessage}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDialogClose}>
					Ok, I'll change it
				</Button>
			</DialogActions>
		</Dialog>
	</>)
}