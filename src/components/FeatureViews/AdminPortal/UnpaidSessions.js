import React, {useMemo} from "react";
import {useSelector} from "react-redux";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import HappyIcon from "@material-ui/icons/SentimentVerySatisfied";
import Typography from "@material-ui/core/Typography";
import * as hooks from "actions/hooks";
import Loading from "components/Loading";
import UnpaidSessionCard from "./UnpaidSessionCard";
import "./AdminPortal.scss";

const UnpaidSessions = () => {

	const UnpaidList = useSelector(({Admin}) => Admin.Unpaid) || [];
	const studentList = useMemo(() => UnpaidList.map(({student}) => student), [
		UnpaidList,
	]);
	const courseList = useMemo(() => UnpaidList.map(({course}) => course), [
		UnpaidList,
	]);

	const studentStatus = hooks.useStudent(studentList);
	const courseStatus = hooks.useCourse(courseList);
	const unpaidSessionStatus = hooks.useUnpaidSessions();

	if (hooks.isLoading(studentStatus, courseStatus, unpaidSessionStatus) && (courseStatus !== null && studentStatus !== null)) {
		return <Loading loadingText="UNPAID SESSIONS LOADING" small/>;
	}

	if (UnpaidList.length === 0) {
		return (
			<Card className="no-unpaid-sessions">
				<CardContent>
					<Typography variant="h5">No unpaid sessions to display!</Typography>
					<HappyIcon fontSize="large"/>
				</CardContent>
			</Card>
		);
	}

	return UnpaidList.map((unpaidStudent) => (
		<UnpaidSessionCard key={unpaidStudent} unpaidStudent={unpaidStudent}/>
	));
};

export default UnpaidSessions;
