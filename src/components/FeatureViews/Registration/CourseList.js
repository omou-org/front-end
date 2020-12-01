import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";

import { useHistory } from "react-router-dom";
import {fullName} from "utils";
import {useValidateRegisteringParent} from "../../OmouComponents/RegistrationUtils";
import Box from "@material-ui/core/Box";
import AddIcon from '@material-ui/icons/Add';
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
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import ListComponent, { ListContent, ListActions, ListHeading, ListTitle, ListDetails, ListDetail, ListDetailLink, ListButton, ListBadge, ListStatus, ListDivider } from '../../OmouComponents/ListComponent/ListComponent'

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
    },
}));

const CourseList = ({ filteredCourses, updatedParent }) => {
    const history = useHistory();

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

    const shouldDisableQuickRegister = ({course, enrolledCourseIds, registrations, studentList}) => {
        return ((course.maxCapacity <= course.enrollmentSet.length) &&
            (previouslyEnrolled(course.id, enrolledCourseIds, registrations, studentList)))
    }


    const clickHandler = (courseId) => {
        history.push(`/registration/course/` + courseId)
    }
    
    
    return (
        <>
        <Box width="100%">
        {filteredCourses
            .map((course) => {
                return(
                    <ListComponent>
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
                                <ResponsiveButton
                                    disabled={shouldDisableQuickRegister({
                                        course, enrolledCourseIds,
                                        registrations, studentList
                                    })}                                    
                                    variant="contained"
                                    onClick={handleStartQuickRegister(course.id)}
                                    data-cy="quick-register-class"
                                    startIcon={<AddIcon />}
                                >
                                    register
                                </ResponsiveButton>
                            </ListButton>
                        </ListActions>
                    </ListComponent>)
                                        })
        }
        </Box>
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
        </>
    )
};

CourseList.propTypes = {
    "filteredCourses": PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CourseList;
