import { connect } from 'react-redux';
import React, { Component, useMemo } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as hooks from "actions/hooks";
import Loading from "components/Loading";
import * as adminActions from "../../../actions/adminActions";
import initialState from '../../../reducers/initialState';
import { useEffect } from 'react';
import DisplayUnpaid from './DisplayUnpaid';

function UnpaidSessions () {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );


    const UnpaidList = useSelector(({Admin}) => Admin.Unpaid.students);

    useEffect(()=>{
        api.fetchUnpaid();
    },[]);

const checkUnpaid = (x) => {
    if (!x){
        return <Loading/>
    }

    else {
        console.log('x exists')
        return x.map(up=>(
            DisplayUnpaid(up)
        ))
        
    }
}


return (
    <div>
        {checkUnpaid(UnpaidList)}
    </div>
)
    
}

export default UnpaidSessions;