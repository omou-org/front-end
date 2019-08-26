import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import React, {Component} from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import {Card, Paper, Typography} from "@material-ui/core";
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
import CardActions from "@material-ui/core/CardActions";
import {NavLink, withRouter} from "react-router-dom";

import "./Accounts.scss";
import Avatar from "@material-ui/core/Avatar";

class Accounts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            usersList: [],
            viewToggle: true, // true = list, false = card view
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.setState(() => {
            let usersList = {};
            Object.assign(usersList, this.props.parents);
            Object.assign(usersList, this.props.students);
            Object.assign(usersList, this.props.instructors);
            return {usersList: usersList,}
        });
    }

    goToRoute(route) {
        this.props.history.push(this.props.match.url + route);
    }

    handleChange(e, newTabIndex) {
        e.preventDefault();
        let newUsersList = [];
        let usersList = {};
        Object.assign(usersList, this.props.parents);
        Object.assign(usersList, this.props.students);
        Object.assign(usersList, this.props.instructors);
        switch (newTabIndex) {
            case 0:
                newUsersList = usersList;
                break;
            case 1:
                newUsersList = this.props.instructors;
                break;
            case 2:
                newUsersList = this.props.students;
                break;
            // case 3:
            //     newUsersList = this.props.parents;
            //     break;
            default:
                newUsersList = usersList;
        }
        this.setState({value: newTabIndex, usersList: newUsersList});
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
        let styles = (username) => ({
                backgroundColor: this.stringToColor(username),
                color: "white",
                margin: 9,
                width: 38,
                height: 38,
                fontSize: 14,
            });
        let tableView = () => (
            <Table className="AccountsTable">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(this.state.usersList).map((row) => (
                        <TableRow key={row.user_id}
                            onClick={(event) => {
                                event.preventDefault();
                                this.goToRoute(`/${row.role}/${row.user_id}`);
                            }}
                            className="row">
                            <TableCell component="th" scope="row">
                                <Grid container layout={"row"} alignItems={"center"}>
                                    <Grid item md={3}>
                                        <Avatar
                                            style={styles(row.name)}>{row.name.match(/\b(\w)/g).join("")}</Avatar>
                                    </Grid>
                                    <Grid item md={9}>
                                        <Typography>
                                            {row.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.phone_number}</TableCell>
                            <TableCell>{row.role.charAt(0).toUpperCase() + row.role.slice(1)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );

        const cardView = () => this.state.usersList.map((user) => (
            <Card key={user.user_id}>
                <CardContent className={"text"}>
                    <Typography gutterBottom variant={"h6"} component={"h2"}>
                        {user.name}
                    </Typography>
                    <Typography component="p">
                        {user.role}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        size={"small"}
                        color={"secondary"}>
                        Call
                    </Button>
                </CardActions>
            </Card>
        ));

        return (<Grid item xs={12} className="Accounts">
            <Paper className={"paper"}>
                <BackButton/>
                <hr/>
                <Typography variant="h2" align={"left"} className={"heading"}>Accounts</Typography>
                <Grid container direction={"row"} alignItems={"center"}>
                    <Grid item xs={9}>
                        <Tabs
                            value={this.state.value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            className={"tabs"}
                        >
                            <Tab label="ALL"/>
                            <Tab label="INSTRUCTORS"/>
                            <Tab label="STUDENTS"/>
                            {/*<Tab label="PARENTS"/>*/}
                            <Tab label="ADMIN"/>
                        </Tabs>
                    </Grid>
                    <Grid item xs={2} className="toggleView">
                        <ListView onClick={(event) => {
                            event.preventDefault();
                            this.setState({viewToggle: true});
                        }}/>
                        <CardView onClick={(event) => {
                            event.preventDefault();
                            this.setState({viewToggle: false});
                        }}/>
                    </Grid>
                </Grid>
                <Grid container direction={"row"} alignItems={"center"} >
                    {
                        this.state.viewToggle ?
                            tableView() :
                            cardView()
                    }
                </Grid>
            </Paper>
        </Grid>)
    }
}

Accounts.propTypes = {};

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
)(Accounts));
