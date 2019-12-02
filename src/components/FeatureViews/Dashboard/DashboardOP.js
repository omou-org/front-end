import { connect } from 'react-redux';
import React, { Component } from 'react';
import './Dashboard.scss'

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


class DashboardOP extends Component {
    render() {

        const styles = (username) => ({
            "backgroundColor": stringToColor(username),
            "color": "white",
            "margin": 9,
            "width": 38,
            "height": 38,
            "fontSize": 14,
        });

        const roleStyle = (role) => ({
            "backgroundColor": stringToColor(role),
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
            "width": 200
        })

        return (<div className="`DashboardOP`">
            <Grid container spacing={16} className="Root">
                <Card style = {cardStyle()}> 
                    <CardActionArea>
                        <CardMedia>
                            <Avatar style={styles(this.props.fName+ this.props.lName)}>
                            {(this.props.fName).charAt(0) + (this.props.lName).charAt(0)}
                            </Avatar>
                        </CardMedia>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.fName + " " + this.props.lName}
                            </Typography>
                            <Typography gutterBottom variant="p" component='p' style={roleStyle(this.props.role)}>
                                {this.props.role}
                                </Typography>
                            <Typography gutterBottom variant="p" component="p">
                                <br></br>
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
            </Grid>
        </div>)
    }
}

export default DashboardOP;