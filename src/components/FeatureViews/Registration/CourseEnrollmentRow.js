import React, {useCallback, useState} from "react";
import TableCell from "@material-ui/core/TableCell";
import {Link} from "react-router-dom";
import {fullName} from "../../../utils";
import {addDashes} from "../Accounts/accountUtils";
import IconButton from "@material-ui/core/IconButton";
import EmailIcon from "@material-ui/icons/Email";
import MobileMenu from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TableRow from "@material-ui/core/TableRow";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";

export default function CourseEnrollmentRow({enrollment: {id, student, course}, deleteEnrollment, testingIndex}) {

	const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
	const [unenroll, setUnenroll] = useState(false);

	// TODO: need to update when Session queries are live
	// const sessionStatus = useSessions("month", 0)
	// const currentMonthSessions = sessionArray(sessions);
	// const upcomingSess = upcomingSession(currentMonthSessions || [], courseID);

	const handleClick = useCallback(({currentTarget}) => {
		setStudentMenuAnchorEl(currentTarget);
	}, []);

	const handleClose = useCallback(() => {
		setStudentMenuAnchorEl(null);
	}, []);

	const closeUnenrollDialog = useCallback(
		(toUnenroll) => () => {
			if (toUnenroll) {
				// make call to delete unenrollment
				deleteEnrollment({variables: {enrollmentId: id}});
			}
			setUnenroll(false);
			setStudentMenuAnchorEl(null);
		},
		[]
	);

	return (<>
		<TableRow key={id} data-cy={`enrollment-${testingIndex}`}>
			<TableCell className="bold">
				<Link className="no-underline"
					  to={`/accounts/student/${student.user.id}`}>
					{fullName(student.user)}
				</Link>
			</TableCell>
			<TableCell>
				<Link className="no-underline"
					  to={`/accounts/parent/${student.primaryParent.user.id}`}>
					{fullName(student.primaryParent.user)}
				</Link>
			</TableCell>
			<TableCell>
				{addDashes(student.primaryParent.phoneNumber)}
			</TableCell>
			<TableCell>
				<div style={{"width": "40px"}}>
					{/*<SessionPaymentStatusChip className="session-status-chip"*/}
					{/*    enrollment={enrollment}*/}
					{/*    session={upcomingSess} />*/}
				</div>
			</TableCell>
			<TableCell>
				<div className="actions">
					<IconButton component={Link}
								to={`mailto:${student.primaryParent.user.email}`}>
						<EmailIcon/>
					</IconButton>
					<IconButton aria-controls="simple-menu"
								aria-haspopup="true"
								onClick={handleClick}>
						<MobileMenu/>
					</IconButton>
					<Menu anchorEl={studentMenuAnchorEl}
						  id="simple-menu"
						  keepMounted
						  onClose={handleClose}
						  open={studentMenuAnchorEl !== null}>
						<MenuItem component={Link}
								  onClick={handleClose}
								  to={{pathname: `/accounts/student/${student.user.id}/${course.id}`}}>
							View Enrollment
						</MenuItem>
						<MenuItem onClick={() => setUnenroll(true)}>
							Unenroll
						</MenuItem>
					</Menu>
				</div>
			</TableCell>
		</TableRow>
		<Dialog aria-describedby="unenroll-dialog-description"
				aria-labelledby="unenroll-dialog-title"
				className="session-view-modal"
				fullWidth
				maxWidth="xs"
				onClose={closeUnenrollDialog(false)}
				open={unenroll}>
			<DialogTitle id="unenroll-dialog-title">
				Unenroll in {course.title}
			</DialogTitle>
			<Divider/>
			<DialogContent>
				<DialogContentText>
					You are about to unenroll in <b>{course.title}</b> for{" "}
					<b>
						{fullName(student.user)}
					</b>
					. Performing this action will credit the remaining enrollment
					balance back to <b>{fullName(student.primaryParent.user)}'s</b> account balance. Are you sure you
					want
					to unenroll?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button
					variant="outlined"
					color="secondary"
					onClick={closeUnenrollDialog(true)}
				>
					Yes, unenroll
				</Button>
				<Button
					variant="outlined"
					color="primary"
					onClick={closeUnenrollDialog(false)}
				>
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	</>)
}