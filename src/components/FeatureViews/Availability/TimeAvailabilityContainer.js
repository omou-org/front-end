import React, {useCallback, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import DayAvailabilityEntry from "./DayAvailabilityEntry";
import {TimeAvailabilityContext} from "./TimeAvailabilityContext";
import gql from "graphql-tag";

const MUTATE_INSTRUCTOR_AVAILABILITY = gql`mutation CreateInstructorAvailability {
  __typename
  createInstructorAvailability(dayOfWeek: MONDAY, endTime: "08:00", startTime: "07:00", instructor: "7") {
    instructorAvailability {
      endTime
      startTime
      id
    }
  }
}`;

export default function TimeAvailabilityContainer() {
	const [autoApprove, setAutoApprove] = useState(false);
	const [availabilitiesByDayOfWeek, setAvailability] = useState([
		{dayOfWeek: "Sunday", availabilities: {},},
		{dayOfWeek: "Monday", availabilities: {},},
		{dayOfWeek: "Tuesday", availabilities: {},},
		{dayOfWeek: "Wednesday", availabilities: {},},
		{dayOfWeek: "Thursday", availabilities: {},},
		{dayOfWeek: "Friday", availabilities: {},},
		{dayOfWeek: "Saturday", availabilities: {},},
	]);

	const handleAutoApprove = useCallback(() => {
		setAutoApprove(!autoApprove);
	}, [setAutoApprove, autoApprove]);

	const updateAvailability = (startTime, endTime, dayOfWeekIndex, availabilityId) => {
		setAvailability((prevAvailability) => {
			let updatedAvailability = [...prevAvailability];
			const dateToUpdateAvailability = prevAvailability[dayOfWeekIndex];
			const newAvailabilities = (action, newTempAvailabilityId) => {
				switch (action) {
					case "delete": {
						return {}
					}
					default: {
						return {
							...dateToUpdateAvailability.availabilities,
							[newTempAvailabilityId]: {
								startTime,
								endTime,
								id: newTempAvailabilityId,
							}
						}
					}
				}
			};

			const newTempAvailabilityId = availabilityId || `${Object.keys(dateToUpdateAvailability.availabilities).length}_new`;
			updatedAvailability[dayOfWeekIndex] = {
				...dateToUpdateAvailability,
				availabilities: newAvailabilities(availabilityId, newTempAvailabilityId)
			};
			return updatedAvailability;
		});
	};

	return (<TimeAvailabilityContext.Provider value={{availabilitiesByDayOfWeek, updateAvailability}}>
		<Grid item container justify="space-between">
			<Grid item container justify="flex-start" direction="column">
				<Grid item>
					<Typography variant="h4" align="left">Tutoring Hours</Typography>
				</Grid>
				<Grid item style={{textAlign: "left"}}>
					<FormControlLabel
						control={<Checkbox checked={autoApprove} onChange={handleAutoApprove}
										   name="autoApprove" color="primary"/>}
						label="Auto Approve Upcoming Requests"
					/>
				</Grid>
				<Grid item>
					<Typography style={{fontStyle: "italic", fontSize: ".8em"}} align="left">
						By checking this box, I consent to auto-accept upcoming requests that match with my
						availability.
					</Typography>
				</Grid>
			</Grid>
		</Grid>
		<Grid item xs={12} container>
			<Table>
				{
					availabilitiesByDayOfWeek.map(({dayOfWeek, availabilities}, index) =>
						<DayAvailabilityEntry key={index} availabilities={availabilities} dayOfWeek={dayOfWeek}
											  dayIndex={index}/>)
				}
			</Table>
		</Grid>
	</TimeAvailabilityContext.Provider>)
}