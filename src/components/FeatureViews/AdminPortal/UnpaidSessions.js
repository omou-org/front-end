import { connect } from 'react-redux';
import React, { Component, useMemo } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as hooks from "actions/hooks";
import Loading from "components/Loading";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import {stringToColor} from "../Accounts/accountUtils";
import {roleColor, initials, parseDate, parseRole, statusColor} from "./AdminUtils";
import {GET} from "../../../actions/actionTypes";
import {REQUEST_STARTED} from "../../../actions/apiActions";
import * as adminActions from "../../../actions/adminActions";
import initialState from '../../../reducers/initialState';
import { useEffect } from 'react';

function UnpaidSessions () {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );

    const UnpaidList = useSelector(state => state.Admin.students);

    useEffect(()=>{
        api.fetchUnpaid();
    },[]);

    const styles = (username) => ({
        "backgroundColor": stringToColor(username),
        "color": "white",
        "margin": 9,
        "width": 47,
        "height": 47,
        "fontSize": 20,
        "alignSelf": "center",
        "fontFamily": "Roboto"
    });

    const roleStyle = (role) => ({
        "backgroundColor": roleColor(role),
        "borderRadius": "50px",
        "color": "white",
        "height": 30,
        "margin": 10,
        "padding": 5,   
        "fontSize": 14,
        "alignSelf": "center",
        "textAlign": "center"
    })

    const cardStyle = ()=> ({
        "height": 250,  
        "width": 220,
        "margin": '10px'
    })

    const statusStyle = (status) => ({
        "backgroundColor": statusColor(status),
        "color": "black",
        "height": 10,
        "width": 10,
        "lineHeight": 1,
        // "lineHeight": "auto", 
        "margin": "auto",
        "padding": 10,
        "borderRadius": "50%",
        // "alignContent": "center"

    })

const checkUnpaid = (x) => {
    if (!x){
        return <Loading/>
    }

    else {
        console.log('x exists')

        return x.map(up=>(
            displayUnpaid(up)
        ))
        
    }
}

const displayUnpaid = (unpaid) => {
    console.log(unpaid)
    return(
    <Card style = {cardStyle()}> 
                <CardActionArea>
                    <CardMedia>
                        <Grid container style={{justifyContent:"center"}}>
                            <Avatar   
                                    style={styles(unpaid.fName + " " + unpaid.lName)}
                                    >
                                        {initials(unpaid.fName, unpaid.lName)}
                            </Avatar>
                        </Grid>
                    </CardMedia>
                    <CardContent>
                    <Typography style ={{fontSize: "16px", fontWeight: 500, lineHeight: "24px", textAlign: "center"}}>
                        {unpaid.fName + " " + unpaid.lName}
                    </Typography>
                    <Typography style={roleStyle(unpaid.status)} >
                        {parseRole(unpaid.status)}
                    </Typography>
                    <Typography style={{textAlign: "center"}}>
                        Payment Status: <span style={statusStyle(unpaid.paymentStatus)}>{unpaid.paymentStatus}</span>
                        <br></br>
                        {unpaid.amt}
                        <br></br>
                        {unpaid.course}
                    </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
    )
}

return (
    <div>
        {checkUnpaid(UnpaidList)}
    </div>
)
    
}

export default UnpaidSessions;