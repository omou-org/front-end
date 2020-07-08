import React, {useCallback, useState} from "react";
import {useSelector} from "react-redux";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TimeAvailabilityContainer from "./TimeAvailabilityContainer";
import RequestOutOfOffice from "./RequestOutOfOffice";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

export default function AvailabilityContainer() {
	const AuthUser = useSelector(({auth}) => auth);
	const [tab, setTab] = useState(0);

	const handleChangeTab = useCallback((_, newValue) => {
		console.log(newValue);
		setTab(newValue);
	}, [setTab]);

	return (<BackgroundPaper>
		<Grid container direction="row" spacing={4}>
			<Grid item>
				<Typography variant="h5" align="left">Summit Tutoring Business Hours</Typography>
				<Typography align="left">Monday - Friday: 2:00 PM - 9:00 PM</Typography>
				<Typography align="left">Saturday: 9:00 AM - 4:00 PM</Typography>
				<Typography align="left">Sunday: CLOSED</Typography>
			</Grid>
			<Grid item container xs={12}>
				<Grid item xs={12}>
					<Tabs
						value={tab}
						onChange={handleChangeTab}
						aria-label="Instructor availability tabs"
					>
						<Tab label="Time Availability"/>
						<Tab label="Course Availability" disabled/>
						<Tab label="Request Out of Office"/>
					</Tabs>
				</Grid>
				<Grid item container xs={12}>
					<TabPanel value={tab} index={0}>
						<TimeAvailabilityContainer/>
					</TabPanel>
					<TabPanel value={tab} index={1}>
						TBD
					</TabPanel>
					<TabPanel value={tab} index={2}>
						<RequestOutOfOffice/>
					</TabPanel>
				</Grid>
			</Grid>

		</Grid>
	</BackgroundPaper>)
}