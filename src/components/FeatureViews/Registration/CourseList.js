import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";

import { useHistory } from "react-router-dom";
import { fullName } from "utils";
import { useValidateRegisteringParent } from "../../OmouComponents/RegistrationUtils";
import Box from "@material-ui/core/Box";
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import Loading from "../../OmouComponents/Loading";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DialogActions from "@material-ui/core/DialogActions";
import { useDispatch, useSelector } from "react-redux";
import * as types from "actions/actionTypes";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import ListDetailedItem, { ListContent, ListActions, ListHeading, ListTitle, ListDetails, ListDetail, ListDetailLink, ListButton, ListBadge, ListStatus, ListDivider } from '../../OmouComponents/ListComponent/ListDetailedItem'
import { Button, DialogContentText, Grid } from "@material-ui/core";
import { buttonBlue, gloom, white } from "theme/muiTheme";

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

const GET_PARENT_INTEREST = gql`
    query GetParentInterest($parentId: ID!){
        interests(parentId: $parentId) {
            id
            parent {
                user {
                    id
                    firstName
                    lastName
                }
            }
            course {
                id
                title
            }
        }
    }
`;

const ADD_PARENT_TO_INTEREST_LIST = gql`
    mutation AddParentToInterestList($parentId: ID!, $courseId: ID!){
        createInterest(parent: $parentId, course: $courseId) {
            interest {
                id
                parent {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
                course {
                    id
                    title
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
    },
}));

const CourseList = ({ filteredCourses, updatedParent }) => {
    const history = useHistory();

    const [openCourseQuickRegistration, setOpenQuickRegister] = useState(false);
    const [openInterestDialog, setOpenInterestDialog] = useState(false);
    const [quickCourseID, setQuickCourseID] = useState(null);
    const [interestCourseID, setInterestCourseID] = useState(null);
    const [quickStudent, setQuickStudent] = useState("");

    const { currentParent, ...registrationCartState } = useSelector((state) => state.Registration);
    const [addParentToInterestList, addParentToInterestListStatus] = useMutation(ADD_PARENT_TO_INTEREST_LIST, {

        onCompleted: () => {
            setOpenInterestDialog(false);
        },
        update: (cache, { data }) => {
            const newInterest = data.createInterest.interest;
            console.log(newInterest)
            const cachedInterestList = cache.readQuery({
                query: GET_PARENT_INTEREST,
                variables: { "parentId": currentParent.user.id },
            }).interests;
            console.log(cachedInterestList);
            cache.writeQuery({
                data: {
                    interests: [...cachedInterestList, newInterest],
                },
                query: GET_PARENT_INTEREST,
                variables: { "parentId": currentParent.user.id },
            });
        },
        onError: (error) => console.log(error),

    });
    const { parentIsLoggedIn } = useValidateRegisteringParent();
    const dispatch = useDispatch();

    const { studentIdList } = JSON.parse(sessionStorage.getItem("registrations"))?.currentParent || false;
    const { data: studentEnrollments, loading: studentEnrollmentsLoading, error: studentEnrollmentsError } = useQuery(GET_STUDENTS_AND_ENROLLMENTS, {
        "variables": { "userIds": studentIdList },
        skip: !studentIdList,
    });

    const { data: parentInterestList, loading: parentInterestListLoading, error: parentInterestError } = useQuery(GET_PARENT_INTEREST, {
        "variables": {
            "parentId": currentParent?.user.id,
        },
        skip: !parentIsLoggedIn,
    })


    const { courseTitle, courseRow } = useStyles();

    if (studentEnrollmentsLoading || parentInterestListLoading) return <Loading small />;
    if (studentEnrollmentsError || parentInterestError) return <div>There has been an error!</div>;

    const validRegistrations = Object.values(registrationCartState)
        .filter(registration => registration);
    const registrations = validRegistrations && [].concat.apply([], validRegistrations);
    const studentOptions = studentEnrollments?.userInfos
        .filter(({ user }) => (!registrations.find(({ course, student }) =>
            (course.id === quickCourseID && user.id === student))
        ))
        .map((student) => ({
            "label": fullName(student.user),
            "value": student.user.id,
        })) || [];

    const enrolledCourseIds = studentEnrollments?.enrollments.map(({ course }) => course.id);
    const previouslyEnrolled = (courseId, enrolledCourseIds, registrations, studentList) => {
        const validRegistrations = Object.values(registrations)
            .filter(registration => registration);
        if (!studentList || validRegistrations.length === 0 || !enrolledCourseIds) return false;
        const registeredCourseIds = registrations.map(({ course }) => course.id);
        const numStudents = studentList.length;
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

        return !(countOccurrences(registeredCourseIds, courseId) < numStudents &&
            !enrolledCourseIds.includes(courseId));
    }

    const handleStartQuickRegister = (courseID) => (e) => {
        e.preventDefault();
        setOpenQuickRegister(true);
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
        setOpenQuickRegister(false);
    }

    const handleInterestRegister = (courseID) => (e) => {
        e.preventDefault();
        setInterestCourseID(courseID);
        setOpenInterestDialog(true);

    }

    const handleAddInterest = () => {

        addParentToInterestList({
            variables: {
                "parentId": currentParent.user.id,
                "courseId": interestCourseID,
            }
        })
    }

    const inParentInterestList = (courseID) => {
        if (parentInterestList) {
            return parentInterestList.interests.some((interest) => interest.course.id === courseID);
        }
        return false;
    }

    const shouldDisableQuickRegister = ({ course, enrolledCourseIds, registrations, studentList }) => {
        return ((previouslyEnrolled(course.id, enrolledCourseIds, registrations, studentList)))
    }


    const clickHandler = (courseId) => {
        history.push(`/registration/course/` + courseId)
    }


    return (
        <>
            <Box width="100%">
                {filteredCourses
                    .filter(({ courseType, endDate, id }) => ((courseType === "CLASS") &&
                        (moment().diff(moment(endDate), 'days') < 0)))
                    .map((course) => {
                        course.enrollmentSet.length = course.maxCapacity
                        return (
                            <ListDetailedItem
                                key={course.id}
                            >

                                <ListContent>
                                    <ListHeading>
                                        <Box onClick={() => clickHandler(course.id)}>
                                            <ListTitle>
                                                {course.title}
                                            </ListTitle>
                                        </Box>
                                    </ListHeading>
                                    <ListDetails>
                                        <Link to={`/accounts/instructor/${course.instructor.user.id}`}>
                                            <ListDetailLink>
                                                {fullName(course.instructor.user)}
                                            </ListDetailLink>
                                        </Link>
                                        <ListDivider />
                                        <ListDetail>
                                            {moment(course.startDate).format("MMM D YYYY")} - {moment(course.endDate).format("MMM D YYYY")}
                                        </ListDetail>
                                        <ListDivider />
                                        <ListDetail>
                                            {moment(course.startDate).format("dddd")} {moment(course.startTime, "HH:mm").format("h:mm")} - {moment(course.endTime, "HH:mm").format("h:mm")}pm
                                </ListDetail>
                                        <ListDivider />
                                        <ListDetail>
                                            ${course.totalTuition}
                                        </ListDetail>
                                    </ListDetails>
                                </ListContent>
                                <ListActions>
                                    <ListStatus>
                                        {course.enrollmentSet.length} / {course.maxCapacity}
                                    </ListStatus>
                                    <ListButton>
                                        {course.enrollmentSet.length < course.maxCapacity
                                            ? <ResponsiveButton
                                                disabled={shouldDisableQuickRegister({
                                                    course, enrolledCourseIds,
                                                    registrations, studentIdList
                                                })}
                                                variant="contained"
                                                onClick={handleStartQuickRegister(course.id)}
                                                data-cy="quick-register-class"
                                                startIcon={<AddIcon />}
                                            >
                                                register
                                </ResponsiveButton>
                                            : inParentInterestList(course.id)
                                                ? <ResponsiveButton
                                                    disabled={inParentInterestList(course.id)}
                                                    variant="outlined"
                                                    onClick={handleInterestRegister(course.id)}
                                                    data-cy="add-interest-button"
                                                    style={{ color: buttonBlue, border: "none", background: white }}
                                                    startIcon={<CheckIcon />}
                                                >
                                                    interested
                                </ResponsiveButton>
                                                : <ResponsiveButton
                                                    disabled={inParentInterestList(course.id)}
                                                    variant="outlined"
                                                    onClick={handleInterestRegister(course.id)}
                                                    data-cy="add-interest-button"
                                                    style={{ color: gloom }}
                                                    startIcon={<AddIcon />}
                                                >
                                                    interest
                                </ResponsiveButton>}
                                    </ListButton>
                                </ListActions>
                            </ListDetailedItem>)
                    })
                }
            </Box>
            <Dialog open={openCourseQuickRegistration} onClose={() => setOpenQuickRegister(false)}>
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
                                studentOptions.map(({ value, label }) => <MenuItem
                                    data-cy="student-value"
                                    value={value} key={value}>
                                    {label}
                                </MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <DialogActions>
                        <ResponsiveButton
                            data-cy="add-registration-to-cart"
                            onClick={handleAddRegistration}
                            disabled={!quickStudent}
                        >
                            add to cart
                    </ ResponsiveButton>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Dialog open={openInterestDialog} onClose={() => setOpenInterestDialog(false)} PaperProps={{style: {"height": "310px", "width": "410px", "padding": "32px"}}}>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography variant="h3">Interested?</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1">This will add you to the Interest List. You will be notified once a spot opens up. Enrollment is on a first come, first to enroll basis.</Typography>
                    </Grid>
                    <Grid item style={{"marginBottom": "20px"}}>
                        <Typography variant="body1">Being on an interest List does not guarantee an actual seat to anyone.</Typography>
                    </Grid>
                    <Grid container justify={"flex-end"}>
                        <DialogActions>
                            <ResponsiveButton
                                data-cy="cancel-add-interest"
                                onClick={() => setOpenInterestDialog(false)}
                                variant="outlined"
                                color="primary"
                                style={{ border: "none" }}
                            >
                                Cancel
                            </ResponsiveButton>
                            <ResponsiveButton
                                data-cy="confirm-add-interest"
                                onClick={handleAddInterest}
                                variant="outlined"
                                color="primary"
                                style={{ border: "none", margin:"10px" }}
                            >
                                Notify Me
                            </ResponsiveButton>
                        </DialogActions>
                    </Grid>

                </Grid>
            </Dialog>
        </>
    )
};

CourseList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
