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
import Avatar from "@material-ui/core/Avatar";
import {stringToColor} from "../Accounts/accountUtils";

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
            initials: 'RL',
            phone: '555-555-5555',
            email: 'ryanliou@email.com',
            role: 'Receptionist'
        },
        {
            fName: 'Daniel',
            lName: 'Huang',
            intials: 'DH',
            phone: '555-555-5555',
            email: 'dHuang@email.com',
            role: 'Instructor'
        },
        {
            fName: 'Selina',
            lName: 'Che',
            initials: 'SC',
            phone: '555-555-5555',
            email: 'selinache@email.com',
            role: 'Student'
        }
        ],
        OP:[{
            fName: 'Selina',
            lName: 'Che',
            role: 'Student',
            status: 'Overdue',
            amt: '$50',
            course: 'AP Calclus'
        },
        {
            fName: 'Jerry',
            lName: 'Li',
            role: 'Student',
            status:'Due',
            amt: '$35',
            course: 'AP Calculus'
        }
       ]
    }

    render() {

        return (<div className="`Dashboard`">
            <Grid container style={{padding:"50px"}}>
               <Paper className={"Paper"} style={{background:"lightblue", padding:"50px", opacity: "80%"}}>
                   <Grid container >
                      <Grid item xs={6} >
                        <Typography variant="h3" align="left" style={{fontSize: "36px", fontStyleFamily:"Roboto Slab"}}>Hello Sharon!</Typography>
                      </Grid>
                      <Grid item xs={6}>
                          <Button variant="contained">Open in Scheduler</Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" align="left" style={{fontSize: "18px", fontStyleFamily: "Roboto SLab"}}>Summit Education</Typography>
                      </Grid>
                    </Grid>

                    <Grid container spacing={16} direction="row">
                        <Grid item xs={9}>
                            <Grid container>
                    {this.state.MainPanel.Classes.map(c=>(
                        <DashboardMainPanel
                        cName={c.cName}
                        time={c.time}
                        location={c.location}
                        >
                        </DashboardMainPanel>
                    ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Grid container>
                            {/* <DashboardNotes>
                            </DashboardNotes> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Paper style={{background:"lightblue"}}>
                    <Grid container>
                    <Grid item xs={6}>
                        <Paper style={{background:"white", opacity:"100%", zIndex: "0"}}>
                        <Grid container style={{zIndex: "500"}}>
                            <Grid item xs={12} style={{zIndex: "500"}}>
                                <Typography variant="h5" align="left" style={{padding: "10px", zIndex:"500"}}>
                                    Recently Updated Accounts
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                            {this.state.Accounts.map(a=>(
                                <DashboardAccounts
                                fName={a.fName}
                                lName={a.lName}
                                phone={a.phone}
                                email={a.email}
                                role={a.role}
                                >
                                </DashboardAccounts>
                                ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper style={{background:'white', opacity:"100%", zIndex: "0"}}>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h5" align="left" style={{padding: "10px"}}>
                                    Outstanding Payments
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                {this.state.OP.map(op=>(
                                <DashboardOP
                                    fName={op.fName}
                                    lName={op.lName}
                                    status={op.status}
                                    amt={op.amt}
                                    course={op.course}
                                    role={op.role}
                                    >
                                </DashboardOP>
                                ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>
            </Paper>
            </Grid>
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
