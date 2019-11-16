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

class DashboardAccounts extends Component {
    render() {
        return (<div className="`DashboardAccounts`">
            <Grid container spacing={16} className="Root">
                <Card>
                    <CardActionArea>
                        <CardMedia>
                        </CardMedia>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                            {this.props.fName + " " + this.props.lName}
                            </Typography>
                            <Typography gutterBttom variant="p" component='p'>
                            </Typography>

                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button size="small" color="primary">
                            Share
                        </Button>
                        <Button size="small" color="primary">
                            Learn More
                        </Button>
                    </CardActions>
                </Card>
            </Grid>

        </div>)
    }
}

export default DashboardAccounts;