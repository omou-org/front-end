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

    hooks.useUnpaidSessions();
   
    if (!UnpaidList || hooks.isLoading(studentStatus, courseStatus)){
        return <Loading/>
    }

    return UnpaidList.map(unpaidStudent=>(
            <UnpaidSessionCard unpaidStudent={unpaidStudent}/>
        ))
}

export default UnpaidSessions