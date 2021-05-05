import React, {useCallback, useState} from "react";
import {Form as ReactForm} from 'react-final-form';
import {TimePicker} from "./FieldComponents/Fields";
import Grid from "@material-ui/core/Grid";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import PropTypes from 'prop-types';
import useOnboardingActions from "../FeatureViews/Onboarding/ImportStepperActions";
import {Checkbox, FormControlLabel} from "@material-ui/core";
// import gql from 'graphql-tag';
// import {useMutation} from "@apollo/client";
//
// const CREATE_BIZ_HOURS = gql`
// 	mutation CreateBusinessHours(
// 		$bizAvailabilities: [BusinessAvailabilityInput]
// 		){
// 			updateBusiness(
// 				availabilities: $bizAvailabilities
// 				){
// 					business{
// 						id
// 						availabilities {
// 							dayOfWeek
// 							endTime
// 							startTime
// 						}
// 					}
// `;

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
	// const [createBizHours] = useMutation(CREATE_BIZ_HOURS);
	const {
		handleBack,
		handleNext,
	} = useOnboardingActions();

	const submit = useCallback(async (formData) => {
		const parseDayTimeTitle = (dayTimeTitle) => {
			const separatorIndex = dayTimeTitle.indexOf("-");
			const dayOfWeek = dayTimeTitle.substring(0, separatorIndex);
			const startOrEndTime = dayTimeTitle.substring(separatorIndex);
			return {
				dayOfWeek,
				startOrEndTime,
			}
		}
		const bizHours = Object.entries(formData)
			.reduce((bizHoursValues, [dayTimeTitle, time]) => {
				const {
					dayOfWeek,
					startOrEndTime,
				} = parseDayTimeTitle(dayTimeTitle);
				const timeString = time.format('HH:mm');

			}, {});
		console.log(Object.entries(formData));
		// createBizHours();
		handleNext();
	}, [handleNext]);

	const handleBackClick = () => handleBack();

	const daysOfWeekShort = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];

    return (
        <ReactForm
			onSubmit={submit}
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

  