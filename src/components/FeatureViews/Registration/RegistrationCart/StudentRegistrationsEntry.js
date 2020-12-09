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
import "./RegistrationCart.scss";
import IconButton from "@material-ui/core/IconButton";
import {useValidateRegisteringParent} from "../../../OmouComponents/RegistrationUtils";
import {useDispatch} from "react-redux";
import { DayAbbreviation } from "utils";
import * as types from "../../../../actions/actionTypes";
import NoListAlert from "../../../OmouComponents/NoListAlert";

const separator = () => {
	return (<Typography style={{display: "inline", paddingLeft: 30, paddingRight: 30}}>|</Typography>)
}

function RegistrationEntry({registration: {course, numSessions, checked}, studentId, index}) {
	const {parentIsLoggedIn} = useValidateRegisteringParent();
	const {updateSession} = useContext(RegistrationContext);
	const dispatch = useDispatch();

	const handleSessionChange = (e) => {
		updateSession(Number(e.target.value), checked, studentId, course.id);
	};

	const handleSessionCheckChange = (_) => {
		updateSession(numSessions, !checked, studentId, course.id);
		dispatch({
			type: types.DELETE_COURSE_REGISTRATION,
			payload: {
				studentId,
				courseId: course.id,
			}
		});
	};

	const sessionsAtSameTimeInMultiDayCourse = (availabilityList) => {
		let start = availabilityList[0].startTime;
		let end = availabilityList[0].endTime;
	  
		for (let availability of availabilityList) {
		  if (availability.startTime !== start || availability.endTime !== end) {
			return false;
		  }
		}
		return true;
	}

	const totalCourseSessions = moment(course.endDate).diff(moment(course.startDate), "weeks") + 1;
	return (<>
		<TableRow>
			<TableCell>
				<IconButton onClick={handleSessionCheckChange}>
					<CloseIcon/>
				</IconButton>
			</TableCell>
			<TableCell style={{maxWidth: 750}}>
				<Grid container>
					<Grid>
						<Typography style={{fontWeight: 600, paddingRight: 50}}>
							#{course.id} {course.title}{" - "}
							Instructor: {course.instructor.user.firstName} {course.instructor.user.lastName}
						</Typography>
					</Grid>
				</Grid>
				<br/>
				<Grid container>
					<Typography style={{whiteSpace: "nowrap", textTransform: "capitalize"}}>
						{course.courseCategory.name}
						{separator()}
						{course.academicLevelPretty}
						{separator()}
						{course.availabilityList.map(
                          ({ dayOfWeek }, index) => {
                            let isLastSessionOfWeek =
                              course.availabilityList.length - 1 ===
                              index;
                            return (
                              DayAbbreviation[dayOfWeek.toLowerCase()] +
                              (!isLastSessionOfWeek ? " / " : "")
                            );
                          }
                        )}
                        
                      {sessionsAtSameTimeInMultiDayCourse(course.availabilityList) ? ", " + course.availabilityList[0].startTime.slice(0, 5) + " - " + course.availabilityList[0].endTime.slice(0, 5) : 
                        "Various"
                      }
						{separator()}
						Start Date: <Moment date={course.startDate} format="M/DD/YYYY"/>{" - "}
						<Moment date={course.endDate} format="M/DD/YYYY"/>
					</Typography>
				</Grid>
				<br/>
			</TableCell>
			<TableCell style={{whiteSpace: "nowrap", verticalAlign: 'top'}}>
				{
					parentIsLoggedIn ? <Typography>
						{totalCourseSessions}
					</Typography> : <TextField
						data-cy={`${index}-session-input`}
						value={numSessions}
						onChange={handleSessionChange}
						variant="outlined"
						style={{width: "80%"}}
						error={numSessions > totalCourseSessions}
						inputProps={{
							style: {
								padding: 8,
								textAlign: "center"
							},
							"data-cy": `${index}-session-input-inner`
						}}
					/>
				}
			</TableCell>
			<TableCell style={{whiteSpace: "nowrap", verticalAlign: 'top'}}>
				$ {getTuitionAmount(course, parentIsLoggedIn ? totalCourseSessions : numSessions)}
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
					registrationList.length > 0 ?
						registrationList
							.filter(({checked}) => checked)
							.map((registration, index) =>
								<RegistrationEntry
									index={index}
									key={registration.course.id}
									registration={registration}
									studentId={student.user.id}
								/>) :
						<NoListAlert list="registrations"/>
				}
			</TableBody>
		</Table>
	</Grid>)
}