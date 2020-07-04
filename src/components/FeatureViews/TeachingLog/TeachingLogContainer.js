import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import gql from "graphql-tag"
import {useLazyQuery} from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import Grid from "@material-ui/core/Grid";
import {fullName} from "../../../utils";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TeachingLogEntry from "./TeachingLogEntry";

const GET_INSTRUCTOR_SESSIONS = gql`query GetInstructorSessions($instructorId: ID!, $timeFrame: String!, $timeShift:Int!) {
  __typename
  sessions(instructorId: $instructorId, timeFrame: $timeFrame, timeShift: $timeShift) {
    id
    title
    endDatetime
    startDatetime
    instructor {
      user {
        id
        lastName
        firstName
      }
    }
    course {
      enrollmentSet {
        student {
          user {
            lastName
            firstName
          }
        }
      }
      endDate
      startDate
    }
  }
}`;

export default function TeachingLogContainer() {
	const AuthUser = useSelector(({auth}) => auth);
	const [getSessions, {loading, data}] = useLazyQuery(GET_INSTRUCTOR_SESSIONS);

	useEffect(() => {
		getSessions({
			variables: {
				instructorId: 7,
				timeFrame: "month",
				timeShift: -1,
			}
		});
	}, []);

	if (loading || !data) return <Loading/>;

	const {sessions} = data;

	console.log(sessions);

	return (<BackgroundPaper>
		<Grid container>
			<Grid item container>
				<Grid item>
					<Typography>{fullName(AuthUser.user)}</Typography>
					<Typography>{AuthUser.user.id}</Typography>
					<Typography>{AuthUser.user.email}</Typography>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Session ID</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Session Title</TableCell>
								<TableCell>Time</TableCell>
								<TableCell>Total (hours)</TableCell>
								<TableCell/>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								sessions.map((session) => (<TeachingLogEntry key={session.id} session={session}/>))
							}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
		</Grid>
	</BackgroundPaper>)
}