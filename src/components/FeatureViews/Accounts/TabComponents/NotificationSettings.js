import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.action.hover,
		},
	},
}))(TableRow);

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const createNotificationSetting = (name, description, email, sms, isSwitch) =>
	({name, description, email, sms, isSwitch});

const rows = [
	createNotificationSetting("Session Reminder", "Get notified when a session is coming up.", true, false, false),
	createNotificationSetting("Payment Reminder", "Get notificed when a payment is coming up.", true, true, false),
	createNotificationSetting("Schedule Change", "Get notified when a schedule changes", false, false, true),
	createNotificationSetting("Cancellation", "Get notified for cancellations.", true, false, true)
];

export default function NotificationSettings() {
	const classes = useStyles();

	return (<TableContainer component={Paper}>
		<Table className={classes.table} aria-label="simple table">
			<TableHead>
				<TableRow>
					<TableCell/>
					<TableCell align="center">Email</TableCell>
					<TableCell align="center">SMS</TableCell>
					<TableCell/>
				</TableRow>
			</TableHead>
			<TableBody>
				{rows.map((row) => (
					<StyledTableRow key={row.name}>
						<TableCell component="th" scope="row">
							<Typography
								style={{"fontSize": "20px", fontWeight: "bold"}}
								display="block"
							>
								{row.name}
							</Typography>
							<span>{row.description}</span>
						</TableCell>
						<TableCell align="center">
							{row.isSwitch ?
								<Switch
									checked={row.email}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>
								: <Checkbox
									checked={row.email}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>}

						</TableCell>
						<TableCell align="center">
							{row.isSwitch ?
								<Switch
									checked={row.sms}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>
								: <Checkbox
									checked={row.sms}
									color="primary"
									inputProps={{'aria-label': 'primary checkbox'}}
								/>}
						</TableCell>
						<TableCell/>
					</StyledTableRow>
				))}
			</TableBody>
		</Table>
	</TableContainer>)
}