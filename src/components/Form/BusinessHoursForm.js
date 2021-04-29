import React from "react";
import {Form as ReactForm, useFormState} from 'react-final-form';
import {Checkboxes, makeValidate} from 'mui-rff';
import {TimePicker} from "./FieldComponents/Fields";
import Grid from "@material-ui/core/Grid";

const BusinessDayHoursField = ({day}) => {
	const {values} = useFormState();

	console.log(values);

	return (<Grid item container align="center" justify="center" alignItems="center">
		<Grid item xs={2}>{day}</Grid>
		<Grid item xs={4}>
			<TimePicker
				name={`${day}-startTime`}
				label={'Start Time'}
				emptyLabel='Start Time'
			/>
		</Grid>
		<Grid item xs={4}>
			<TimePicker
				name={`${day}-endTime`}
				label={'End Time'}
				emptyLabel='End Time'
			/>
		</Grid>
		<Grid item xs={2}>
			<Checkboxes name={`Closed-${day}`} data={[{label: 'Closed'}]}/>
		</Grid>
	</Grid>)
}

export default function BusinessHoursForm({isLongDay}) {

	const validate = makeValidate();
	const onSubmit = async ({bizHours}) => {

	}


	const daysOfWeekLong = [
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
		'Sunday',
	];
	const daysOfWeekShort = [
		'Mon',
		'Tues',
		'Wed',
		'Thurs',
		'Fri',
		'Sat',
		'Sun',
	];

	return (<ReactForm
		onSubmit={onSubmit}
		validate={validate}
		render={({handleSubmit}) => (
			<form onSubmit={handleSubmit}>
				<Grid container>
					{
						daysOfWeekShort.map((day) => (
							<BusinessDayHoursField day={day}/>
						))
					}
				</Grid>
			</form>)
		}
	/>)
}