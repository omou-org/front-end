import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {
  useHistory,
  useLocation,
  withRouter,
  useParams,
} from "react-router-dom";
import Loading from "components/OmouComponents/Loading";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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

const GET_SESSION = gql`
  query SessionViewQuery($sessionId: ID!) {
    session(sessionId: $sessionId) {
      id
      startDatetime
      course {
        id
        isConfirmed
        dayOfWeek
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
      title
      startDatetime
    }
  }
`;

const EditSessionView = () => {
  const { session_id } = useParams();
  
  const dispatch = useDispatch();
  const api = useMemo(
    () => ({
      ...bindActionCreators(apiActions, dispatch),
      ...bindActionCreators(userActions, dispatch),
      ...bindActionCreators(registrationActions, dispatch),
      ...bindActionCreators(calendarActions, dispatch),
    }),
    [dispatch]
  );
  
  const history = useHistory();

  const { data, loading, error } = useQuery(GET_SESSION, {
    variables: { sessionId: session_id },
    onCompleted: (data) => {
      setFromMigration(data);
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

  //ANNA
  //Yes separate queries
  const categories = [
    {
      id: 1,
      name: "History",
    },
    {
      id: 1,
      name: "History",
    },
  ];

  const instructors = [
    {
      id: 1,
      name: "Danny Dude",
    },
    {
      id: 1,
      name: "Mister man",
    },
  ];

  const categoriesList = categories.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

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

  const handleTextChange = (field) => (event) => {
    setSessionFields({
      ...sessionFields,
      [field]: event.target.value,
    });
  };

  const handleDateTimeChange = (date) => {
    console.log(date);
    // if (date.end_time) {
    // }
    // end_time.setDate(date.getDate());
    // end_time.setHours(date.getHours() + duration);
    // end_time.setMinutes(date.getMinutes());
  };

  const handleDurationSelect = (event) => {
    const { start_time } = sessionFields;
    const newEndTime = new Date(start_time);

    switch (event.target.value) {
      case 1:
        newEndTime.setHours(start_time.getHours() + 1);
        break;
      case 1.5:
        newEndTime.setHours(start_time.getHours() + 1);
        newEndTime.setMinutes(start_time.getMinutes() + 30);
        break;
      case 2:
        newEndTime.setHours(start_time.getHours() + 2);
        break;
      case 0.5:
        newEndTime.setMinutes(start_time.getMinutes() + 30);
        break;
      default:
        return;
    }
    setSessionFields({
      ...sessionFields,
      duration: event.target.value,
      end_time: newEndTime,
    });
  };

  const onConfirmationChange = (event) => {
    setSessionFields({
      ...sessionFields,
      is_confirmed: event.target.value,
    });
  };

  const instructorList = Object.values(instructors).map(
    ({ user_id, name, email }) => ({
      value: user_id,
      label: `${name} - ${email}`,
    })
  );

  const setFromMigration = (response) => {
    const startTime = moment(response.session.startDatetime).format("h");
    const endTime = moment(response.session.endDatetime).format("h");

    const checkTime = moment(response.session.startDatetime).format("h:MM");
    console.log(checkTime)

    let durationHours = Math.abs(endTime - startTime);
    if (durationHours === 0) {
      durationHours = 1;
    }
    const category = categories.find(
      (category) => category.id === course.category
    );
    setSessionFields({
      category: {
        value: response.session.course.courseCategory.id,
        label: response.session.course.courseCategory.name,
      },
      instructor: {
        value: (response.session.course.instructor.user.id),
        label: fullName(response.session.course.instructor.user),
      },
      start_time: response.session.startDatetime,
      end_time: response.session.endDatetime,
      room: response.session.course.room,
      duration: durationHours,
      title: response.session.title,
      is_confirmed: response.session.course.isConfirmed,
    });
  };

  //Add dialog box here of current or all
  const updateSession = () => {
    const {
      start_time,
      end_time,
      is_confirmed,
      instructor,
      duration,
      title,
    } = sessionFields;
    switch (editSelection) {
      case EDIT_CURRENT_SESSION: {
        const patchedSession = {
          start_datetime: start_time.toISOString(),
          end_datetime: end_time.toISOString(),
          is_confirmed,
          instructor: instructor.value,
          duration,
          title,
        };
        api.patchSession(session.id, patchedSession);
        break;
      }
      case EDIT_ALL_SESSIONS: {
        const patchedCourse = {
          course_category: sessionFields.category.value,
          subject: sessionFields.title,
          start_time: start_time.toLocaleString("eng-US", timeFormat),
          end_time: end_time.toLocaleString("eng-US", timeFormat),
          instructor: instructor.value,
          is_confirmed,
          start_date: start_time.toLocaleString("sv-SE", dateFormat),
          end_date: course.schedule.end_date.toLocaleString(
            "sv-SE",
            dateFormat
          ),
        };
        api.patchCourse(course.course_id, patchedCourse);
      }
      // no default
    }
    history.push("/scheduler/");
  };



  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Typography>There's been an error!</Typography>;
  }

  console.log(data);

  const courseDurationOptions = [1, 1.5, 2, 0.5];

//   const { course, endDatetime, id, startDatetime, title } = data.session;
  const course = data.session.course
//   const {
//     courseCategory,
//     dayOfWeek,
//     endTime,
//     enrollmentSet,
//     courseId,
//     instructor,
//     room,
//     startTime,
//   } = course;

  const session = data.session;
  
  const editSelection = "no";


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
            <Grid item xs={6}>
              <Typography variant="h5"> Room</Typography>
              <TextField value={sessionFields.room} />
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
            {editSelection === EDIT_CURRENT_SESSION && (
              <Grid item xs={6}>
                <Typography variant="h5"> Date</Typography>
                <DatePicker
                  inputVariant="outlined"
                  onChange={handleDateTimeChange}
                  value={sessionFields.start_time}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <Typography variant="h5"> Start Time</Typography>
              <TimePicker
                inputVariant="outlined"
                onChange={handleDateTimeChange}
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
              <InstructorConflictCheck
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
              >
                <Grid item md={6}>
                  <Button
                    className="button"
                    color="secondary"
                    variant="outlined"
                  >
                    Save
                  </Button>
                </Grid>
              </InstructorConflictCheck>
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
