import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import "./AdminPortal.scss";
import AdminActionCenter from "./AdminActionCenter";
import AdminViewsRoutes from "components/Routes/AdminViewsRoutes";
import BackButton from "components/OmouComponents/BackButton";

const AdminPortal = () => (
	<form>
		<Grid container layout="row">
			<Grid item xs={12}>
				<BackButton />
				<hr />
			</Grid>
			<Grid item xs={12}>
				<Typography align="left" variant="h3">
					Admin Portal
					</Typography>
			</Grid>
			<Grid item xs={12}>
				<AdminActionCenter />
			</Grid>
			<Grid item xs={12}>
				<AdminViewsRoutes />
			</Grid>
		</Grid>
	</form>
);

AdminPortal.propTypes = {};

export default AdminPortal;
