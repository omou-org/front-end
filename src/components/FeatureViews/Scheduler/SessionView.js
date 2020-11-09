import React, { useEffect, useMemo, useState } from "react";
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
import DialogContentText from "@material-ui/core/es/DialogContentText";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import BackButton from "components/OmouComponents/BackButton";


import InstructorSchedule from "../Accounts/TabComponents/InstructorSchedule";
import SessionPaymentStatusChip from "../../OmouComponents/SessionPaymentStatusChip";
import AddSessions from "components/OmouComponents/AddSessions";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { capitalizeString } from "../../../utils";
import moment from "moment";

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
      startDatetime
      course {
        id
        dayOfWeek
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
  const { session_id } = useParams();

  const { data, loading, error } = useQuery(GET_SESSION, {
    variables: { sessionId: session_id },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Typography>There's been an error!</Typography>;
  }


  const { course, endDatetime, id, startDatetime, title } = data.session;

  var {
    courseCategory,
    dayOfWeek,
    enrollmentSet,
    courseId,
    instructor,
    room,
  } = course;

  const instructorName =
    instructor.user.firstName + " " + instructor.user.lastName;

  const course_id = course.id;

  const startSessionTime = moment(startDatetime).format("h:MM A");

  const endSessionTime = moment(endDatetime).format("h:MM A");
  
  return (
    <>
      <Grid className="session-view" container direction="row" spacing={1}>
        <Grid item sm={12}>
          <BackButton />
          <Typography align="left" className="session-view-title" variant="h3">
            {title}
          </Typography>
        </Grid>
        {/* DANIEL NEED? go though this */}
        {/* <Grid item sm={12}>
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
        </Grid> */}
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
            <Typography>{courseCategory.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Room</Typography>
            <Typography>{room || "TBA"}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">
              Instructor
              {/* DANIEL NEED? go though this */}
              {/* {session.is_confirmed ? (
                <ConfirmIcon className="confirmed course-icon" />
              ) : (
                <UnconfirmIcon className="unconfirmed course-icon" />
              )} */}
            </Typography>
            {course && (
              <NavLink
                style={{ textDecoration: "none" }}
                to={`/accounts/instructor/${instructor.user.id}`}
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
            </Typography>
            <Grid container direction="row">
              {enrollmentSet.length > 0 ? (
              enrollmentSet.map((student) => (
                <NavLink
                  key={student.student.user.id}
                  style={{ textDecoration: "none" }}
                  to={`/accounts/student/${student.student.user.id}/${course_id}`}
                >
                  <Tooltip
                    title={
                      student.student.user.firstName +
                      " " +
                      student.student.user.lastName
                    }
                  >
                    <Avatar
                      style={styles(
                        student.student.user.firstName +
                          " " +
                          student.student.user.lastName
                      )}
                    >
                      {(
                        student.student.user.firstName +
                        " " +
                        student.student.user.lastName
                      )
                        .match(/\b(\w)/g)
                        .join("")}
                    </Avatar>
                  </Tooltip>
                </NavLink>
              ))
              ):( <Typography variant="body">
                 No students enrolled yet.
              </Typography>)}
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Day(s)</Typography>
            <Typography>{capitalizeString(dayOfWeek)}</Typography>
            <Typography>
              {new Date(startDatetime).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Time</Typography>
            <Typography>
              {startSessionTime} - {endSessionTime}
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
            to={`/registration/course/${course_id}`}
            variant="outlined"
          >
            Course Page
          </Button>
        </Grid>
        <Grid item>
          {/* DANIEL NEED? go though this */}
          {/* {reduxCourse.course_type == "tutoring" && (
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
                  to={`/accounts/student/${course.roster[0]}/${course_id}`}
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
          )} */}
        </Grid>
        <Grid item>
          <Button
            className="editButton"
            color="primary"
            component={NavLink}
            to={`/scheduler/edit-session/${course_id}/${session_id}/${instructor.user.id}/edit`}
            variant="outlined"
          >
            Reschedule
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default SessionView;
