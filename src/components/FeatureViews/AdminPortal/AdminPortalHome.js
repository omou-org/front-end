import React from "react";
import Grid from "@material-ui/core/Grid";

import "./AdminPortal.scss";
import UnpaidSessions from "./UnpaidSessions";

const AdminPortalHome = () => (
	<Grid container>
		<UnpaidSessions/>
	</Grid>
);

AdminPortalHome.propTypes = {};

export default AdminPortalHome;
