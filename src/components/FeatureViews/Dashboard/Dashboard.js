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
import DashboardMainPanel from './DashboardMainPanel';
import DashboardAccounts from './DashboardAccounts';
import DashboardOP from './DashboardOP';
import DashboardNotes from './DashboardNotes';


class Dashboard extends Component {

    state = {
        MainPanel: {
            Classes:[{
                cName: 'G7 Writing',
                time: '9a-10a',
                location: 'Room 7'
            },
            {
                cName: 'G10 Biology',
                time: '1p-2p',
                location: 'Room 10a'
            }
        ],
        Tutoring:[{
            sName: 'AP Calculus',
            time: '3p-4p'
        }
        ],
        Events:[{
            event: 'BYU Course Training',
            time: '1p-2p',
            room: 'Room 12b'
        },
        {
            event: 'BYU Course Training',
            time: '3p-4p',
            room: 'Room 2'
        }]
        },
        Accounts:[{
            fName: 'Ryan',
            lName: 'Liou',
            phone: '555-555-5555',
            email: 'ryanliou@email.com'
        },
        {
            fName: 'Daniel',
            lName: 'Huang',
            phone: '555-555-5555',
            email: 'dHuang@email.com'
        },
        {
            fName: 'Selina',
            lName: 'Che',
            phone: '555-555-5555',
            email: 'selinache@email.com'
        }
    ]
    }

    render() {
        return (<div className="`Dashboard`">
               <Paper className="`Paper`">
                    <Typography variant="h3" align="left">Hello Sharon!</Typography>
                    <br />
                    <Typography variant="h6" align="left">Summit Education</Typography>
                    <br/>
                    <Grid container spacing={16}>
                    {this.state.MainPanel.Classes.map(c=>(
                        <DashboardMainPanel
                        cName={c.cName}
                        time={c.time}
                        >
                        </DashboardMainPanel>
                    ))}

                        <DashboardNotes>

                        </DashboardNotes>

                    </Grid>
                    </Paper>
                    <Paper>
                        <br></br>
                    <Typography variant="h5" align="left">
                        Recently Updated Accounts
                    </Typography>
                        <br></br>
                    <Grid container spacing={16}>
                    {this.state.Accounts.map(a=>(
                       <DashboardAccounts
                       fName={a.fName}
                       lName={a.lName}
                       phone={a.phone}
                       email={a.email}
                       >
                       </DashboardAccounts>
                    ))}
                       <DashboardOP>

                       </DashboardOP>
                    </Grid>
                {/* contact */}
                {/* <Card>
                    <CardActionArea>
                        <CardMedia>
                        </CardMedia>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Contact Us
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
                </Card> */}
            </Paper>
        </div>)
    }
}

Dashboard.propTypes = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);
