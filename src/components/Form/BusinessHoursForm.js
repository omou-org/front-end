import React, {useCallback} from "react";
import {Form as ReactForm, useFormState} from 'react-final-form';
import {TimePicker} from "./FieldComponents/Fields";
import Grid from "@material-ui/core/Grid";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import PropTypes from 'prop-types';
import useOnboardingActions from "../FeatureViews/Onboarding/ImportStepperActions";
import gql from 'graphql-tag';
import {useMutation} from "@apollo/client";
import {Checkboxes} from "mui-rff";
// import Loading from "../OmouComponents/Loading";

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

// const GET_BIZ_HOURS = gql`
// 	query GetBusinessHours {
// 		business{
// 			id
// 			businessavailabilitySet{
// 				dayOfWeek
// 				endTime
// 				StartTime
// 			}
// 		}
// 	}
// `;

const BusinessDayHoursField = ({day}) => {
	const {values} = useFormState();
	const isDayClosed = values[`${day.substring(0, 3)}-checked`];

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
				label='Start Time'
				emptyLabel='Start Time'
				disabled={isDayClosed}
			/>
		</Grid>
		<Grid item xs={4}>
			<TimePicker
				name={`${day}-endTime`}
				label='End Time'
				emptyLabel='End Time'
				disabled={isDayClosed}
			/>
		</Grid>
		<Grid item xs={2}>
			<Checkboxes name={`${day.substring(0, 3)}-checked`} data={[{label: 'Closed', value: `${day}-checked`}]}/>
		</Grid>
	</Grid>);
};

BusinessDayHoursField.propTypes = {
    day: PropTypes.string
};

export default function BusinessHoursForm({ isOnboarding }) {
	const [createBizHours] = useMutation(CREATE_BIZ_HOURS);
	// const {data, loading, error} = useQuery(GET_BIZ_HOURS);
	const {
		handleBack,
		handleNext,
	} = useOnboardingActions();

	const parseDayTimeTitle = (dayTimeTitle) => {
		const separatorIndex = dayTimeTitle.indexOf("-");
		const dayOfWeek = dayTimeTitle.substring(0, separatorIndex).toUpperCase();
		const valueKey = dayTimeTitle.substring(separatorIndex + 1);
		return {
			dayOfWeek,
			valueKey,
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

			timesArr
				.filter(time => {
					const {dayOfWeek} = parseDayTimeTitle(time);
					return dayOfWeek.length > 3;
				})
				.forEach((time) => {
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
					valueKey,
				} = parseDayTimeTitle(dayTimeTitle);
				const isMatchingDay = (day) => (day === dayOfWeek || day.includes(dayOfWeek));
				const indexOfDay = bizHoursValues.findIndex(item => isMatchingDay(item.dayOfWeek));

				const isDayTime = dayOfWeek.length > 3 && time;
				const value = isDayTime ? time.format('HH:mm') : time;

				if (indexOfDay > -1) {
					bizHoursValues[indexOfDay] = {
						...bizHoursValues[indexOfDay],
						[valueKey]: value,
					};
				} else {
					bizHoursValues.push({
						dayOfWeek,
						[valueKey]: value,
					});
				}

				return bizHoursValues;
			}, [])
			.filter(bizDayHours => !bizDayHours.checked);

		createBizHours({variables: {bizHours}});
		handleNext();
	}, [handleNext, createBizHours]);

	const handleBackClick = () => handleBack();

	// if(loading)
	// 	return <Loading/>;
	// if(error)
	// 	return (<div>{`There's been an error!: ${error.message}`}</div>);
	//
	// console.log(data);

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

  