import { connect } from 'react-redux';
import React, { Component, useMemo } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

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
import {roleColor, initials, parseDate, parseRole} from "./AdminUtils";
import {GET} from "../../../actions/actionTypes";
import {REQUEST_STARTED} from "../../../actions/apiActions";
import * as adminActions from "../../../actions/adminActions";
import initialState from '../../../reducers/initialState';
import { useEffect } from 'react';



const UnpaidSessions = () => {
    const dispatch = useDispatch();
    const api = useMemo (
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    const unpaid= useSelector(({"Admin":{Unpaid}}) => 
        Unpaid.students);

    useEffect(()=>{
        api.fetchUnpaid();
    },[api]);


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


        return (<div className="`DashboardOP`">
                <Card style = {cardStyle()}> 
                    <CardActionArea>
                        <CardMedia>
                            <Grid container style={{justifyContent:"center"}}>
                            <Avatar alignItems="center"  
                                    style = {styles("G G")}                      
                                    // style={styles(this.props.fName + " " + this.props.lName)}
                                    >
                                        {initials("G", "G")}
                                        {/* {initials(this.props.fName, this.props.lName)} */}
                                </Avatar>
                            </Grid>
                        </CardMedia>
                        <CardContent>
                        <Typography style ={{fontSize: "16px", fontWeight: 500, lineHeight: "24px", textAlign: "center"}}>
                            Greg Glinoga
                            {/* {this.props.fName + " " + this.props.lName} */}
                        </Typography>
                        <Typography style={roleStyle("student")} >
                            {parseRole("student")}
                        </Typography>
                        <Typography style={{textAlign: "center"}}>
                            {/* {this.props.status} */}
                            <br></br>
                            $50
                            {/* {this.props.amt} */}
                            <br></br>
                            AP Calculus
                            {/* {this.props.course} */}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    </CardActions>
                </Card>
        </div>)
    
}

export default UnpaidSessions;