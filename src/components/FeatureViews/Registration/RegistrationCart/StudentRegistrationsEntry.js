import React, {useContext} from "react";
import Grid from "@material-ui/core/Grid";
import {fullName, getTuitionAmount} from "../../../../utils";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Moment from "react-moment";
import moment from "moment";
import {RegistrationContext} from "./RegistrationContext";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "./RegistrationCart.scss";
import IconButton from "@material-ui/core/IconButton";
import {useValidateRegisteringParent} from "../../../OmouComponents/RegistrationUtils";

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

const separator = () => {
	return (<Typography style={{ display: "inline", paddingLeft: 30, paddingRight: 30 }}>|</Typography>)
}

function RegistrationEntry({ registration: { course, numSessions, checked }, studentId }) {
	const {parentIsLoggedIn} = useValidateRegisteringParent();
	const {updateSession} = useContext(RegistrationContext);

	const handleSessionChange = (e) => {
		updateSession(Number(e.target.value), checked, studentId, course.id);
	};

	const handleSessionCheckChange = (_) => {
		updateSession(numSessions, !checked, studentId, course.id);
	};

	return (<>
		<TableRow >
			<TableCell>
				<IconButton onClick={handleSessionCheckChange}>
					<CloseIcon/>
				</IconButton>
			</TableCell>
			<TableCell style={{maxWidth: 750}}>
				<Grid container>
					<Grid>
						<Typography style={{fontWeight: 600, paddingRight: 50}}>#{course.id} {course.title} -
							Instructor: {course.instructor.user.firstName} {course.instructor.user.lastName}</Typography>
					</Grid>
				</Grid>
				<br/>
				<Grid container>
					<Typography style={{whiteSpace: "nowrap", textTransform: "capitalize"}}>
						{course.courseCategory.name}
						{separator()}
						{course.academicLevelPretty}
						{separator()}
						{moment(course.startDate, ["YYYY-MM-DD"]).format("ddd")} {moment(course.startTime, ["HH.mm"]).format("h:mm A")} - {moment(course.endTime, ["HH.mm"]).format("h:mm A")}
						{separator()}
						Start Date: <Moment date={course.startDate} format="M/DD/YYYY"/> - <Moment date={course.endDate}
																								   format="M/DD/YYYY"/>
					</Typography>
				</Grid>
				<br/>
			</TableCell>
			<TableCell style={{whiteSpace: "nowrap", verticalAlign: 'top'}}>
				{
					parentIsLoggedIn ? <Typography>
						{moment(course.endDate).diff(moment(course.startDate), "weeks") + 1}
					</Typography> : <TextField
						value={numSessions}
						onChange={handleSessionChange}
						variant="outlined"
						style={{width: "80%"}}
						inputProps={{
							style: {
								padding: 8,
								textAlign: "center"
							}
						}}
					/>
				}
			</TableCell>
			<TableCell style={{whiteSpace: "nowrap", verticalAlign: 'top'}}>
				$ {getTuitionAmount(course, numSessions)}
			</TableCell>
		</TableRow>
	</>)
}

export default function StudentRegistrationEntry({ student, registrationList }) {
	return (<Grid item xs={12} container>
		<Typography style={{fontWeight: 600}}>{fullName(student.user)}</Typography>
		<Table>
			<TableHead>
				<TableRow>
					<TableCell/>
					<TableCell>
						Descriptions
					</TableCell>
					<TableCell>
						Sessions
					</TableCell>
					<TableCell>
						Tuition
					</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				<br />
				{
					registrationList
						.filter(({checked}) => checked)
						.map(registration =>
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