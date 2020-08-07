import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";

import {fullName} from "utils";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import {useValidateRegisteringParent} from "../../OmouComponents/RegistrationUtils";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DialogActions from "@material-ui/core/DialogActions";
import {useDispatch, useSelector} from "react-redux";
import * as types from "actions/actionTypes";

export const GET_STUDENTS_AND_ENROLLMENTS = gql`
    query GetStudents($userIds: [ID]!) {
      userInfos(userIds: $userIds) {
        ... on StudentType {
          user {
            firstName
            lastName
            id
          }
        }
      }
      enrollments(studentIds: $userIds) {
        id
        course {
          id
        }
      }
    }
`;

const useStyles = makeStyles((theme) => ({
    "courseTitle": {
        "color": theme.palette.common.black,
        "textDecoration": "none",
    },
    "courseRow": {
        textDecoration: "none"
    }
}));

const CourseList = ({ filteredCourses, updatedParent }) => {
    const [openCourseQuickRegistration, setOpen] = useState(false);
    const [quickCourseID, setQuickCourseID] = useState(null);
    const [quickStudent, setQuickStudent] = useState("");

    const {currentParent, ...registrationCartState} = useSelector((state) => state.Registration);
    const dispatch = useDispatch();

    const {studentList} = JSON.parse(sessionStorage.getItem("registrations"))?.currentParent || false;
    const {data, loading} = useQuery(GET_STUDENTS_AND_ENROLLMENTS, {
        "variables": {"userIds": studentList},
        skip: !studentList
    });

    const {parentIsLoggedIn} = useValidateRegisteringParent();
    const {courseTitle, courseRow} = useStyles();

    if (loading) return <Loading small/>;

    const validRegistrations = Object.values(registrationCartState)
        .filter(registration => registration);
    const registrations = validRegistrations && [].concat.apply([], validRegistrations);
    const studentOptions = data?.userInfos
        .filter(({user}) => (!registrations.find(({course, student}) =>
                (course.id === quickCourseID && user.id === student))
        ))
        .map((student) => ({
            "label": fullName(student.user),
            "value": student.user.id,
        })) || [];

    const enrolledCourseIds = data?.enrollments.map(({course}) => course.id);
    const previouslyEnrolled = (courseId, enrolledCourseIds, registrations, studentList) => {
        const validRegistrations = Object.values(registrations)
            .filter(registration => registration);
        if (!studentList || validRegistrations.length === 0 || !enrolledCourseIds) return false;
        const registeredCourseIds = registrations.map(({course}) => course.id);
        const numStudents = studentList.length;
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

        return !(countOccurrences(registeredCourseIds, courseId) < numStudents &&
            !enrolledCourseIds.includes(courseId));
    }

    const handleStartQuickRegister = (courseID) => (e) => {
        e.preventDefault();
        setOpen(true);
        setQuickCourseID(courseID);
    };

    const handleAddRegistration = () => {
        dispatch({
            type: types.ADD_CLASS_REGISTRATION,
            payload: {
                studentId: quickStudent,
                courseId: quickCourseID
            }
        });
        setOpen(false);
    }

    const disableQuickRegister = ({course, enrolledCourseIds, registrations, studentList}) => {
        return ((course.maxCapacity <= course.enrollmentSet.length) &&
            (previouslyEnrolled(course.id, enrolledCourseIds, registrations, studentList)))
    }

    return <> <Table>
        <TableBody data-cy="classes-table">
            {
                filteredCourses
                    .filter(({courseType, endDate, id}) => ((courseType === "CLASS") &&
                        (moment().diff(moment(endDate), 'days') < 0)) &&
                        (!previouslyEnrolled(id, enrolledCourseIds, registrations, studentList)))
                    .map((course) => (
                        <TableRow
                            key={course.id}
                        >
                            <TableCell
                                style={{padding: "3%"}}
                                component={Link} to={`/registration/course/${course.id}`}
                                className={courseRow}
                            >
                                <Grid className={courseTitle}
                                    item md={10} xs={12}
                                    container
                                    direction="column"
                                >
                                    <Grid item>
                                        <Typography align="left"
                                            className="course-heading"
                                            style={{ fontSize: "1.5em", fontWeight: 550, margin: "10px 0" }}
                                        >
                                            {course.title}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography align="left">
                                            By: {fullName(course.instructor.user)}
                                            {" | "}
                                            <Moment
                                                date={course.startDate}
                                                format="L" />
                                            {" - "}
                                            <Moment
                                                date={course.endDate}
                                                format="L" /> {" "}
                                            <Moment date={`${course.startDate}T${course.startTime}`}
                                                format="ddd h:mm " />
                                            {" - "}
                                            <Moment
                                                date={`${course.startDate}T${course.endTime}`}
                                                format="h:mm a" />
                                            {" | "}
                                            ${course.totalTuition}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <span style={{margin: "5px", display: "block"}}>
                                    <span
                                        data-cy="num-enrolled-students">{course.enrollmentSet.length}</span> / {course.maxCapacity}
                                    <span className="label">Enrolled</span>
                                </span>
                                {(currentParent || parentIsLoggedIn || updatedParent) && (
                                    <Button
                                        disabled={disableQuickRegister({
                                            course, enrolledCourseIds,
                                            registrations, studentList
                                        })}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleStartQuickRegister(course.id)}
                                        data-cy="quick-register-class"
                                    >
                                        + REGISTER
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
            }
        </TableBody>
    </Table>
        <Dialog open={openCourseQuickRegistration} onClose={() => setOpen(false)}>
            <DialogTitle>Which student do you want to enroll?</DialogTitle>
            <DialogContent>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="select-student-quick-registration">Select Student</InputLabel>
                    <Select data-cy="select-student-to-register"
                            labelId="select-student-quick-registration"
                            value={quickStudent}
                            onChange={(event) => setQuickStudent(event.target.value)}
                    >
                        <MenuItem value=""><em>Select Student</em></MenuItem>
                        {
                            studentOptions.map(({value, label}) => <MenuItem
                                data-cy="student-value"
                                value={value} key={value}>
                                {label}
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button data-cy="add-registration-to-cart"
                            onClick={handleAddRegistration}
                            disabled={!quickStudent}
                    >
                        ADD TO CART
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </>
};

CourseList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
