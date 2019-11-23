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

class DashboardOP extends Component {
    render() {
        return (<div className="`DashboardOP`">
            <Grid container spacing={16} className="Root">
                <Card>
                    <CardActionArea>
                        <CardMedia>
                            <Avatar style={{alignSelf:'center'}}>
                            {(this.props.fName).charAt(0) + (this.props.lName).charAt(0)}
                            </Avatar>
                        </CardMedia>
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.fName + " " + this.props.lName}
                            </Typography>
                            <Typography gutterBottom variant="p" component='p'>
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