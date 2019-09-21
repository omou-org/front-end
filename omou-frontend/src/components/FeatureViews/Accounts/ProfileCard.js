import { connect } from "react-redux";
import React, { Component } from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ListView from "@material-ui/icons/ViewList";
import CardView from "@material-ui/icons/ViewModule";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Hidden from "@material-ui/core/es/Hidden/Hidden";

import { ReactComponent as IDIcon } from "../../identifier.svg";
import './Accounts.scss';

import Avatar from "@material-ui/core/Avatar";

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            usersList: [],
            viewToggle: true, // true = list, false = card view
        };
    }

    componentWillMount() {

    }

    addDashes(string) {
        return(
             `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
    }

    goToRoute(route) {
        this.props.history.push(this.props.match.url + route);
    }
    stringToColor(string) {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let colour = "#";

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            colour += `00${value.toString(16)}`.substr(-2);
        }
        /* eslint-enable no-bitwise */

        return colour;
    }

    render() {
        const styles = (username) => ({
            "backgroundColor": this.stringToColor(username),
            "color": "white",
            "width": "7vw",
            "height": "7vw",
            "fontSize": "2vw",
            "margin": 20,
        });

        return (
            <Grid item xs={12} md={6} className="ProfileCard">
                <Card key={this.props.user.user_id}
                    style={{ cursor: "pointer" }}
                    onClick={(event) => {
                        event.preventDefault();
                        this.goToRoute(`/${this.props.user.role}/${this.props.user.user_id}`);
                    }}>
                    <Grid container>
                        <Grid component={Hidden} xsDown item xs={4} md={4}>
                            <Avatar
                                style={styles(this.props.user.name)}>{this.props.user.name.match(/\b(\w)/g).join("")}
                            </Avatar>
                        </Grid>
                        <Grid item xs={8} md={8}>
                            <CardContent className={"text"}>
                                <Typography gutterBottom variant={"h6"} component={"h2"} align={'left'}>
                                    {this.props.user.name}
                                </Typography>
                                <Typography component="p" align={'left'}>
                                    <Chip
                                        style={{ cursor: "pointer" }}
                                        className={`userLabel ${this.props.user.role}`}
                                        label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                                    />
                                </Typography>
                                <Typography>
                                    <Grid item xs={8} style={{ marginTop: 10 }}>
                                        <Grid container>
                                            <Grid item xs={4} md={2} align="left">
                                                <IDIcon
                                                    width={22}
                                                    height={22} />
                                            </Grid>
                                            <Grid item xs={8} md={10} align="left">
                                                #{this.props.user.user_id}
                                            </Grid>
                                            <Grid item xs={4} md={2} align="left">
                                                <PhoneIcon />
                                            </Grid>
                                            <Grid item xs={8} md={10} align="left">
                                                {this.addDashes(this.props.user.phone_number)}
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={4} md={2} align="left">
                                                <EmailIcon />
                                            </Grid>
                                            <Grid item xs={8} md={10} align="left">
                                                {this.props.user.email}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        )
    }
}

ProfileCard.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileCard));
