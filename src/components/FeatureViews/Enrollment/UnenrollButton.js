import React, {useCallback, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {fullName} from "../../../utils";
import DialogActions from "@material-ui/core/DialogActions";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";
import Dialog from "@material-ui/core/Dialog";

export default function UnenrollButton({enrollment}) {
	const {
		course,
		student,
		enrollmentBalance
	} = enrollment;

	const [unenrollWarningOpen, setUnenrollWarningOpen] = useState(false);

	const openUnenrollDialog = useCallback(() => {
		setUnenrollWarningOpen(true);
	}, []);

	const closeUnenrollDialog = useCallback(
		(toUnenroll) => () => {
			setUnenrollWarningOpen(false);
			//TODO: migrate unenroll to graph ql
			// if (toUnenroll) {
			//     deleteEnrollment(enrollment)(dispatch);
			//     goToRoute(`/accounts/student/${studentID}`);
			// }
		}
		// [dispatch, enrollment, goToRoute, studentID]
	);

	return (<>
		<ResponsiveButton
			className='button unenroll'
			onClick={openUnenrollDialog}
		>
			Unenroll Course
		</ResponsiveButton>
		<Dialog
			aria-labelledby='warn-unenroll'
			onClose={closeUnenrollDialog(false)}
			open={unenrollWarningOpen}
		>
			<DialogTitle disableTypography id='warn-unenroll'>
				Unenroll in {course.title}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You are about to unenroll in <b>{course.title}</b> for{' '}
					<b>{fullName(student.user)}</b>. Performing this action
					will credit <b>${enrollmentBalance}</b> back to the
					parent's account balance. Are you sure you want to
					unenroll?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<ResponsiveButton
					variant='outlined'
					color='secondary'
					onClick={closeUnenrollDialog(true)}
				>
					Yes, unenroll
				</ResponsiveButton>
				<ResponsiveButton
					variant='outlined'
					color='primary'
					onClick={closeUnenrollDialog(false)}
				>
					Cancel
				</ResponsiveButton>
			</DialogActions>
		</Dialog>
	</>)
}