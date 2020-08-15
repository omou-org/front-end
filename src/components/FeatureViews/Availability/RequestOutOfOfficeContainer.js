import React from "react";
import Grid from "@material-ui/core/Grid";
import OutlinedContainer from "../../OmouComponents/OutlinedContainer";
import {skyBlue} from "../../../theme/muiTheme";
import CreateOOOForm from "./CreateOOOForm";

export default function RequestOutOfOfficeContainer() {
	return (<Grid container direction="row" style={{width: "auto"}} spacing={2}>
		<Grid item xs={8}>
			<OutlinedContainer styles={{backgroundColor: skyBlue, border: "none"}}>
				<CreateOOOForm/>
			</OutlinedContainer>
		</Grid>
		<Grid item xs={4} container direction="column">
			<Grid item xs={6}>
				<OutlinedContainer>
					Upcoming
				</OutlinedContainer>
			</Grid>
			<Grid item xs={6}>
				<OutlinedContainer>
					Log
				</OutlinedContainer>
			</Grid>
		</Grid>
	</Grid>)
}