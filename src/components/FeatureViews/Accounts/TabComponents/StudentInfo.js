import {connect} from "react-redux";
import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Chip from "@material-ui/core/Chip";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import {ReactComponent as IDIcon} from "../../../identifier.svg";
import "../Accounts.scss";
import Avatar from "@material-ui/core/Avatar";
import {withRouter} from "react-router-dom";
import {addDashes, stringToColor} from "../accountUtils";


class StudentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "student": this.props.user.student_ids
                .map((student_id) => this.props.students[student_id]),
        };
    }

    goToRoute(route) {
        this.props.history.push(route);
    }

    render() {
        const styles = (username) => ({
            "backgroundColor": stringToColor(username),
            "color": "white",
            "width": "7vw",
            "height": "7vw",
            "fontSize": "2vw",
            "margin": 20,
        });

        return (
            <Grid container spacing={40} alignItems="center" direction="row" item xs={10}>
                {this.state.student.map((student) =>
                    <Grid item xs={12} md={6} className="ProfileCard" key={student.user_id}>
                        <Card
                            onClick={() => {
                                this.props.history.push(`/accounts/student/${student.user_id}`);
                            }}
                            key={student.user_id}
                            style={{
                                "cursor": "pointer",
                            }}
                        >
                            <Grid container>
                                <Grid component={Hidden} xsDown item xs={6}>
                                    <Avatar
                                        style={styles(student.name)}>
                                        {student.name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={6}>
                                    <CardContent className="text">
                                        <Typography gutterBottom variant="h6" component="h2" align="left">
                                            {student.name}
                                        </Typography>
                                        <Typography component="p" align="left">
                                            <Chip
                                                style={{"marginLeft": 0, "marginTop": 0}}
                                                className={`userLabel ${student.role}`}
                                                label={student.role.charAt(0).toUpperCase() + student.role.slice(1)}
                                            />
                                        </Typography>
                                        <Typography>
                                            <Grid item xs={8} md={12} style={{"marginTop": 10}}>
                                                <Grid container>
                                                    <Grid item xs={6} md={3} align="left">
                                                        <IDIcon
                                                            width={22}
                                                            height={22} />
                                                    </Grid>
                                                    <Grid item xs={6} md={9} align="left">
                                                        #{student.user_id}
                                                    </Grid>
                                                    <Grid item xs={6} md={3} align="left">
                                                        <PhoneIcon />
                                                    </Grid>
                                                    <Grid item xs={6} md={9} align="left">
                                                        {addDashes(student.phone_number)}
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid item xs={6} md={3} align="left">
                                                        <EmailIcon />
                                                    </Grid>
                                                    <Grid item xs={6} md={9} align="left">
                                                        {student.email}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Typography>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>)}
            </Grid>
        );
    }
}

StudentInfo.propTypes = {};

const mapStateToProps = (state) => ({
    "payments": state.Payments,
    "courses": state.Course.NewCourseList,
    "students": state.Users.StudentList,
    "parents": state.Users.ParentList,
});

const mapDispatchToProps = () => ({});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(StudentInfo));
