import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import Loading from "components/Loading";
import UnpaidSessionCard from './UnpaidSessionCard';
import * as hooks from 'actions/hooks';
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import HappyIcon from "@material-ui/icons/SentimentVerySatisfied";

function UnpaidSessions() {

    const UnpaidList = useSelector(({Admin}) => Admin.Unpaid) || [];
    const studentList = useMemo(()=>  UnpaidList.map(({student})=>student), [UnpaidList]);
    const courseList = useMemo(()=> UnpaidList.map(({course})=>course), [UnpaidList]);

    const studentStatus = hooks.useStudent(studentList);
    const courseStatus = hooks.useCourse(courseList);
    const unpaidSessionStatus = hooks.useUnpaidSessions();

    if(hooks.isSuccessful(unpaidSessionStatus) && UnpaidList.length === 0) {
        return <Card>
            <CardContent>
                <Typography variant="h5">
                    No unpaid sessions to display!
                </Typography>
                <HappyIcon fontSize="large"/>
            </CardContent>
        </Card>
    }

    if (hooks.isLoading(studentStatus, courseStatus, unpaidSessionStatus)){
        return <Loading small loadingText="UNPAID SESSIONS LOADING"/>
    }

    return UnpaidList.map(unpaidStudent=>(
            <UnpaidSessionCard key={unpaidStudent.student} unpaidStudent={unpaidStudent}/>
    ))
}

export default UnpaidSessions