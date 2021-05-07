import React, {useCallback, useState} from "react";
import {Form as ReactForm} from 'react-final-form';
import {TimePicker} from "./FieldComponents/Fields";
import Grid from "@material-ui/core/Grid";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import PropTypes from 'prop-types';
import useOnboardingActions from "../FeatureViews/Onboarding/ImportStepperActions";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import gql from 'graphql-tag';
import {useMutation} from "@apollo/client";

const CREATE_BIZ_HOURS = gql`
	mutation CreateBusinessHours($bizHours: [BusinessAvailabilityInput]){
			updateBusiness(availabilities: $bizHours){
					business{
						id
						availabilities {
							dayOfWeek
							endTime
							startTime
						}
					}
			}
	}		
`;

const BusinessDayHoursField = ({day}) => {
	const [closeChecked, setCloseChecked] = useState(false);

	const handleCheck = () => {
		setCloseChecked((pastCheckState) => (!pastCheckState));
	};

	return (<Grid
		item container
		align="center"
		justify="center"
		alignItems="center"
		spacing={3}
	>
		<Grid item xs={2}>{day}</Grid>
		<Grid item xs={4}>
			<TimePicker
				name={`${day}-startTime`}
				label={'Start Time'}
				emptyLabel='Start Time'
				disabled={closeChecked}
			/>
		</Grid>
		<Grid item xs={4}>
			<TimePicker
				name={`${day}-endTime`}
				label={'End Time'}
				emptyLabel='End Time'
				disabled={closeChecked}
			/>
		</Grid>
		<Grid item xs={2}>
			<FormControlLabel
				control={<Checkbox checked={closeChecked} onChange={handleCheck} name="closed"/>}
				label="Closed"
			/>
		</Grid>
	</Grid>);
};

BusinessDayHoursField.propTypes = {
    day: PropTypes.string
};

export default function BusinessHoursForm({ isOnboarding }) {
	const [createBizHours] = useMutation(CREATE_BIZ_HOURS);
	const {
		handleBack,
		handleNext,
	} = useOnboardingActions();

	const parseDayTimeTitle = (dayTimeTitle) => {
		const separatorIndex = dayTimeTitle.indexOf("-");
		const dayOfWeek = dayTimeTitle.substring(0, separatorIndex).toUpperCase();
		const startOrEndTime = dayTimeTitle.substring(separatorIndex + 1);
		return {
			dayOfWeek,
			startOrEndTime,
		};
	};

	const daysOfWeekShort = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];

	const validate = useCallback((formData) => {
		const errors = {};
		const dayTimeKeys = Object.keys(formData);
		const getUnpairedTimes = (timesArr) => {
			const timeSet = new Set();
			const matchingTimesSet = new Set();
			let currentDay;

			timesArr.forEach((time) => {
				currentDay = time.substring(0, time.indexOf('-'));

				if (timeSet.has(currentDay)) {
					timeSet.delete(currentDay);
					matchingTimesSet.add(currentDay);
				} else {
					timeSet.add(currentDay);
				}
			});

			return {
				unpairedDayTimes: [...timeSet],
				pairedDayTimes: [...matchingTimesSet],
			};
		};
		const {
			unpairedDayTimes,
			pairedDayTimes,
		} = getUnpairedTimes(dayTimeKeys);
		const startTimeKey = (day) => `${day}-startTime`;
		const endTimeKey = (day) => `${day}-endTime`;
		// Set errors for unpaired day times
		unpairedDayTimes.forEach(day => {
			errors[startTimeKey(day)] = 'Incomplete Business Hours';
			errors[endTimeKey(day)] = 'Incomplete Business Hours';
		});

		// Validate end day times
		pairedDayTimes.forEach(day => {
			const startTime = formData[startTimeKey(day)];
			const endTime = formData[endTimeKey(day)];
			console.log(startTime, endTime);
			if (endTime.isBefore(startTime)) {
				errors[endTimeKey(day)] = 'Select a Later End Time';
			}
		});

		return errors;
	}, []);

	const submit = useCallback(async (formData) => {
		const bizHours = Object.entries(formData)
			.reduce((bizHoursValues, [dayTimeTitle, time]) => {
				const {
					dayOfWeek,
					startOrEndTime,
				} = parseDayTimeTitle(dayTimeTitle);
				const timeString = time.format('HH:mm');

				const indexOfDay = bizHoursValues.findIndex(item => item.dayOfWeek === dayOfWeek);

				if (indexOfDay > -1) {
					bizHoursValues[indexOfDay] = {
						...bizHoursValues[indexOfDay],
						[startOrEndTime]: timeString,
					};
				} else {
					bizHoursValues.push({
						dayOfWeek,
						[startOrEndTime]: timeString,
					});
				}
				return bizHoursValues;
			}, []);

		createBizHours({variables: {bizHours}});
		handleNext();
	}, [handleNext, createBizHours]);

	const handleBackClick = () => handleBack();

    return (
		<ReactForm
			onSubmit={submit}
			validate={validate}
			render={({handleSubmit}) => (
				<form
					onSubmit={handleSubmit}
				>
					<Grid
						item
						container
						spacing={3}
						direction='column'
						alignItems='center'
						justify='center'
					>
						<Grid item xs={12} container>
							{daysOfWeekShort.map((day, i) => (
								<BusinessDayHoursField key={i} day={day}/>
							))}
						</Grid>
						<Grid item
							  container
							  spacing={3}
							  direction='row'
							  alignItems='center'
							  justify='center'
						>
							{isOnboarding ? (<>
									<Grid item>
										<ResponsiveButton
											onClick={handleBackClick}
											variant='contained'
										>
											Back
										</ResponsiveButton>
									</Grid>
									<Grid item>
										<ResponsiveButton
											type='submit'
											variant='contained'
										>
											Submit & Next
										</ResponsiveButton>
									</Grid>
								</>
							) : (
								<ResponsiveButton type='submit'>
									Submit
								</ResponsiveButton>
							)}
						</Grid>
					</Grid>
				</form>
			)}
        />
    );
}

BusinessHoursForm.propTypes = {
    isOnboarding : PropTypes.bool
  };

  