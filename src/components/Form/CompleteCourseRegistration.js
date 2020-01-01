import React, { Component } from "react";
import {NavLink, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { Card , Paper, Typography} from "@material-ui/core";
import AccountsCards from "../FeatureViews/Search/cards/AccountsCards";
import Grid from "@material-ui/core/Grid";

class CompleteCourseRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        console.log(this.props);
        let exampleUser={
           user:{email: this.props.email, id: this.props.studentID, first_name:this.props.student.slice(0," "), last_name:this.props.student.slice(" ", this.props.student.length)}, account_type: "STUDENT"
        }
        return (
            <div>
                {/* <h3>{this.props.currentStudentName}</h3>
                <h3>{this.props.currentCourseTitle}</h3>
                <Button component={NavLink} to={"/registration"}
                    className={"button"}>Register More</Button>
                <Button component={NavLink} to={"/registration/cart"}
                    className={"button"}>Checkout</Button> */}
                <div className="topText"></div>
                <Paper>
                    <Grid container>
                        <Grid item md={6}>
                            <div>
                                {this.props.currentCourseTitle}
                            </div>
                            <div>
                                Date
                            </div>
                            <div>
                                {this.props.startDate}
                            </div>
                            <div>
                                Teacher
                            </div>
                            <div>
                                {this.props.instructorName}
                            </div>
                        </Grid>
                        <Grid item md={6}>
                            <Card>
                            <AccountsCards user={exampleUser}></AccountsCards>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>

            </div>
        );
    }
}

CompleteCourseRegistration.propTypes = {
};

export default withRouter(CompleteCourseRegistration);
