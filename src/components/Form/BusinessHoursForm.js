import React from "react";
import {Form as ReactForm} from 'react-final-form';
import {Checkboxes} from 'mui-rff';
import {TimePicker} from "./FieldComponents/Fields";
import Grid from "@material-ui/core/Grid";
import OnboardingControls from "../FeatureViews/Onboarding/OnboardingControls";
import {ResponsiveButton} from "../../theme/ThemedComponents/Button/ResponsiveButton";
import PropTypes  from 'prop-types';

const BusinessDayHoursField = ({day}) => {
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
	</Grid>);
};


BusinessDayHoursField.propTypes = {
    day: PropTypes.string
};
export default function BusinessHoursForm({ isOnboarding }) {
    const onSubmit = async () => {};

    // const daysOfWeekLong = [
    //     'Monday',
    //     'Tuesday',
    //     'Wednesday',
    //     'Thursday',
    //     'Friday',
    //     'Saturday',
    //     'Sunday',
    // ];
    const daysOfWeekShort = [
        'Mon',
        'Tues',
        'Wed',
        'Thurs',
        'Fri',
        'Sat',
        'Sun',
    ];

    return (
        <ReactForm
            onSubmit={onSubmit}
            render={({ handleSubmit }) => (
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
                            <BusinessDayHoursField key={i} day={day} />
                        ))}
                    </Grid>
                    <Grid item>
                        {isOnboarding ? (
                            <OnboardingControls preNextHandler={handleSubmit} />
                        ) : (
                            <ResponsiveButton onClick={handleSubmit}>
                                Submit
                            </ResponsiveButton>
                        )}
                    </Grid>
                </Grid>
            )}
        />
    );
}

BusinessHoursForm.propTypes = {
    isOnboarding : PropTypes.bool
  };

  