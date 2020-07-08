import React, {useContext, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {fullName, getTuitionAmount} from "../../../../utils";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Moment from "react-moment";
import {RegistrationContext} from "./RegistrationContext";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

function RegistrationEntry({registration: {course, numSessions, checked}, studentId}) {
	const {updateSession} = useContext(RegistrationContext);
	const [open, setOpen] = useState(false);
	const classes = useRowStyles();

	const handleSessionChange = (e) => {
		updateSession(Number(e.target.value), checked, studentId, course.id);
	};

	const handleSessionCheckChange = (_) => {
		updateSession(numSessions, !checked, studentId, course.id);
	};

	return (<>
		<TableRow className={classes.root}>
			<TableCell>
				<Checkbox
					checked={checked}
					onChange={handleSessionCheckChange}
					inputProps={{'aria-label': 'primary checkbox'}}
					color="primary"
				/>
			</TableCell>
			<TableCell>
				{course.title}
			</TableCell>
			<TableCell>
				<Moment date={course.startDate} format="MM/DD/YYYY"/> - <Moment date={course.endDate}
																				format="MM/DD/YYYY"/>
			</TableCell>
			<TableCell>
				<TextField
					value={numSessions}
					onChange={handleSessionChange}
					variant="outlined"
					style={{width: "30%"}}
					inputProps={{
						style: {
							padding: 8,
							textAlign: "center"
						}
					}}
				/>
			</TableCell>
			<TableCell>
				$ {getTuitionAmount(course, numSessions)}
			</TableCell>
			<TableCell>
				<IconButton aria-label="expand teaching log" size="small" onClick={() => setOpen(!open)}>
					{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
				</IconButton>
			</TableCell>
		</TableRow>
		<TableRow>
			<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box margin={1}>
						<Typography>info</Typography>
					</Box>
				</Collapse>
			</TableCell>
		</TableRow>
	</>)
}

export default function StudentRegistrationEntry({student, registrationList}) {
	return (<Grid item xs={12} container>
		<Typography style={{fontWeight: 600}}>{fullName(student.user)}</Typography>
		<Table>
			<TableHead>
				<TableRow>
					<TableCell/>
					<TableCell>
						Course
					</TableCell>
					<TableCell>
						Dates
					</TableCell>
					<TableCell>
						Sessions
					</TableCell>
					<TableCell>
						Tuition
					</TableCell>
					<TableCell/>
				</TableRow>
			</TableHead>
			<TableBody>
				{
					registrationList.map(registration =>
						<RegistrationEntry
							key={registration.course.id}
							registration={registration}
							studentId={student.user.id}
						/>)
				}
			</TableBody>
		</Table>
	</Grid>)
}