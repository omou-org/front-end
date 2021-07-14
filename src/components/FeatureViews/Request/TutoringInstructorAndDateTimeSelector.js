import React from "react";
import Grid from "@material-ui/core/Grid";
import {Field, useFormState} from 'react-final-form';
import PropTypes from "prop-types";
import {capitalizeString} from "../../../utils";
import Typography from "@material-ui/core/Typography";
import {omouBlue} from "../../../theme/muiTheme";
import UserAvatar from "../Accounts/UserAvatar";

const TutoringInstructorSelect = (props) => {
	const {data} = props;
	const {values} = useFormState();

	return (<>
			{
				data.map(instructorAvailability => (<label key={instructorAvailability.instructor.id}
														   className={`instructor-select-label 
							   ${values.instructor === instructorAvailability.instructor.id.toString() ? 'selected' : ''}`}
					>
						<Field
							name="instructor"
							component="input"
							type="radio"
							value={instructorAvailability.instructor.id.toString()}
							className='instructor-select-btn'
						/>
						<div>
							<UserAvatar size={20} fontSize={10}
										name={`${instructorAvailability.instructor.firstName} ${instructorAvailability.instructor.lastName}`}/>
							<span style={{fontSize: '14px', display: 'inline-block'}}>
									{`${instructorAvailability.instructor.firstName} ${instructorAvailability.instructor.lastName}`}
								</span>
						</div>
						<div style={{fontSize: '12px'}}>{`${instructorAvailability.instructor.biography}`}</div>
					</label>
				))
			}
		</>
	);
};

TutoringInstructorSelect.propTypes = {
	data: PropTypes.any,
	name: PropTypes.string,
	input: PropTypes.object,
	onChange: PropTypes.func,
};

const TutoringTimeSelect = React.memo((props) => {
	const {availabilities, instructor} = props;
	console.log("tutoring time select");
	if (!availabilities || !instructor) return '';
	const instructorAvailabilitiesEntries = Object.entries(availabilities);
	const DayOfWeekTimeSelect = React.memo(({dayOfWeek, times}) => {
		const {values} = useFormState();
		console.log("day of week time select", values);
		return (<div>
			<Typography style={{"fontWeight": 'bold', marginBottom: '5px', color: omouBlue}} align='left'>
				{capitalizeString(dayOfWeek)}
			</Typography>
			<Typography style={{"fontWeight": 'bold', marginBottom: '15px'}} align='left'>
				Start Time
			</Typography>
			<div style={{marginTop: '20px', marginBottom: '20px'}}>
				{
					times.map((time, index) => {
						return (<label
							key={`${dayOfWeek}-${time}-${index.toString()}`}
							className={`dayOfWeek-time-select-label`}
							style={{'textAlign': 'left'}}
						>
							<Field
								name={`${dayOfWeek}-time`}
								component="input"
								type="radio"
								value={`${dayOfWeek}-${time}-${index.toString()}`}
								className='dayOfWeek-time-select-btn'
							/>
							<div>{time}</div>
						</label>);
					})
				}
			</div>
		</div>);
	});
	DayOfWeekTimeSelect.displayName = 'DayOfWeekTimeSelect';
	DayOfWeekTimeSelect.propTypes = {
		dayOfWeek: PropTypes.string,
		times: PropTypes.array,
	};

	return (<div style={{border: '#EBFAFF 3px solid', borderRadius: '5px', padding: '16px'}}>
		{
			instructorAvailabilitiesEntries.map(([dayOfWeek, times], index) =>
				(<DayOfWeekTimeSelect key={index} dayOfWeek={dayOfWeek} times={times}/>))
		}
	</div>);
});

TutoringTimeSelect.displayName = 'TutoringTimeSelect';
TutoringTimeSelect.propTypes = {
	availabilities: PropTypes.any,
	instructor: PropTypes.any,
};

const TutoringInstructorAndDateTimeSelector = () => {
	const {values} = useFormState();

	const data = [
		{
			"instructor": {
				"id": 4,
				"firstName": "Tim",
				"lastName": "Yang",
				"biography": "Tim is a teacher"
			},
			"tutoringAvailability": {
				"monday": ["9:00", "9:30", "10:00", "10:30"],
				"friday": ["9:00", "9:30", "10:00"],
			}
		},
		{
			"instructor": {
				"id": 5,
				"firstName": "Andrew",
				"lastName": "Knapp",
				"biography": "AK is an awesome teacher"
			},
			"tutoringAvailability": {
				"monday": ["9:00", "9:30", "10:30"],
				"friday": ["9:00", "9:30", "10:00"],
			}
		},
		{
			"instructor": {
				"id": 6,
				"firstName": "Peter",
				"lastName": "Kang",
				"biography": "Peter is a cool teacher"
			},
			"tutoringAvailability": {
				"monday": ["9:00", "9:30", "10:30"],
				"friday": ["9:00"],
			}
		},
	];

	if (!values.duration) return <Grid item>
		<Typography>
			No information available, please select day and duration of meeting before moving forward.
		</Typography>
	</Grid>;

	const selectedInstructorAvailabilities = (instructorId) => data
		.find((InstructorAndAvailability) =>
			InstructorAndAvailability.instructor.id == instructorId)?.tutoringAvailability;
	const availabilities = selectedInstructorAvailabilities(values.instructor);
	return (<Grid item container direction='row'>
		<Grid item xs={4} container direction='column'>
			<TutoringInstructorSelect data={data}/>
		</Grid>
		<Grid item xs={8}>
			<TutoringTimeSelect
				instructor={values.instructor}
				availabilities={availabilities}/>
		</Grid>
	</Grid>);
};


export default TutoringInstructorAndDateTimeSelector;