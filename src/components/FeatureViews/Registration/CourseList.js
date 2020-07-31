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
import {
    getRegistrationCart,
    submitRegistration,
    useValidateRegisteringParent
} from "../../OmouComponents/RegistrationUtils";
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

const GET_STUDENTS = gql`
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

const CourseList = ({filteredCourses}) => {
    const [openCourseQuickRegistration, setOpen] = useState(false);
    const [quickCourseID, setQuickCourseID] = useState(null);
    const [quickStudent, setQuickStudent] = useState("");
    const {studentList} = JSON.parse(sessionStorage.getItem("registrations")).currentParent || false;
    const {data, loading} = useQuery(GET_STUDENTS, {
        "variables": {"userIds": studentList},
        skip: !studentList
    });

    const {currentParent} = getRegistrationCart();
    const {parentIsLoggedIn} = useValidateRegisteringParent();
    const {courseTitle, courseRow} = useStyles();

    if (loading) return <Loading small/>;

    const studentOptions = data?.userInfos.map((student) => ({
        "label": fullName(student.user),
        "value": student.user.id,
    })) || [];

    const handleStartQuickRegister = (courseID) => () => {
        setOpen(true);
        setQuickCourseID(courseID);
    };

    const handleAddRegistration = () => {
        submitRegistration(quickStudent, quickCourseID);
        setOpen(false);
    }

    return <> <Table>
        <TableBody>
            {
                filteredCourses
                    .filter(({courseType, endDate}) => (courseType === "CLASS") &&
                        moment().diff(moment(endDate), 'days') < 0)
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
                                                    style={{fontSize: "1.5em", fontWeight: 550, margin: "10px 0"}}
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
                                                format="MMM D YYYY"/>
                                            {" - "}
                                            <Moment
                                                date={course.endDate}
                                                format="MMM D YYYY"/> {" "}
                                            <Moment date={`${course.startDate}T${course.startTime}`}
                                                    format="dddd h:mm a"/>
                                            {" - "}
                                            <Moment
                                                date={`${course.startDate}T${course.endTime}`}
                                                format="dddd h:mm a"/>
                                            {" | "}
                                            ${course.totalTuition}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <span style={{margin: "5px", display: "block"}}>
                                    {course.enrollmentSet.length} / {course.maxCapacity}
                                    <span className="label">Enrolled</span>
                                </span>

                                {(currentParent || parentIsLoggedIn) && (
                                    <Button disabled={course.maxCapacity <= course.enrollmentSet.length}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleStartQuickRegister(course.id)}
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
        <Dialog open={openCourseQuickRegistration}>
            <DialogTitle>Which student do you want to enroll?</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel id="select-student-quick-registration">Select Student</InputLabel>
                    <Select labelId="select-student-quick-registration"
                            variant="outlined"
                            value={quickStudent}
                            onChange={(event) => setQuickStudent(event.target.value)}
                    >
                        <MenuItem value="">Select Student</MenuItem>
                        {
                            studentOptions.map(({value, label}) => <MenuItem value={value} key={value}>
                                {label}
                            </MenuItem>)
                        }
                    </Select>
                </FormControl>
                <DialogActions>
                    <Button onClick={handleAddRegistration}>
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
