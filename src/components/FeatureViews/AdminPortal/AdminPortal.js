import React from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./AdminPortal.scss";
import AdminActionCenter from "./AdminActionCenter";
import AdminViewsRoutes from "components/Routes/AdminViewsRoutes";
import BackButton from "components/BackButton";

const AdminPortal = () => (
	<form>
		<Paper className="registration-cart paper">
			<Grid container layout="row">
				<Grid item xs={12}>
					<BackButton/>
					<hr/>
				</Grid>
				<Grid item xs={12}>
					<Typography align="left" variant="h3">
						Admin Portal
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<AdminActionCenter/>
				</Grid>
				<Grid item xs={12}>
					<AdminViewsRoutes/>
				</Grid>
			</Grid>
		</Paper>
	</form>
);

AdminPortal.propTypes = {};

export default AdminPortal;
