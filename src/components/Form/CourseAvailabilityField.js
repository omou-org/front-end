import Grid from "@material-ui/core/Grid";
import * as Fields from "mui-rff";
import MenuItem from "@material-ui/core/MenuItem";
import {useFormState} from 'react-final-form'
import React from "react";
import {TimePicker} from "./Fields";

const CourseAvailabilityField = ({count}) => {
	const {values} = useFormState();

	return (
		<Grid container item spacing={2} style={{marginTop: "16px"}}>
			<Grid item xs={4}>
				<Fields.Select
					name={`dayOfWeek-${count}`}
					label="Day of Week"
					required={count === 1}
					value={values[`dayOfWeek-${count}`] || values.dayAndTime[`dayOfWeek-${count}`]}
				>
					<MenuItem value="MONDAY">Monday</MenuItem>
					<MenuItem value="TUESDAY">Tuesday</MenuItem>
					<MenuItem value="WEDNESDAY">Wednesday</MenuItem>
					<MenuItem value="THURSDAY">Thursday</MenuItem>
					<MenuItem value="FRIDAY">Friday</MenuItem>
					<MenuItem value="SATURDAY">Saturday</MenuItem>
					<MenuItem value="SUNDAY">Sunday</MenuItem>
				</Fields.Select>
			</Grid>
			<Grid item xs={4}>
				<TimePicker
					name={`startTime-${count}`}
					label="Start Time"
					required={count === 1}
					value={values[`startTime-${count}`] || values.dayAndTime[`startTime-${count}`]}
					emptyLabel="Start Time"
				/>
			</Grid>
			<Grid item xs={4}>
				<TimePicker
					name={`endTime-${count}`}
					label="End Time"
					required={count === 1}
					value={values[`endTime-${count}`] || values.dayAndTime[`endTime-${count}`]}
					emptyLabel="End Time"
				/>
			</Grid>
		</Grid>
	)
}

export default CourseAvailabilityField;