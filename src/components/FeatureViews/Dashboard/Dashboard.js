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
import MenuList from "@material-ui/core/MenuList";
import SessionMenu from "./SessionMenu";
import OPMenu from "./OPMenu";
import bg from "./assets/dashboard-bg.jpg";

class Dashboard extends Component {

    omouURL = process.env.REACT_APP_DOMAIN

    hStyle = {
        textColor:"#404143",
        fontStyleFamily:"Roboto Slab"
    }

    state = {
        session: 'classes',
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
            },
            {
                cName: 'G10 Biology',
                time: '1p-2p',
                location: 'Room 10a'
            },
            {
                cName: 'G10 Biology',
                time: '1p-2p',
                location: 'Room 10a'
            },
            {
                cName: 'G10 Biology',
                time: '1p-2p',
                location: 'Room 10a'
            },

        ],
        Tutoring:[{
            sName: 'AP Calculus',
            time: '3p-4p',
            location: 'Room 10a'
        },
        {
            sName: 'G7 Trigonometry',
            time: '1p-2p',
            location: 'Room 66'
        },
        {
            sName: 'AP European History',
            time: '12p-2p',
            location: 'Room 5a'
        },
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

     handleSessionSelect = (session) => {
        console.log('state.session' + session)
        if (session = 'classes') {
            //display classes
            {this.state.MainPanel.Classes.map(c=>(
                <DashboardMainPanel
                cName={c.cName}
                time={c.time}
                location={c.location}
                >
                </DashboardMainPanel>
            ))}
        }

        else if (session = 'tutoring') {
            //display tutoring
            {this.state.MainPanel.Tutoring.map(s=>(
                <DashboardMainPanel
                cName={s.sName}
                time={s.time}
                location={s.location}
                ></DashboardMainPanel>
            ))}
        }
    }

    render() {

        return (<div className="`Dashboard`">
            <Grid container >
               <Paper className={"Paper"} style={{backgroundImage: `url(${bg}`, backgroundSize: "100%", padding: "20px"}}>
                   <Grid container >
                      <Grid item xs={6} >
                        <Typography variant="h3" align="left" style={{fontSize: "36px", fontStyleFamily:"Roboto Slab", textColor: "#404143", fontWeight:"bold"}}>Hello Sharon!</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" align="left" style={{fontSize: "18px", fontStyleFamily: "Roboto SLab", textColor: "#404143", fontWeight: 500}}>Summit Tutoring</Typography>
                      </Grid>
                    </Grid>
                    <br></br>

                    <Grid container>
                        <Grid item xs={9}>
                    <Paper style={{padding: "10px", backgroundColor: "#E1F5FE", opacity: .7}}>
                    <Grid container spacing={16} direction="row">
                        

                        <Grid item xs={7}>
                            <Typography variant="h3" align="left" style={{fontFamily: "Roboto", fontStyle:"normal", fontWeight:"500", fontSize:"27px", color:"#404143"}}>
                                Saturday, December 7
                            </Typography>
                        </Grid>

                        <Grid item xs={5}>
                          <Button variant="contained" style={{float: "right"}}>View in Scheduling</Button>
                        </Grid>

                        <Grid Item xs={12} >
                            <SessionMenu style={{margin: "20px"}}></SessionMenu>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container style={{flexWrap:"nowrap", overflow:"scroll", overflowY: "hidden"}}>
                            {this.handleSessionSelect(this.state.session)}
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
                    </Grid>
                    </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper style={{margin:"10px", marginTop:"0px", backgroundColor: "#E1F5FE", opacity: .7}}>
                               Notes here
                        </Paper>
                    </Grid>
                    </Grid>
                    <Grid container>
                    <Grid item xs={6}>
                        <Paper style={{backgroundColor: "#E1F5FE", opacity: .7, zIndex: "0", margin:"10px", marginLeft:"0px"}}>
                        <Grid container style={{zIndex: "500"}}>
                            <Grid item xs={12} style={{zIndex: "500"}}>
                                <Typography variant="h5" align="left" style={{padding: "10px", zIndex:"500", fontFamily: "Roboto", fontStyle: "normal", fontWeight: 500, fontSize: "18px", lineHeight: "21px",display:"flex", alignItems: "center"}}>
                                    Recently Updated Accounts
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container style={{flexWrap: 'nowrap', overflowY:"hidden"}}>
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
                        <Paper style={{backgroundColor: "#E1F5FE", opacity: .7, zIndex: "0", margin:"10px"}}>
                        <Grid container>
                            <Grid item xs={9}>
                            <Typography variant="h5" align="left" style={{padding: "10px", zIndex:"500", fontFamily: "Roboto", fontStyle: "normal", fontWeight: 500, fontSize: "18px", lineHeight: "21px",display:"flex", alignItems: "center"}}>
                                    Outstanding Payments
                                </Typography>
                            </Grid>

                            <Grid Item xs={3} >
                            <OPMenu style={{float: "right", maxHeight: '41px'}}></OPMenu>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container style={{flexWrap: 'nowrap', overflow:"scroll", overflowY:"hidden"}}>
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
