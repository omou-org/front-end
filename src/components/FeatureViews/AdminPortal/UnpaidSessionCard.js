import React, { Component, useMemo } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {stringToColor} from "../Accounts/accountUtils";
import {roleColor, initials, parseDate, capitalizeRoleName, statusColor} from "./AdminUtils";

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
        "backgroundColor": roleColor[role],
        "borderRadius": "50px",
        "color": "white",
        "height": 30,
        "margin": 10,
        "padding": 5,   
        "fontSize": 14,
        "alignSelf": "center",
        "textAlign": "center"
    })

    const cardStyle = {
        "height": 250,  
        "width": 220,
        "margin": '10px'
    }

    const statusStyle = (status) => ({
        "backgroundColor": statusColor[status],
        "color": "black",
        "height": 10,
        "width": 10,
        "lineHeight": 1,
        "margin": "auto",
        "padding": 10,
        "borderRadius": "50%",
    })

    const UnpaidSessionCard = (unpaid) => {
        return(
        <Card style = {cardStyle}> 
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
                            {capitalizeRoleName(unpaid.status)}
                        </Typography>
                        <Typography style={{textAlign: "center"}}>
                            Payment Status: 
                            <span style={statusStyle(unpaid.paymentStatus)}>{unpaid.paymentStatus}</span>
                            <br/>
                            {unpaid.amt}
                            <br/>
                            {unpaid.course}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
        )
    }

export default UnpaidSessionCard;