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



class DashboardMainPanel extends Component {

    render() {
        return (<div className="DashboardMainPanel">
                <Card>
                    <CardActionArea>
                        <CardMedia>
                        </CardMedia>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {this.props.cName}
                            </Typography>
                            <Typography gutterBottom variant="h6" comh6onents="h6">
                                {this.props.time}
                                <br></br>
                                {this.props.location}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    </CardActions>
                </Card>
        </div>)
    }
}

export default DashboardMainPanel;