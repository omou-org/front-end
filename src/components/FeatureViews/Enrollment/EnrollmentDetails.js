import React from "react";
import Grid from "@material-ui/core/Grid";
import AddSessions from "../../OmouComponents/AddSessions";
import UnenrollButton from "./UnenrollButton";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import {fullName} from "../../../utils";

export default function EnrollmentDetails({enrollment}) {
	const {
		course,
		student,
		enrollmentBalance
	} = enrollment;

	return (<Grid item md={12}>
		<Grid
			alignItems='center'
			className='session-actions'
			container
			direction='row'
			justify='flex-start'
			spacing={2}
		>
			<Grid item>
				<AddSessions
					componentOption='button'
					enrollment={enrollment}
					parentOfCurrentStudent={student.parent}
				/>
			</Grid>
			<Grid item>
				<UnenrollButton enrollment={enrollment}/>
			</Grid>
		</Grid>
		<Grid className='participants' item xs={12}>
			<Typography align='left'>
				Student:{' '}
				<Link to={`/accounts/student/${student.user.id}`}>
					{fullName(student.user)}
				</Link>
			</Typography>
			<Typography align='left'>
				Instructor:{' '}
				<Link
					to={`/accounts/instructor/${course.instructor_id}`}
				>
					{fullName(course.instructor.user)}
				</Link>
			</Typography>
			<Typography align='left'>
				Enrollment Balance Left: ${enrollmentBalance}
			</Typography>
		</Grid>
	</Grid>)
}