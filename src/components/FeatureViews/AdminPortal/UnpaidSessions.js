import React, { useMemo } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import Loading from "components/Loading";
import * as adminActions from "../../../actions/adminActions";
import { useEffect } from 'react';
import UnpaidSessionCard from './UnpaidSessionCard';
import * as hooks from 'actions/hooks';

function UnpaidSessions() {

    const UnpaidList = useSelector(({Admin}) => Admin.Unpaid) || [];
    const studentList = useMemo(()=>  UnpaidList.map(({student})=>student), [UnpaidList]);
    const courseList = useMemo(()=> UnpaidList.map(({course})=>course), [UnpaidList]);

    const studentStatus = hooks.useStudent(studentList);
    const courseStatus = hooks.useCourse(courseList);

    const useUnpaidSessionStatus = hooks.useUnpaidSessions();

    if (hooks.isLoading(studentStatus, courseStatus, useUnpaidSessionStatus)){
        return <Loading/>
    }

    if(UnpaidList.length === 0) {
        return <>No unpaid sessions to display</>
    } else {

    return UnpaidList.map(unpaidStudent=>(
            <UnpaidSessionCard unpaidStudent={unpaidStudent}/>
    ))}
}

export default UnpaidSessions