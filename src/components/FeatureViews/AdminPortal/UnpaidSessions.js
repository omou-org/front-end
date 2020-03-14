import React, {useMemo} from 'react';
import {useSelector} from "react-redux";
import Loading from "components/Loading";
import UnpaidSessionCard from './UnpaidSessionCard';
import * as hooks from 'actions/hooks';
import Typography from "@material-ui/core/Typography";

function UnpaidSessions() {

    const UnpaidList = useSelector(({Admin}) => Admin.Unpaid) || [];
    const studentList = useMemo(()=>  UnpaidList.map(({student})=>student), [UnpaidList]);
    const courseList = useMemo(()=> UnpaidList.map(({course})=>course), [UnpaidList]);

    const studentStatus = hooks.useStudent(studentList);
    const courseStatus = hooks.useCourse(courseList);
    const unpaidSessionStatus = hooks.useUnpaidSessions();

    if(hooks.isSuccessful(unpaidSessionStatus) && UnpaidList.length === 0) {
        return <Typography>
            No unpaid sessions to display
        </Typography>
    }

    if (hooks.isLoading(studentStatus, courseStatus, unpaidSessionStatus)){
        return <Loading/>
    }

    return UnpaidList.map(unpaidStudent=>(
            <UnpaidSessionCard unpaidStudent={unpaidStudent}/>
    ))
}

export default UnpaidSessions