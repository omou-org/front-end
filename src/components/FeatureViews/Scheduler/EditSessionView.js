import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {
  useHistory,
  useLocation,
  withRouter,
  useParams,
  NavLink,
} from "react-router-dom";
import Loading from "components/OmouComponents/Loading";

import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as calendarActions from "../../../actions/calendarActions";
import * as userActions from "../../../actions/userActions.js";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, Typography } from "@material-ui/core";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { DatePicker } from "@material-ui/pickers/DatePicker/DatePicker";
import { TimePicker } from "@material-ui/pickers/TimePicker/TimePicker";
import SearchSelect from "react-select";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { dateFormat, timeFormat } from "../../../utils";
import InstructorConflictCheck from "components/OmouComponents/InstructorConflictCheck";
import BackButton from "../../OmouComponents/BackButton";
import { ResponsiveButton } from "theme/ThemedComponents/Button/ResponsiveButton";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import "./scheduler.scss";

import { fullName } from "../../../utils";

import moment from "moment";

const GET_CATEGORIES = gql`
  query EditSessionCategoriesQuery {
    courseCategories {
      id
      name
    }
  }
`;

const GET_INSTRUCTORS = gql`
  query EditSessionCategoriesQuery {
    instructors {
      user {
        firstName
        id
        lastName
        email
      }
    }
  }
`;

const GET_SESSION = gql`
  query EditSessionViewQuery($sessionId: ID!) {
    session(sessionId: $sessionId) {
      id
      isConfirmed
      startDatetime
      title
      instructor {
        user {
          id
          firstName
          lastName
        }
      }
      course {
        id
        isConfirmed
        title
        availabilityList {
          startTime
          endTime
          dayOfWeek
        }
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
      startDatetime
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation UpdateCourse(
    $courseTitle: String
    $room: String
    $courseInstructor: ID
    $courseCategory: ID
    $courseId: ID!
  ) {
    createCourse(
      id: $courseId
      title: $courseTitle
      room: $room
      courseCategory: $courseCategory
      instructor: $courseInstructor
    ) {
      course {
        id
        title
        availabilityList {
          startTime
          endTime
          dayOfWeek
        }
        courseCategory {
          id
          name
        }
        room
        instructor {
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;

const UPDATE_SESSION = gql`
  mutation UpdateSession(
    $sessionId: ID!
    $sessionTitle: String
    $sessionStartDatetime: DateTime
    $sessionConfirmed: Boolean
    $sessionInstructor: ID
    $sessionEndDatetime: DateTime
  ) {
    createSession(
      id: $sessionId
      startDatetime: $sessionStartDatetime
      isConfirmed: $sessionConfirmed
      endDatetime: $sessionEndDatetime
      title: $sessionTitle
      instructor: $sessionInstructor
    ) {
      session {
        id
        startDatetime
        isConfirmed
        endDatetime
        title
        instructor {
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;

const EditSessionView = () => {
  const { course_id, session_id } = useParams();

  const history = useHistory();
  const location = useLocation();

  const { data, loading, error } = useQuery(GET_SESSION, {
    variables: { sessionId: session_id },
    onCompleted: (data) => {
      setFromMigration(data);
    },
  });

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useQuery(GET_CATEGORIES, {
    skip: loading || error,
  });

  const {
    data: instructorsData,
    loading: instructorsLoading,
    error: instructorsError,
  } = useQuery(GET_INSTRUCTORS, {
    skip: loading || error || categoriesLoading || categoriesError,
  });

  const [updateSession, updateSessionResults] = useMutation(UPDATE_SESSION, {
    update: (cache, { data }) => {
      const existingSession = cache.readQuery({
        query: GET_SESSION,
        variables: {
          sessionId: session_id,
        },
      }).session;

      //TODO: After back-end issues are resolved
      //   let updatedSession = [...existingSession];
      //   const matchingIndex = updatedSession.findIndex(({ id }) => id === session_id);
      //   if (matchingIndex === -1) {
      //     updatedSession = [...existingSession, newSession];
      // } else {
      //     updatedSession[matchingIndex] = newSession;
      // }
      cache.writeQuery({
        query: GET_SESSION,
        data: {
          session: [...existingSession, ...data["updateSession"].session],
        },
        variables: {
          sessionId: session_id,
        },
      });
    },
  });

  const [updateCourse, updateCourseResults] = useMutation(UPDATE_COURSE, {
    update: (cache, { data }) => {
      const existingCourse = cache.readQuery({
        query: GET_SESSION,
        variables: {
          courseId: course_id,
        },
      }).session;

      //TODO: After back-end issues are resolved
      //   let updatedSession = [...existingSession];
      //   const matchingIndex = updatedSession.findIndex(({ id }) => id === session_id);
      //   if (matchingIndex === -1) {
      //     updatedSession = [...existingSession, newSession];
      // } else {
      //     updatedSession[matchingIndex] = newSession;
      // }
      cache.writeQuery({
        query: GET_SESSION,
        data: {
          session: [...existingCourse, ...data["updateCourse"].course],
        },
        variables: {
          sessionId: session_id,
          courseCategoryId: course_id,
          courseId: course_id,
        },
      });
    },
  });

  const [sessionFields, setSessionFields] = useState({
    start_time: "",
    instructor: "",
    end_time: "",
    room: "",
    title: "",
    category: "",
    is_confirmed: "",
    duration: "",
    updatedDuration: "",
  });

  //Subject
  const handleCategoryChange = (event) => {
    setSessionFields({
      ...sessionFields,
      category: event,
    });
  };

  const handleInstructorChange = (event) => {
    setSessionFields({
      ...sessionFields,
      instructor: event,
    });
  };

  //Updates room and Title
  const handleTextChange = (field) => (event) => {
    setSessionFields({
      ...sessionFields,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setSessionFields({
      ...sessionFields,
      start_time: date,
    });
  };

  const handleTimeChange = (date) => {
    setSessionFields({
      ...sessionFields,
      start_time: date,
    });
  };

  const handleDurationSelect = (event) => {
    const { start_time } = sessionFields;
    let newEndTime = calculateEndTime(event.target.value, start_time);

    setSessionFields({
      ...sessionFields,
      duration: event.target.value,
      end_time: newEndTime,
    });
  };

  const calculateEndTime = (duration, startTime) => {
    let newEndTime;

    switch (duration) {
      case 1:
        var addTime = moment(startTime).add(1, "hours");
        newEndTime = moment(addTime).utc().format();
        break;
      case 1.5:
        var addTime = moment(startTime).add({ hours: 1, minutes: 30 });
        newEndTime = moment(addTime).utc().format();
        break;
      case 2:
        var addTime = moment(startTime).add(2, "hours");
        newEndTime = moment(addTime).utc().format();
        break;
      case 0.5:
        var addTime = moment(startTime).add(30, "minutes");
        newEndTime = moment(addTime).utc().format();
        break;
      default:
        return;
    }

    return newEndTime;
  };

  const onConfirmationChange = (event) => {
    setSessionFields({
      ...sessionFields,
      is_confirmed: event.target.value,
    });
  };

  const setFromMigration = (response) => {
    let confirmedState;
    let startDatetime;
    let checkTitle;
    let instructorValue;
    let instructorLabel;
    if (location.state === undefined) {
      history.push(
        `/scheduler/view-session/${response.session.course.id}/${response.session.id}/${response.session.course.instructor.user.id}`
      );
    } else {
      switch (location.state.allOrCurrent) {
        case "current": {
          confirmedState = response.session.isConfirmed;
          startDatetime = response.session.startDatetime;
          checkTitle = response.session.title;
          instructorValue = response.session.instructor.user.id;
          instructorLabel = response.session.instructor.user;
          break;
        }
        case "all": {
          confirmedState = response.session.course.isConfirmed;
          checkTitle = response.session.course.title;
          instructorValue = response.session.course.instructor.user.id;
          instructorLabel = response.session.course.instructor.user;
          break;
        }
      }
    }

    const startTime = moment(response.session.startDatetime).format("H");
    const endTime = moment(response.session.endDatetime).format("H");

    let durationHours = Math.abs(endTime - startTime);
    if (durationHours === 0) {
      durationHours = 1;
    }

    setSessionFields({
      category: {
        value: response.session.course.courseCategory.id,
        label: response.session.course.courseCategory.name,
      },
      instructor: {
        value: instructorValue,
        label: fullName(instructorLabel),
      },
      start_time: startDatetime,
      end_time: response.session.endDatetime,
      room: response.session.course.room,
      duration: durationHours,
      title: checkTitle,
      is_confirmed: confirmedState,
    });
  };

  const handleUpdateSession = () => {
    const {
      start_time,
      room,
      is_confirmed,
      instructor,
      category,
      duration,
      title,
    } = sessionFields;
    let newEndTime = calculateEndTime(duration, start_time);
    switch (location.state.allOrCurrent) {
      case "current": {
        const UTCstartDatetime = moment(start_time).utc().format();
        updateSession({
          variables: {
            sessionId: session_id,
            sessionTitle: title,
            sessionInstructor: instructor.value,
            sessionStartDatetime: UTCstartDatetime,
            sessionEndDatetime: newEndTime,
            sessionConfirmed: is_confirmed,
          },
        });
        break;
      }
      case "all": {
        updateCourse({
          variables: {
            courseCategoryId: course_id,
            courseId: course_id,
            courseTitle: title,
            courseInstructor: instructor.value,
            room: room,
          },
        });
      }
    }
    history.push(
      `/scheduler/view-session/${course_id}/${session_id}/${sessionFields.instructor.value}`
    );
  };

  if (loading || categoriesLoading || instructorsLoading) {
    return <Loading />;
  }

  if (error || categoriesError || instructorsError) {
    return <Typography>There's been an error!</Typography>;
  }

  const categoriesList = categoriesData.courseCategories.map(
    ({ id, name }) => ({
      value: id,
      label: name,
    })
  );

  const instructorList = instructorsData.instructors.map((instructor) => ({
    value: instructor.user.id,
    label: `${fullName(instructor.user)} - ${instructor.user.email}`,
  }));

  const courseDurationOptions = [1, 1.5, 2, 0.5];

  const course = data.session.course;

  const session = data.session;

  return (
    <Grid container className="main-session-view">
      <BackgroundPaper
        elevation={2}
        className="paper session"
        mt="2em"
        style={{ width: "100%" }}
      >
        <Grid className="session-button" item>
          <BackButton />
        </Grid>
        <Grid className="session-view" container direction="row" spacing={2}>
          <Grid item sm={12}>
            <TextField
              fullWidth
              onChange={handleTextChange("title")}
              value={sessionFields.title}
            />
          </Grid>
          <Grid
            align="left"
            className="session-view-details"
            container
            spacing={2}
            xs={6}
          >
            {location.state.allOrCurrent === "all" && (
              <Grid item xs={6}>
                <Typography variant="h5"> Subject </Typography>
                <SearchSelect
                  className="search-options"
                  isClearable
                  onChange={handleCategoryChange}
                  options={categoriesList}
                  placeholder="Choose a Category"
                  value={sessionFields.category}
                />
              </Grid>
            )}

            <Grid item xs={6}>
              <Typography variant="h5"> Room</Typography>
              <TextField
                onChange={handleTextChange("room")}
                value={sessionFields.room}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5"> Instructor </Typography>
              <SearchSelect
                onChange={handleInstructorChange}
                options={instructorList}
                placeholder="Choose an Instructor"
                value={sessionFields.instructor}
              />
              {location.state.allOrCurrent === "current" && (
                <FormControl
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                >
                  <InputLabel>Is instructor confirmed?</InputLabel>
                  <Select
                    onChange={onConfirmationChange}
                    value={sessionFields.is_confirmed}
                  >
                    <MenuItem value>Yes, Instructor Confirmed.</MenuItem>
                    <MenuItem value={false}>
                      No, Instructor is NOT Confirmed.
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
            {location.state.allOrCurrent === "current" && (
              <>
                <Grid item xs={6}>
                  <Typography variant="h5"> Date</Typography>
                  <DatePicker
                    inputVariant="outlined"
                    onChange={handleDateChange}
                    value={sessionFields.start_time}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h5"> Start Time</Typography>
                  <TimePicker
                    inputVariant="outlined"
                    onChange={handleTimeChange}
                    value={sessionFields.start_time}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="h5"> Duration </Typography>
                  <Select
                    onChange={handleDurationSelect}
                    value={sessionFields.duration}
                  >
                    {courseDurationOptions.map((duration, index) => (
                      <MenuItem key={index} value={duration}>
                        {`${duration} hour(s)`}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        <Grid
          className="session-detail-action-control"
          container
          direction="row"
          justify="flex-end"
        >
          <Grid item>
            <Grid container>
              {/* TODO: Update InstructorConflictCheck */}
              {/* <InstructorConflictCheck
                end={sessionFields.end_time}
                eventID={
                  editSelection === EDIT_CURRENT_SESSION
                    ? session.id
                    : course.course_id
                }
                instructorID={sessionFields.instructor.id}
                start={course.startTime}
                type={
                  editSelection === EDIT_CURRENT_SESSION ? "session" : "course"
                }
                onSubmit={updateSession}
              > */}
              <Grid item md={6}>
                <ResponsiveButton
                  className="button"
                  color="secondary"
                  variant="outlined"
                  onClick={handleUpdateSession}
                >
                  Save
                </ResponsiveButton>
              </Grid>
              {/* </InstructorConflictCheck> */}
              <Grid item md={6}>
                <BackButton warn={true} icon="cancel" label="cancel" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </BackgroundPaper>
    </Grid>
  );
};

export default EditSessionView;
