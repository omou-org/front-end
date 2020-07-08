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
import {RegistrationContext} from "./RegistrationContext";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

function RegistrationEntry({registration: {course, numSessions, checked}, studentId}) {
	const {updateSession} = useContext(RegistrationContext);

	const handleSessionChange = (e) => {
		updateSession(Number(e.target.value), checked, studentId, course.id);
	};

	const handleSessionCheckChange = (_) => {
		updateSession(numSessions, !checked, studentId, course.id);
	};

	return (<TableRow>
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
			<Moment date={course.startDate} format="MM/DD/YYYY"/> - <Moment date={course.endDate}/>
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
	</TableRow>)
}

export default function StudentRegistrationEntry({student, registrationList}) {
	return (<Grid item xs={12} container>
		<Typography>{fullName(student.user)}</Typography>
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