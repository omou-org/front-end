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
import gql from "graphql-tag";
import {useMutation} from "@apollo/react-hooks";

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

const CREATE_PARENT_NOTIFICATION_SETTINGS = gql`mutation createParentNotificationSetting($parent:ID!, $paymentReminderEmail:Boolean, 
  $paymentReminderSms:Boolean, $scheduleUpdatesSms:Boolean, $sessionReminderEmail:Boolean,
  $sessionReminderSms:Boolean, $courseRequestSms:Boolean) {
  __typename
  createParentNotificationSetting(parent: $parent, paymentReminderEmail: $paymentReminderEmail, 
    paymentReminderSms: $paymentReminderSms, scheduleUpdatesSms: $scheduleUpdatesSms, sessionReminderEmail: $sessionReminderEmail, 
    sessionReminderSms: $sessionReminderSms, courseRequestsSms: $courseRequestSms) {
    settings {
      courseRequestsSms
      paymentReminderEmail
      paymentReminderSms
      scheduleUpdatesSms
      sessionReminderEmail
      sessionReminderSms
    }
  }
}
`;

const createNotificationSetting = (name, description, email, sms) =>
	({name, description, email, sms, optional: false});

const createOptInSetting = (name, description, optIn) =>
	({name, description, optIn, optional: true});

export default function NotificationSettings({user}) {
	const classes = useStyles();
	const [notificationRows, setNotificationRows] = useState([]);
	const [optInNotifRows, setOptInNotifRows] = useState([]);
	const [createParentNotification, createParentNotificationResults] = useMutation(CREATE_PARENT_NOTIFICATION_SETTINGS);

	useEffect(() => {
		setNotificationRows([
			createNotificationSetting("Session Reminder",
				"Get notified when a session is coming up.",
				{settingName: "sessionReminderEmail", checked: false,},
				{settingName: "sessionReminderSms", checked: false,}),
			createNotificationSetting("Payment Reminder",
				"Get notified when a payment is coming up.",
				{settingName: "paymentReminderEmail", checked: false,},
				{settingName: "paymentReminderSms", checked: false,}),
		]);
		setOptInNotifRows([
			createOptInSetting("SMS Schedule Updates", "Get notified for schedule changes by SMS",
				{settingName: "scheduleUpdatesSms", checked: false,}),
			createOptInSetting("SMS Course Requests", "Get notified for cancellations by SMS",
				{settingName: "courseRequestsSms", checked: false,}),
		]);
	}, [setNotificationRows, setOptInNotifRows, createNotificationSetting, createOptInSetting]);

	const handleSettingChange = (setting, setFunction, index) => (_) => {
		let notificationSettings = {};
		setFunction((prevState) => {
			let newState = JSON.parse(JSON.stringify(prevState));
			newState[index] = {
				...newState[index],
				[setting]: {
					...newState[index][setting],
					checked: !newState[index][setting].checked
				},
			};
			notificationRows.forEach(({email, sms}) => {
				notificationSettings[email.settingName] = email.checked;
				notificationSettings[sms.settingName] = sms.checked;
			});
			optInNotifRows.forEach(({optIn}) => {
				notificationSettings[optIn.settingName] = optIn.checked;
			});
			const updatedSettingName = prevState[index][setting].settingName;
			notificationSettings[updatedSettingName] = !!newState[index][setting].checked
			return newState;
		});

		if (user.role.toLowerCase() === "parent") {
			notificationSettings.parent = user.user_id;
			createParentNotification({variables: notificationSettings});
		}
	};

	return (<>
		<Grid container style={{backgroundColor: "#F5F5F5", padding: "1%", marginTop: "30px"}}>
			<Typography style={{color: omouBlue, fontWeight: 600}}>Notification Settings</Typography>
		</Grid>
		<TableContainer>
			<Table className={classes.table} aria-label="simple table">
				<TableBody>
					<StyledTableRow>
						<TableCell/>
						<TableCell align="center">Text Message</TableCell>
						<TableCell align="center">Email</TableCell>
						<TableCell/>
					</StyledTableRow>
					{notificationRows.map((row, index) => (
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
									checked={row.sms.checked}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
									onChange={handleSettingChange("sms", setNotificationRows, index)}
								/>
							</TableCell>
							<TableCell align="center">
								<Checkbox
									checked={row.email.checked}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
									onChange={handleSettingChange("email", setNotificationRows, index)}
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
					{optInNotifRows.map((row, index) => (
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
									checked={row.optIn.checked}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
									onChange={handleSettingChange("optIn", setOptInNotifRows, index)}
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