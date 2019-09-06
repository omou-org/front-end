import {connect} from "react-redux";
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
import {withRouter} from "react-router-dom";

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
        let styles = (username) => ({
            backgroundColor: this.stringToColor(username),
            color: "white",
            margin: 9,
            width: 38,
            height: 38,
            fontSize: 14,
        });

        return (
            <Grid item xs={3}>
                <Card key={this.props.user.user_id}>
                    <CardContent className={"text"}>
                        <Typography gutterBottom variant={"h6"} component={"h2"} align={'left'}>
                            {this.props.user.name}
                        </Typography>
                        <Typography component="p" align={'left'}>
                            {this.props.user.role}
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
