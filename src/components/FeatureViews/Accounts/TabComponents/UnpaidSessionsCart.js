import React from "react";
import * as hooks from "actions/hooks";
import Loading from "../../../Loading";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";

export default function UnpaidSessionsCart({user}) {
	const unpaidSessionsStatus = hooks.useUnpaidSessions();
	// const unpaidSessionsList = useSelector(({Admin:{Unpaid}}) => Unpaid);
	const studentList = useSelector(({Users: {StudentList}}) => StudentList);
	const testUnpaidSessionsList = [{
		"id": 1,
		"student": 4,
		"course": 1,
		"payment_list": [{
			"id": 1,
			"parent": 3,
			"sub_total": "0.00",
			"price_adjustment": "0.00",
			"total": "0.00",
			"account_balance": "0.00",
			"discount_total": "0.00",
			"method": "cash",
			"registrations": [{
				"id": 1,
				"attendance_start_date": "2020-03-09T19:40:50.154744Z",
				"payment": 1,
				"enrollment": 1,
				"num_sessions": 2,
				"enrollment_details": {"student": 4, "course": 1},
				"updated_at": "2020-03-09T19:40:50.154744Z",
				"created_at": "2020-03-09T19:40:50.154744Z"
			}],
			"deductions": [],
			"updated_at": "2020-03-09T19:40:50.150755Z",
			"created_at": "2020-03-09T19:40:50.150755Z"
		}, {
			"id": 2,
			"parent": 3,
			"sub_total": "0.00",
			"price_adjustment": "0.00",
			"total": "0.00",
			"account_balance": "0.00",
			"discount_total": "0.00",
			"method": "cash",
			"registrations": [{
				"id": 2,
				"attendance_start_date": "2020-03-09T19:42:07.067951Z",
				"payment": 2,
				"enrollment": 1,
				"num_sessions": -1,
				"enrollment_details": {"student": 4, "course": 1},
				"updated_at": "2020-03-09T19:42:07.068949Z",
				"created_at": "2020-03-09T19:42:07.068949Z"
			}],
			"deductions": [],
			"updated_at": "2020-03-09T19:42:07.066953Z",
			"created_at": "2020-03-09T19:42:07.066953Z"
		}],
		"enrollment_balance": 0.0,
		"sessions_left": 0,
		"last_paid_session_datetime": "2020-03-09T20:00:00Z"
	}, {
		"id": 4,
		"student": 4,
		"course": 3,
		"payment_list": [{
			"id": 5,
			"parent": 4,
			"sub_total": "100.00",
			"price_adjustment": "0.00",
			"total": "0.00",
			"account_balance": "100.00",
			"discount_total": "0.00",
			"method": "cash",
			"registrations": [{
				"id": 5,
				"attendance_start_date": "2020-05-04T02:48:03.181460Z",
				"payment": 5,
				"enrollment": 4,
				"num_sessions": 2,
				"enrollment_details": {"student": 4, "course": 3},
				"updated_at": "2020-05-04T02:48:03.181460Z",
				"created_at": "2020-05-04T02:48:03.181460Z"
			}],
			"deductions": [],
			"updated_at": "2020-05-04T02:48:03.178468Z",
			"created_at": "2020-05-04T02:48:03.178468Z"
		}],
		"enrollment_balance": 0.0,
		"sessions_left": 0,
		"last_paid_session_datetime": "2020-05-11T03:00:00Z"
	}];

	if (hooks.isLoading(unpaidSessionsStatus)) {
		return <Loading small/>
	}

	const parentUnpaidSessions = testUnpaidSessionsList
		.filter((unpaidSession) => unpaidSession.payment_list[0].parent == user.user_id);

	console.log(user, parentUnpaidSessions, studentList);

	return (<div>
		<Grid container>
			<Grid item xs={12}>
				<Grid className="accounts-table-heading" container>
					<Grid item xs={4}>
						<Typography align="left" className="table-header">
							Student
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography align="left" className="table-header">
							Unpaid Sessions
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography align="left" className="table-header">
							Tuition
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid container direction="row-reverse" spacing={1}>
				{parentUnpaidSessions
					.map((unpaidSession) => {
						return (
							<Grid
								className="accounts-table-row"
								item
								xs={12}
							>
								<Paper elevation={2} square>
									<Grid container>
										<Grid item xs={4}>
											<Typography align="left">
												{studentList[unpaidSession.student].name}
											</Typography>
										</Grid>
										<Grid item xs={3}>
											<Typography align="left">
												test
											</Typography>
										</Grid>
										<Grid item xs={2}>
											<Typography align="left">
												asdfasdf
											</Typography>
										</Grid>
									</Grid>
								</Paper>
							</Grid>
						);
					})}
			</Grid>
		</Grid>

	</div>)
}