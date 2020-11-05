import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import { NavLink, Redirect, useParams } from "react-router-dom";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, Typography, withStyles } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Loading from "../../OmouComponents/Loading";
import Avatar from "@material-ui/core/Avatar";
import { stringToColor } from "../Accounts/accountUtils";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { dayOfWeek } from "../../Form/FormUtils";
import * as hooks from "actions/hooks";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import UnconfirmIcon from "@material-ui/icons/Cancel";
// import {EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION} from "./SessionView";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

import InstructorSchedule from "../Accounts/TabComponents/InstructorSchedule";
import SessionPaymentStatusChip from "../../OmouComponents/SessionPaymentStatusChip";
import AddSessions from "components/OmouComponents/AddSessions";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { capitalizeString } from "../../../utils";

const EDIT_ALL_SESSIONS = "all";
const EDIT_CURRENT_SESSION = "current";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    elevation={0}
    getContentAnchorEl={null}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const styles = (username) => ({
  backgroundColor: stringToColor(username),
  color: "white",
  width: "3vw",
  height: "3vw",
  fontSize: 15,
  marginRight: 10,
});

const GET_SESSION = gql`
  query SessionViewQuery($sessionId: ID!) {
    session(sessionId: $sessionId) {
      id
      course {
        courseId
        room
        courseCategory {
          id
          name
        }
        instructor {
          user {
            id
            firstName
            lastName
          }
          subjects {
            name
          }
        }
        enrollmentSet {
          student {
            user {
              id
              firstName
              lastName
            }
          }
        }
      }
      endDatetime
      title
      startDatetime
    }
  }
`;

const SessionView = () => {
  const dispatch = useDispatch();
  const { session_id } = useParams();

  const { data, loading, error } = useQuery(GET_SESSION, {
    variables: { sessionId: session_id },
  });

  console.log(data);

  const api = useMemo(() => bindActionCreators(registrationActions, dispatch), [
    dispatch,
  ]);

  const instructors = useSelector(
    ({ Users: { InstructorList } }) => InstructorList
  );
  const categories = useSelector(
    ({ Course: { CourseCategories } }) => CourseCategories
  );

  //   console.log(categories)
  const courses = useSelector(({ Course: { NewCourseList } }) => NewCourseList);
  const students = useSelector(({ Users: { StudentList } }) => StudentList);

    const [enrolledStudents, setEnrolledStudents] = useState(false);
  const [edit, setEdit] = useState(false);
  const [unenroll, setUnenroll] = useState(false);
  const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);
  const [tutoringActionsAnchor, setTutoringActionsAnchor] = useState(null);

  // useEffect(() => {
  //     api.initializeRegistration();
  // }, [api]);
  // const enrollmentStatus = hooks.useEnrollmentByCourse(course.course_id);
  // const enrollments = useSelector(({ Enrollments }) => Enrollments);
  // const reduxCourse = courses[course.course_id];
  // const studentStatus = hooks.useStudent(reduxCourse.roster);
  // const loadedStudents = useMemo(
  //     () => reduxCourse.roster.filter((studentID) => students[studentID]),
  //     [reduxCourse.roster, students]
  // );

  // useEffect(() => {
  //     if (hooks.isSuccessful(studentStatus)) {
  //         setEnrolledStudents(
  //             loadedStudents.map((studentID) => ({
  //                 ...students[studentID],
  //             }))
  //         );
  //     }
  // }, [loadedStudents, studentStatus, students]);

  // if (loadedStudents.length === 0 && reduxCourse.roster.length > 1) {
  //     if (hooks.isLoading(studentStatus)) {
  //         return <Loading />;
  //     }
  //     if (hooks.isFail(studentStatus)) {
  //         return <LoadingError error="enrollment details" />;
  //     }
  // }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Typography>There's been an error!</Typography>;
  }

  //CHANGE all of these with data
  const enrollments = data.session.course.enrollmentSet;
  const courseTitle = data.session.course.instructor.subjects[0].name;
  const course = data.session.course;
  const enrollmentStatus = true;
  const session = data.session;
  const reduxCourse = 1;
  const instructor_id = data.session.course.instructor.user.id;
  const instructorName =
    data.session.course.instructor.user.firstName +
    " " +
    data.session.course.instructor.user.lastName;
//   const enrolledStudents = data.session.course.enrollmentSet;
  const daniel = "Daniel Huang";

  //   const categories = data.session.course.courseCategory
  // console.log(instructor.name)
  console.log(data.session.course);
  console.log(instructorName);
  console.log(categories);
  console.log(instructor_id);
  console.log(enrolledStudents);

//   var enrolledStudentsId = enrolledStudents.map((studentID) => {
//     return studentID.student.user.id;
//   });

//   console.log(enrolledStudentsId);

  const instructor = instructors[instructor_id] || { name: "N/A" };
//   const studentKeys = Object.keys(enrolledStudentsId);
  const studentKeys = Object.keys(enrolledStudents);
  //needs to be an array of ids of the students enrolled

  const handleTutoringMenuClick = (event) => {
    setTutoringActionsAnchor(event.currentTarget);
  };
  const closeTutoringMenu = () => {
    setTutoringActionsAnchor(null);
  };
//NO TOGGLE
  const toggleEditing = (editSelection) => {
    
    // setEditSelection(editSelection)
    // this.setState((oldState) => {
    //   return {
    //     ...oldState,
    //     editing: !oldState.editing,
    //     editSelection: editSelection,
    //   };
    // });
  };
  //EDITSTUFF
  const handleEditToggle = (cancel) => (event) => {
    event.preventDefault();
    if (!cancel && edit) {
      // if we're applying to edit session then toggle to edit view
      toggleEditing(editSelection);
    } else {
      setEdit(!edit);
    }
  };

  const handleEditSelection = (event) => {
    setEditSelection(event.target.value);
  };

  const handleUnenroll = (event) => {
    event.preventDefault();
    setTutoringActionsAnchor(null);
    setUnenroll(true);
  };

  // We only support unenrollment from session view for tutoring courses
  const closeUnenrollDialog = (toUnenroll) => (event) => {
    event.preventDefault();
    setUnenroll(false);
    if (toUnenroll) {
      // We assume course is tutoring course thus we're getting the first studentID
      const enrollment = enrollments[course.roster[0]][course.course_id];
      api.deleteEnrollment(enrollment);
    }
  };

  // enrollment not found in database
  //   if (
  //     Object.entries(enrollments).length === 0 &&
  //     enrollments.constructor === Object &&
  //     hooks.isSuccessful(enrollmentStatus)
  //   ) {
  //     return <Redirect to="/NotEnrolledStudent" />;
  //   }
  //   if (
  //     !course ||
  //     !categories ||
  //     (Object.entries(enrollments).length === 0 &&
  //       enrollments.constructor === Object)
  //   ) {
  //     return <Loading />;
  //   }
  const sessionStart = new Date(session.start_datetime);
  const day =
    sessionStart.getDate() !== new Date().getDate()
      ? session.start - 1 >= 0
        ? session.start - 1
        : 6
      : session.start;

  return (
    <>
      <Grid className="session-view" container direction="row" spacing={1}>
        <Grid item sm={12}>
          <Typography align="left" className="session-view-title" variant="h3">
            {session && session.title}
          </Typography>
        </Grid>
        <Grid item sm={12}>
          <Grid container>
            <Grid className="course-session-status" item xs={2}>
              {course.course_type === "tutoring" && (
                <SessionPaymentStatusChip
                  enrollment={
                    enrollments[Object.keys(enrollments)[0]][course.course_id]
                  }
                  session={session}
                  setPos
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          align="left"
          className="session-view-details"
          container
          item
          spacing={2}
          xs={6}
        >
          <Grid item xs={6}>
            <Typography variant="h5">Subject</Typography>
            <Typography>
              DANIEL WHAT
              {
                (
                  categories.find(
                    (category) => category.id === course.category
                  ) || {}
                ).name
              }
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Room</Typography>
            <Typography>{course && (course.room || "TBA")}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">
              Instructor
              {session.is_confirmed ? (
                <ConfirmIcon className="confirmed course-icon" />
              ) : (
                <UnconfirmIcon className="unconfirmed course-icon" />
              )}
            </Typography>
            {course && (
                // REACH OUT TO DESIGN FOR NO STUDENTS MESSAGE
              <NavLink
                style={{ textDecoration: "none" }}
                to={`/accounts/instructor/${instructor.user_id}`}
              >
                <Tooltip aria-label="Instructor Name" title={instructorName}>
                  <Avatar style={styles(instructorName)}>
                    {instructorName.match(/\b(\w)/g).join("")}
                  </Avatar>
                </Tooltip>
              </NavLink>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography align="left" variant="h5">
              Students Enrolled
              {enrolledStudents}
            </Typography>
            <Grid container direction="row">
                {/* map through enrolledstudents, and fill in as needed */}
              {studentKeys.map((key) => (
                <NavLink
                  key={key}
                  style={{ textDecoration: "none" }}
                //   needs to be enrollmentview
                  to={`/accounts/student/${enrolledStudents[key].user_id}/${course.course_id}`}
                >
                  <Tooltip title={enrolledStudents[key].name}>
                    <Avatar style={styles(enrolledStudents[key].name)}>
                      {enrolledStudents
                      //fullName(student.user).match
                        ? enrolledStudents[key].name.match(/\b(\w)/g).join("")
                        : hooks.isFail(enrollmentStatus)
                        ? "Error!"
                        : "Loading..."}
                    </Avatar>
                  </Tooltip>
                </NavLink>
              ))}
              {/* {studentKeys.map((key) => (
                <NavLink
                  key={key}
                  style={{ textDecoration: "none" }}
                  to={`/accounts/student/${enrolledStudents[key].user_id}/${course.course_id}`}
                >
                  <Tooltip title={enrolledStudents[key].firstName + " " + enrolledStudents[key].lastName }>
                    <Avatar style={styles(enrolledStudents[key].firstName + " " + enrolledStudents[key].lastName)}>
                      {enrolledStudents
                        // ? (enrolledStudents[key].firstName + " " + enrolledStudents[key].lastName).match(/\b(\w)/g).join("")
                        ? daniel.match(/\b(\w)/g).join("")

                        : hooks.isFail(enrollmentStatus)
                        ? "Error!"
                        : "Loading..."}
                    </Avatar>
                  </Tooltip>
                </NavLink>
              ))} */}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Day(s)</Typography>
            <Typography>{capitalizeString(dayOfWeek[day])}</Typography>
            <Typography>
              {new Date(session.start_datetime).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Time</Typography>
            <Typography>
              {session.startTime} - {session.endTime}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          {/* <InstructorSchedule instructorID={instructor_id} /> */}
        </Grid>
      </Grid>
      <Grid
        className="session-detail-action-control"
        container
        direction="row"
        justify="flex-end"
      >
        <Grid item>
          <Button
            className="button"
            color="secondary"
            component={NavLink}
            to={`/registration/course/${course.course_id}`}
            variant="outlined"
          >
            Course Page
          </Button>
        </Grid>
        <Grid item>
          {reduxCourse.course_type == "tutoring" && (
            <>
              <Button className="button" onClick={handleTutoringMenuClick}>
                Tutoring Options
                <ArrowDropDownIcon />
              </Button>
              <StyledMenu
                anchorEl={tutoringActionsAnchor}
                keepMounted
                onClose={closeTutoringMenu}
                open={Boolean(tutoringActionsAnchor)}
              >
                <MenuItem
                  color="secondary"
                  component={NavLink}
                  to={`/accounts/student/${course.roster[0]}/${course.course_id}`}
                  variant="outlined"
                >
                  Enrollment View
                </MenuItem>
                <AddSessions
                  componentOption="menuItem"
                  enrollment={enrollments[course.roster[0]][course.course_id]}
                  parentOfCurrentStudent={students[course.roster[0]].parent_id}
                />
                <MenuItem
                  color="secondary"
                  onClick={handleUnenroll}
                  variant="outlined"
                >
                  Unenroll Course
                </MenuItem>
              </StyledMenu>
            </>
          )}
        </Grid>
        <Grid item>
          <Button
            className="editButton"
            color="primary"
            onClick={handleEditToggle(true)}
            to={`/scheduler/edit-session/${course.course_id}/${session_id}/${instructor_id}/edit`}
            variant="outlined"
          >
            Reschedule
          </Button>
        </Grid>
      </Grid>
      <Dialog
        aria-describedby="form-dialog-description"
        aria-labelledby="form-dialog-title"
        className="session-view-modal"
        fullWidth
        maxWidth="xs"
        onClose={handleEditToggle(true)}
        open={edit}
      >
        <DialogTitle id="form-dialog-title">Edit Session</DialogTitle>
        <Divider />
        <DialogContent>
          <RadioGroup
            aria-label="delete"
            name="delete"
            onChange={handleEditSelection}
            value={editSelection}
          >
            <FormControlLabel
              control={<Radio color="primary" />}
              label="This Session"
              labelPlacement="end"
              value={EDIT_CURRENT_SESSION}
            />
            <FormControlLabel
              control={<Radio color="primary" />}
              label="All Sessions"
              labelPlacement="end"
              value={EDIT_ALL_SESSIONS}
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleEditToggle(true)}>
            Cancel
          </Button>
          <Button
            color="primary"
            component={NavLink}
            to={{
              pathname: `/scheduler/edit-session/${course.course_id}/${session.id}/${instructor_id}/edit`,
              state: { course: course, session: session },
            }}
          >
            Confirm to Edit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        aria-describedby="unenroll-dialog-description"
        aria-labelledby="unenroll-dialog-title"
        className="session-view-modal"
        fullWidth
        maxWidth="xs"
        onClose={closeUnenrollDialog(false)}
        open={unenroll}
      >
        <DialogTitle id="unenroll-dialog-title">
          Unenroll in {course.title}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            You are about to unenroll in <b>{course.title}</b> for{" "}
            <b>{enrolledStudents && enrolledStudents[studentKeys[0]].name}</b>.
            Performing this action will credit the remaining enrollment balance
            back to the parent's account balance. Are you sure you want to
            unenroll?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={closeUnenrollDialog(true)}
          >
            Yes, unenroll
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={closeUnenrollDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionView;
