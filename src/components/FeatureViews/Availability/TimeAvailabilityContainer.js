import React, {useCallback, useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";

export default function TimeAvailabilityContainer() {
	const [autoApprove, setAutoApprove] = useState(false);
	const handleAutoApprove = useCallback((_, newValue) => {
		setAutoApprove(!autoApprove);
	}, [setAutoApprove, autoApprove]);
	return (<>
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
		<Grid item container>
			<Table>

			</Table>
		</Grid>
	</>)
}