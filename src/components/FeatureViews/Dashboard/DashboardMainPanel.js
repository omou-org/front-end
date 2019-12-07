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
import Avatar from "@material-ui/core/Avatar";
import AccessTime from "@material-ui/icons/AccessTime";
import LocationOn from "@material-ui/icons/LocationOn";
import Person from '@material-ui/icons/Person';
import Face from "@material-ui/icons/Face";

class DashboardMainPanel extends Component {

    render() {

        const cardStyle = ()=> ({
            "height": 180,
            "width": 200,
            "textAlign": "center",
            "display": "inline-block"
        })

        return (<div className="DashboardMainPanel">
                <Card style={cardStyle()}>
                    <CardActionArea>
                        <CardMedia>
                        </CardMedia>
                        <CardContent>
                            <Grid container style={{textAlign:'left', fontStyleFamily:"Roboto"}}>
                                <Grid item xs={12}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {this.props.cName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <hr></hr>
                                </Grid>
                                <Grid item xs={4}>
                                    <AccessTime></AccessTime>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom variant="h8" components="h8">
                                        {this.props.time}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <LocationOn></LocationOn>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom variant="h8" components="h8">
                                        {this.props.location}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Person></Person>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom variant="h8" components="h8">
                                        Teacher name
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Face></Face>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography gutterBottom variant="h8" components="h8">
                                        18 Students
                                    </Typography>
                                </Grid>             
                                </Grid>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    </CardActions>
                </Card>
        </div>)
    }
}

export default DashboardMainPanel;