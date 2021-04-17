import React, {useCallback, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import EnrollmentSessionRow from "./EnrollmentSessionRow";
import NoListAlert from "../../OmouComponents/NoListAlert";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

export default function EnrollmentSummaryTab({sessions, enrollment}) {
	const [highlightSession, setHighlightSession] = useState(false);

	const handleHighlightSwitch = useCallback(() => {
		setHighlightSession((prevHighlight) => !prevHighlight);
	}, []);

	return (<Grid container direction="column">
		<Grid item container alignItems='flex-start'>
			<Grid item xs={3}>
				<Grid item>
					<FormControl component='fieldset'>
						<FormGroup>
							<FormControlLabel
								control={
									<Switch
										checked={highlightSession}
										color='primary'
										onChange={
											handleHighlightSwitch
										}
										value='upcoming-session'
									/>
								}
								label='Highlight Upcoming Session'
							/>
						</FormGroup>
					</FormControl>
				</Grid>
			</Grid>
		</Grid>
		<Grid
			className='accounts-table-heading'
			container
			item
			xs={12}
		>
			<Grid item xs={1}/>
			<Grid item xs={2}>
				<Typography align='left' className='table-text'>
					Session Date
				</Typography>
			</Grid>
			<Grid item xs={2}>
				<Typography align='left' className='table-text'>
					Day
				</Typography>
			</Grid>
			<Grid item xs={3}>
				<Typography align='left' className='table-text'>
					Time
				</Typography>
			</Grid>
			<Grid item xs={1}>
				<Typography align='left' className='table-text'>
					Tuition
				</Typography>
			</Grid>
			<Grid item xs={2}>
				<Typography
					align='center'
					className='table-text'
				>
					Status
				</Typography>
			</Grid>
		</Grid>
		<Grid
			container
			spacing={1}
			data-cy='enrollment-sessions'
		>
			{sessions.length !== 0 ? (
				sessions.map((session) => {
					return (
						<EnrollmentSessionRow
							session={session}
							enrollmentData={enrollment}
							highlightSession={highlightSession}
						/>
					);
				})
			) : (
				<NoListAlert list='Course'/>
			)}
		</Grid>
	</Grid>)
}