import {connect} from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import Table from "@material-ui/core/Table";
import Grid from "@material-ui/core/Grid";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {Button} from "@material-ui/core";
import {NavLink} from "react-router-dom";

const msPerWeek = 1000 * 60 * 60 * 24 * 7;

const calcSessionCost = ({
    "schedule": {start_date, end_date, days},
    tuition,
}) => {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const numWeeks = (endDate - startDate) / msPerWeek;
    const numSessions = numWeeks * days.length;
    return tuition / numSessions;
};

const PayCourses = (props) => {
    const rows = props.user.student_ids.map((studentID) => {
        const student = props.students[studentID];

        const unpaidEnrollments = Object.entries(props.enrollments[studentID])
            .map(([courseID, {session_payment_status}]) => {
                const unpaidCount = Object.values(session_payment_status)
                    .reduce((total, paymentStatus) => total + (paymentStatus === 0), 0);
                return {
                    courseID,
                    unpaidCount,
                };
            });

        const numUnpaid = unpaidEnrollments
            .reduce((total, {unpaidCount}) => total + unpaidCount, 0);
        const tuition = unpaidEnrollments.reduce(
            (total, {courseID, unpaidCount}) =>
                total + Math.round(unpaidCount * calcSessionCost(props.courses[courseID])), 0
        );

        return {
            student,
            numUnpaid,
            tuition,
        };
    });

    return (
        <Grid>
            <Grid item md={6}>
                <Table component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                Student
                            </TableCell>
                            <TableCell align="left">
                                Unpaid&nbsp;Courses
                            </TableCell>
                            <TableCell align="left">
                                Tuition
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(({
                            "student": {first_name, last_name, user_id},
                            numUnpaid,
                            tuition,
                        }) => (
                                <TableRow key={user_id}>
                                    <TableCell align="left">
                                        {first_name}&nbsp;{last_name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {numUnpaid}
                                    </TableCell>
                                    <TableCell align="left">
                                        {tuition}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <Button
                    style={{
                        "float": "right",
                    }}
                    component={NavLink}
                    to={`/accounts/parents/${props.user.user_id}/pay`}>
                    $ Pay
                </Button>
            </Grid>
        </Grid>
    );
};

PayCourses.propTypes = {
    "user": PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    "payments": state.Payments,
    "courses": state.Course.NewCourseList,
    "parents": state.Users.ParentList,
    "students": state.Users.StudentList,
    "enrollments": state.Enrollments,
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PayCourses);
