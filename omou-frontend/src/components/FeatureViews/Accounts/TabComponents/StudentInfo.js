import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { TableBody, TableHead } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import { withRouter } from "react-router-dom";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Chip from "@material-ui/core/Chip";
import { ReactComponent as IDIcon } from "../../../identifier.svg";
import '../Accounts.scss';
import Avatar from "@material-ui/core/Avatar";

class StudentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {},
            otherParent: {},
        };
    }

    componentWillMount() {
        this.setState({
            student: this.props.user_id.student_ids.map((student_id) => this.props.students[student_id]),
        })
    }

    addDashes(string) {
        return (
            `(${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 15)})`);
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
        console.log(this.props);
        let styles = (username) => ({
            backgroundColor: this.stringToColor(username),
            color: "white",
            margin: 9,
            width: 120,
            height: 120,
            fontSize: 40,
            margin: 20,
        });

        return (
            <Grid container spacing={40} alignItems={'center'} direction={'row'} item xs={12}>
                {this.state.student.map((students) =>
                    <Grid item xs={5} className="ProfileCard">
                        <Card key={students.user_id}>
                            <Grid container>
                                <Grid item xs={4}>
                                    <Avatar
                                        style={styles(students.name)}>{students.name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={8}>
                                    <CardContent className={"text"}>

                                        <Typography gutterBottom variant={"h6"} component={"h2"} align={'left'}>
                                            {students.name}
                                        </Typography>
                                        <Typography component="p" align={'left'}>
                                            <Chip
                                                style={{ marginLeft: 0, marginTop: 0,}}
                                                className={`userLabel ${students.role}`}
                                                label={students.role.charAt(0).toUpperCase() + students.role.slice(1)}
                                            />
                                        </Typography>
                                        <Typography>
                                            <Grid item xs={8} style={{ marginTop: 10 }}>
                                                <Grid container>
                                                    <Grid item md={2} align="left">
                                                        <IDIcon
                                                            width={22}
                                                            height={22} />
                                                    </Grid>
                                                    <Grid item md={10} align="left">
                                                        #{students.user_id}
                                                    </Grid>
                                                    <Grid item md={2} align="left">
                                                        <PhoneIcon />
                                                    </Grid>
                                                    <Grid item md={10} align="left">
                                                        {this.addDashes(students.phone_number)}
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid item md={2} align="left">
                                                        <EmailIcon />
                                                    </Grid>
                                                    <Grid item md={10} align="left">
                                                        {students.email}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )}
                </Grid>);
    }

}

StudentInfo.propTypes = {};

function mapStateToProps(state) {
    return {
        payments: state.Payments,
        courses: state.Course.NewCourseList,
        students: state.Users.StudentList,
        parents: state.Users.ParentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StudentInfo);