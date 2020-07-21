import React, {useCallback, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import DayAvailabilityEntry from "./DayAvailabilityEntry";
import {TimeAvailabilityContext} from "./TimeAvailabilityContext";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import {useSessionStorage} from "../../../utils";
import {useQuery} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import Loading from "../../OmouComponents/Loading";

const MUTATE_INSTRUCTOR_AVAILABILITY = gql`mutation CreateInstructorAvailability {
  __typename
  createInstructorAvailability(dayOfWeek: MONDAY, endTime: "08:00", startTime: "07:00", instructor: "7") {
    instructorAvailability {
      endTime
      startTime
      id
      dayOfWeek
    }
  }
}`;

const GET_INSTRUCTOR_AVAILABILITY = gql`query GetInstructorAvailability($instructorId:ID!){
	instructorAvailability(instructorId: $instructorId){
		endTime
		startTime
		id
		dayOfWeek
	}
}`

const dateToIndex = {
	"SUNDAY": 0,
	"MONDAY": 1,
	"TUESDAY": 2,
	"WEDNESDAY": 3,
	"THURSDAY": 4,
	"FRIDAY": 5,
	"SATURDAY": 6,
};

export default function TimeAvailabilityContainer() {
	const [autoApprove, setAutoApprove] = useState(false);
	const [availabilitiesByDayOfWeek, setAvailability] = useSessionStorage("availabilitiesByDayOfWeek", [
		{dayOfWeek: "SUNDAY", availabilities: {},},
		{dayOfWeek: "MONDAY", availabilities: {},},
		{dayOfWeek: "TUESDAY", availabilities: {},},
		{dayOfWeek: "WEDNESDAY", availabilities: {},},
		{dayOfWeek: "THURSDAY", availabilities: {},},
		{dayOfWeek: "FRIDAY", availabilities: {},},
		{dayOfWeek: "SATURDAY", availabilities: {},},
	]);
	const AuthUser = useSelector(({auth}) => auth);
	const {data, loading} = useQuery(GET_INSTRUCTOR_AVAILABILITY, {
		variables: {instructorId: AuthUser.user.id}
	});

	useEffect(() => {
		if (!loading) {
			const {instructorAvailability} = data;

			if (instructorAvailability.length > 0) {
				setAvailability((prevState) => {
					let newState = prevState;
					instructorAvailability.forEach(availability => {
						const availabilityIndex = dateToIndex[availability.dayOfWeek];
						newState[availabilityIndex] = {
							dayOfWeek: availability.dayOfWeek,
							availabilities: {
								...prevState[availabilityIndex].availabilities,
								[availability.id]: {
									...availability,
									startTime: "2020-01-01T" + availability.startTime.substring(0, 5),
									endTime: "2020-01-01T" + availability.endTime.substring(0, 5),
								},
							},
						};
					});
					return newState;
				})
			}
		}
	}, [setAvailability, data, loading])

	const handleAutoApprove = useCallback(() => {
		setAutoApprove(!autoApprove);
	}, [setAutoApprove, autoApprove]);

	const updateAvailability = (startTime, endTime, dayOfWeekIndex, availabilityId, toDelete) => {
		setAvailability((prevAvailability) => {
			let updatedAvailability = [...prevAvailability];
			const dateToUpdateAvailability = prevAvailability[dayOfWeekIndex];
			const newAvailabilities = (availabilityId, toDelete) => {
				if (toDelete) {
					delete dateToUpdateAvailability.availabilities[availabilityId];
					return dateToUpdateAvailability.availabilities;
				} else {
					return {
						...dateToUpdateAvailability.availabilities,
						[availabilityId]: {
							startTime,
							endTime,
							id: availabilityId,
						}
					}
				}
			};

			const newTempAvailabilityId = availabilityId || `${Object.keys(dateToUpdateAvailability.availabilities).length}_new`;
			updatedAvailability[dayOfWeekIndex] = {
				...dateToUpdateAvailability,
				availabilities: newAvailabilities(newTempAvailabilityId, toDelete)
			};

			return updatedAvailability;
		});
	};

	if (loading) return <Loading small/>;

	return (<TimeAvailabilityContext.Provider value={{availabilitiesByDayOfWeek, updateAvailability}}>
		<Grid item container justify="space-between" direction="row">
			<Grid item container justify="flex-start" direction="column" xs={9}>
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
			<Grid item xs={3}>
				<Button variant="outlined" style={{marginRight: "10px"}}>Reset All</Button>
				<Button variant="outlined">Update</Button>
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