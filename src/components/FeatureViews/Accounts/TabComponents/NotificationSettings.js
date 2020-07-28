import React, {useEffect, useState} from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import {omouBlue} from "../../../../theme/muiTheme";

const StyledTableRow = withStyles((theme) => ({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
}))(TableRow);

const useStyles = makeStyles({
	table: {
		minWidth: 650,
		marginTop: "10px;"
	},
	settingCol: {
		width: "30%",
	}
});

const createNotificationSetting = (name, description, email, sms) =>
	({name, description, email, sms, optional: true});

const rows = [
	createNotificationSetting("Session Reminder", "Get notified when a session is coming up.", true, false),
	createNotificationSetting("Payment Reminder", "Get notified when a payment is coming up.", true, true),
];

const createOptInSetting = (name, description, optIn) =>
	({name, description, optIn, optional: false});

const optInRows = [
	createOptInSetting("SMS Schedule Updates", "Get notified for schedule changes by SMS", true),
	createOptInSetting("SMS Course Requests", "Get notified for cancellations by SMS", false),
];

export default function NotificationSettings() {
	const classes = useStyles();
	const [notificationRows, setNotificationRows] = useState([]);
	const [optInNotifRows, setOptInNotifRows] = useState([]);

	useEffect(() => {
		setNotificationRows([
			createNotificationSetting("Session Reminder", "Get notified when a session is coming up.", true, false),
			createNotificationSetting("Payment Reminder", "Get notified when a payment is coming up.", true, true),
		]);
		setOptInNotifRows([
			createOptInSetting("SMS Schedule Updates", "Get notified for schedule changes by SMS", true),
			createOptInSetting("SMS Course Requests", "Get notified for cancellations by SMS", false),
		]);
	}, []);

	const handleSettingChange = (row) => (e) => {
		e.preventDefault();
		if (row.optional) {
			setNotificationRows((prevState) => {
				let newState = new Array(prevState);

			})
		}
	}

	return (<>
		<Grid container style={{backgroundColor: "#F5F5F5", padding: "1%", marginTop: "30px"}}>
			<Typography style={{color: omouBlue, fontWeight: 600}}>Notification Settings</Typography>
		</Grid>
		<TableContainer>
			<Table className={classes.table} aria-label="simple table">
				<TableBody>
					<StyledTableRow>
						<TableCell/>
						<TableCell align="center">SMS</TableCell>
						<TableCell align="center">Email</TableCell>
						<TableCell/>
					</StyledTableRow>
					{notificationRows.map((row) => (
						<StyledTableRow key={row.name}>
							<TableCell component="th" scope="row" className={classes.settingCol}>
								<Typography
									style={{"fontSize": "14px", fontWeight: "bold"}}
									display="block"
								>
									{row.name}
								</Typography>
								<span>{row.description}</span>
							</TableCell>
							<TableCell align="center">
								<Checkbox
									checked={row.sms}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>
							</TableCell>
							<TableCell align="center">
								<Checkbox
									checked={row.email}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>
							</TableCell>
							<TableCell/>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
		<Grid container style={{backgroundColor: "#F5F5F5", padding: "1%", marginTop: "2%"}}>
			<Typography style={{color: omouBlue, fontWeight: 600}}>Opt-in SMS Notifications</Typography>
		</Grid>
		<TableContainer>
			<Table className={classes.table} aria-label="simple table">
				<TableBody>
					{optInNotifRows.map((row) => (
						<StyledTableRow key={row.name}>
							<TableCell component="th" scope="row" className={classes.settingCol}>
								<Typography
									style={{"fontSize": "14px", fontWeight: "bold"}}
									display="block"
								>
									{row.name}
								</Typography>
								<span>{row.description}</span>
							</TableCell>
							<TableCell align="center" style={{width: "28%"}}>
								<Switch
									checked={row.optIn}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>
							</TableCell>
							<TableCell/>
						</StyledTableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	</>)
}