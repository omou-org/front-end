import React, { useMemo } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import Loading from "components/Loading";
import * as adminActions from "../../../actions/adminActions";
import { useEffect } from 'react';
import UnpaidSessionCard from './UnpaidSessionCard';

function UnpaidSessions () {
    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(adminActions, dispatch),
        [dispatch]
    );

    const UnpaidList = useSelector(({Admin}) => Admin.Unpaid.students);

    useEffect(()=>{
        api.fetchUnpaid();
    },[]);

    if (!UnpaidList){
        return <Loading/>
    }

    return UnpaidList.map(unpaidStudent=>(
            <UnpaidSessionCard unpaidStudent={unpaidStudent}/>
        ))
}

export default UnpaidSessions;