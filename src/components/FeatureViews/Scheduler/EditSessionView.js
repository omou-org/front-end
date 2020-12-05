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
// import {EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION} from "./SessionView";

import { dateFormat, timeFormat } from "../../../utils";
import InstructorConflictCheck from "components/OmouComponents/InstructorConflictCheck";
import BackButton from "../../OmouComponents/BackButton";
import "./scheduler.scss";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { fullName } from "../../../utils";

import moment from "moment";

const EDIT_ALL_SESSIONS = "all";
const EDIT_CURRENT_SESSION = "current";

//ANNA replace with fullName
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
      course {
        id
        isConfirmed
        title
        startTime
        endTime
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

///this session should be session.isConfirmed
//all session should be session.course.isConfirmed
//instructor should be from course

//ANNA
//Need to have startDatetime for course as well??? Same thing that was done for confirmed

//remove subject update from ALL

//Should title just be on ALL? Same thing with Subject. Why change the subject on just one?

//Title is fine update subject

//The updated session drops to the bottom. They go by id, not by date. UGH

//All stuff on top of enrollmentView should be course
//Everything else needs to be session

//is confirmed course is not necessary, clean queries and then remove is confirmed field from all

const UPDATE_SESSION = gql`
  mutation UpdateSession(
    $sessionId: ID!
    $title: String
    $sessionStartDatetime: DateTime
    $sessionConfirmed: Boolean
    $courseConfirmed: Boolean
    $room: String
    $instructor: ID
    $sessionEndDatetime: DateTime
    $courseStartDatetime: Time
    $courseEndDatetime: Time
    $courseCategoryId: ID!
    $courseCategoryName: String
    $courseId: ID!
  ) {
    createSession(
      id: $sessionId
      startDatetime: $sessionStartDatetime
      isConfirmed: $sessionConfirmed
      endDatetime: $sessionEndDatetime
    ) {
      session {
        id
        startDatetime
        isConfirmed
        endDatetime
      }
    }
    createCourseCategory(id: $courseCategoryId, name: $courseCategoryName) {
      courseCategory {
        id
        name
      }
    }
    createCourse(
      id: $courseId
      isConfirmed: $courseConfirmed
      title: $title
      room: $room
      instructor: $instructor
      startTime: $courseStartDatetime
      endTime: $courseEndDatetime
    ) {
      course {
        id
        isConfirmed
        startTime
        endTime
        title
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
          courseCategoryId: course_id,
          courseId: course_id,
        },
      }).session;

      cache.writeQuery({
        query: GET_SESSION,
        data: {
          //add a sort?
          session: [...existingSession, ...data["updateSession"].session].sort((a, b) => {return a.id - b.id}),
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
    console.log(sessionFields.end_time);
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
    if (location.state === undefined) {
      history.push(
        `/scheduler/view-session/${response.session.course.id}/${response.session.id}/${response.session.course.instructor.user.id}`
      );
    } else {
      switch (location.state.allOrCurrent) {
        case "current": {
          confirmedState = response.session.isConfirmed;
          startDatetime = response.session.startDatetime;
          break;
        }
        case "all": {
          confirmedState = response.session.course.isConfirmed;
          startDatetime = response.session.course.startDatetime;
          break;
        }
      }
    }

    const startTime = moment(response.session.startDatetime).format("h");
    const endTime = moment(response.session.endDatetime).format("h");

    const checkTime = moment(response.session.startDatetime).format("h:MM");
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
        value: response.session.course.instructor.user.id,
        label: fullName(response.session.course.instructor.user),
      },
      start_time: startDatetime,
      end_time: response.session.endDatetime,
      room: response.session.course.room,
      duration: durationHours,
      title: response.session.course.title,
      is_confirmed: confirmedState,
    });
  };

  const handleUpdateSession = () => {
    const {
      start_time,
      end_time,
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
        console.log(start_time);

        console.log(newEndTime);
        console.log(UTCstartDatetime);

        ///this session should be session.isConfirmed
        //all session should be session.course.isConfirmed
        //instructor should be from course

        updateSession({
          variables: {
            sessionId: session_id,
            courseCategoryId: course_id,
            courseId: course_id,
            courseCategoryName: category.label,
            title: title,
            instructor: instructor.value,
            room: room,
            sessionStartDatetime: UTCstartDatetime,
            sessionEndDatetime: newEndTime,
            sessionConfirmed: is_confirmed,
          },
          // startDatetime: start_time.toISOString(),
        });
        break;
      }
      case "all": {
        //ANNA add TODO here for course availability
        //Needs to be updated to just take time, won't take date, it is startDate, not startDatetime
        updateSession({
          variables: {
            sessionId: session_id,
            courseCategoryId: course_id,
            courseId: course_id,
            courseCategoryName: category.label,
            title: title,
            instructor: instructor.value,
            room: room,
            // courseStartDatetime: start_time,
            // courseEndDatetime: newEndTime,
          },
        });
        //   start_time: start_time.toLocaleString("eng-US", timeFormat),
      }
      // no default
    }
    //ANNA DOES THIS GO BACK IN???
    //same route as back
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

  const party = [
    {
      id: 3,
      name: "new",
    },
    {
      id: 4,
      name: "test",
    },
  ];

  const categoriesList = party.map(({ id, name }) => ({
    value: id,
    label: name,
  }));
  // const categoriesList = categoriesData.courseCategories.map(
  //   ({ id, name }) => ({
  //     value: id,
  //     label: name,
  //   })
  // );

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
              <FormControl style={{ marginTop: "20px", marginBottom: "10px" }}>
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
            </Grid>
            {location.state.allOrCurrent === "current" && (
              <Grid item xs={6}>
                <Typography variant="h5"> Date</Typography>
                <DatePicker
                  inputVariant="outlined"
                  onChange={handleDateChange}
                  value={sessionFields.start_time}
                />
              </Grid>
            )}
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
                <Button
                  className="button"
                  color="secondary"
                  variant="outlined"
                  onClick={handleUpdateSession}
                >
                  Save
                </Button>
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
