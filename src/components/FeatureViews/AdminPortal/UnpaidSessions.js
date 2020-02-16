import { connect } from 'react-redux';
import React, { Component } from 'react';

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

class UnpaidSessions extends Component {
    render() {

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
            "alignSelf": "center"
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
                                    style={styles(this.props.fName + " " + this.props.lName)}
                                    >
                                        {initials(this.props.fName, this.props.lName)}
                                </Avatar>
                            </Grid>
                        </CardMedia>
                        <CardContent>
                        <Typography style ={{fontSize: "16px", fontWeight: 500, lineHeight: "24px"}}>
                            {this.props.fName + " " + this.props.lName}
                        </Typography>
                        <Typography style={roleStyle(this.props.role)} >
                            {parseRole(this.props.role)}
                        </Typography>
                        <Typography >
                            {this.props.status}
                            <br></br>
                            {this.props.amt}
                            <br></br>
                            {this.props.course}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    </CardActions>
                </Card>
        </div>)
    }
}

export default UnpaidSessions;