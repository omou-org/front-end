import React, { useEffect, useMemo, useState } from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {
  useHistory,
  useLocation,
  withRouter,
  useParams,
  NavLink
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

import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import FormControlLabel from "@material-ui/core/FormControlLabel";



import { dateFormat, timeFormat } from "../../../utils";
import InstructorConflictCheck from "components/OmouComponents/InstructorConflictCheck";
import BackButton from "../../OmouComponents/BackButton";
import "./scheduler.scss";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import { fullName } from "../../../utils";

import moment from "moment";

const EDIT_ALL_SESSIONS = "all";
const EDIT_CURRENT_SESSION = "current";

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

const UPDATE_SESSION = gql`
    mutation DanielsUpdateSession($sessionId: ID!, $title: String, $startDatetime: DateTime, $isConfirmed: Boolean, $instructor: ID, $endDatetime: DateTime) {
        createSession(id: $sessionId, title: $title, startDatetime: $startDatetime, isConfirmed: $isConfirmed, instructor: $instructor, endDatetime: $endDatetime) {
          session {
            id
            title
            startDatetime
            isConfirmed
            instructor {
              user {
                id
                firstName
                lastName
                email
              }
            }
            endDatetime
        }
        }
      }
    `;

    // const UPDATE_SESSION = gql`
    // mutation DanielsUpdateSession($sessionId: ID!, $title: String, $startDatetime: DateTime, $isConfirmed: Boolean, $instructor: ID, $endDatetime: DateTime) {
    //     createSession(id: $sessionId, title: $title, startDatetime: $startDatetime, isConfirmed: $isConfirmed, instructor: $instructor, endDatetime: $endDatetime) {
    //       startDatetime
    //       course {
    //         id
    //         isConfirmed
    //         dayOfWeek
    //         startTime
    //         endTime
    //         room
    //         courseCategory {
    //           id
    //           name
    //         }
    //         instructor {
    //           user {
    //             id
    //             firstName
    //             lastName
    //           }
    //           subjects {
    //             name
    //           }
    //         }
    //       }
    //       endDatetime
    //       title
    //       startDatetime
    //     }
    //   }
    // `;

    


 
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
    update: (cache, {data}) => {
      const existingSession = cache.readQuery({
        query: GET_SESSION,
        variables: { sessionId: session_id },
      }).session;

      cache.writeQuery({
        query: GET_SESSION,
        data: {
          session: [
            ...existingSession,
            ...data["updateSession"].session
          ],
        },
         variables: { sessionId: session_id },
      });
      // const newSession = data.createEnrollments.enrollments.map(enrollment => {
      //   return {
      //     course: enrollment.course.id,
      //     student: enrollment.student.user.id,
      //   }
      // });
      // newEnrollments.forEach(newEnrollment => {
      //   const matchingIndex = cachedCourses.findIndex((course) =>
      //     (course.id === newEnrollment.course));
      //   cachedCourses[matchingIndex] = {
      //     ...cachedCourses[matchingIndex],
      //     enrollmentSet: [...cachedCourses[matchingIndex].enrollmentSet,
      //       {student: newEnrollment.student, course: newEnrollment.course}],
      //   };
      // });

      // const newQueryEnrollments = data.createEnrollments.enrollments.map(enrollment => ({
      //     id: enrollment.id,
      //     course: {
      //       id: enrollment.course.id,
      //     }
      //   })
      // );

      // cache.writeQuery({
      //   query: GET_STUDENTS_AND_ENROLLMENTS,
      //   data: {
      //     userInfos,
      //     enrollments: [
      //       ...enrollments,
      //       ...newQueryEnrollments,
      //     ]
      //   }
      // })
    }
  });

  const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);
  const [edit, setEdit] = useState(false);
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
     console.log(event)
  };

  //Instructor
  const handleInstructorChange = (event) => {
    setSessionFields({
      ...sessionFields,
      instructor: event,
    });
    console.log(event)

  };

  //Updates room and Title
  const handleTextChange = (field) => (event) => {
    setSessionFields({
      ...sessionFields,
      [field]: event.target.value,
    });
    console.log(event.target.value)

  };

  //ANNA NOT WORKING
  const handleDateTimeChange = (date) => {
    const {end_time, duration} = sessionFields;
		if (date.end_time) {
		}
		end_time.setDate(date.getDate());
		end_time.setHours(date.getHours() + duration);
		end_time.setMinutes(date.getMinutes());

		setSessionFields({
			...sessionFields,
			start_time: date,
			end_time,
		});
  };

  const handleEditSelection = (event) => {
    setEditSelection(event.target.value);
};

//ANNA NOT WORKING
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

    console.log(event.target.value)
  };

  const onConfirmationChange = (event) => {
    setSessionFields({
      ...sessionFields,
      is_confirmed: event.target.value,
    });
    console.log(event.target.value)
  };

  const handleEditToggle = (cancel) => (event) => {
    event.preventDefault();
    if (!cancel && edit) {
        // if we're applying to edit session then toggle to edit view
        //ANNA NEED TO UPDATE THIS FUNCTION
        //This goes back to session view
        // handleToggleEditing(editSelection);
    } else {
        setEdit(!edit);
    }
};


  const setFromMigration = (response) => {

    if (location.state === undefined) {
      history.push(`/scheduler/view-session/${response.session.course.id}/${response.session.id}/${response.session.course.instructor.user.id}`);
    }
    console.log(location.state)

    setEditSelection(location.state)
    console.log(editSelection)
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
      start_time: response.session.startDatetime,
      end_time: response.session.endDatetime,
      room: response.session.course.room,
      duration: durationHours,
      title: response.session.title,
      is_confirmed: response.session.course.isConfirmed,
    });
  };

  //Add dialog box here of current or all
  const handleUpdateSession = () => {
    const {
      start_time,
      end_time,
      is_confirmed,
      instructor,
      duration,
      title,
    } = sessionFields;
    console.log("save click?")
    console.log(editSelection)
    switch (location.state.allOrCurrent) {
      case "current": {
        console.log("we get here to current")
        console.log(session_id)
        // const handleDeleteAnnouncement = async (id) => {
        //   const deletedAnnouncement = await deleteAnnouncement({
        //     variables: { id: id },
        //   });
        // };
        updateSession({
          variables: {sessionId: session_id, isConfirmed: is_confirmed,
            instructor: instructor.value, title: title},
          // startDatetime: start_time.toISOString(),
          // endDatetime: end_time.toISOString(),
          // sessionId: session_id,
          // isConfirmed: is_confirmed,
          // instructor: instructor.value,
          // duration,
          // title
        });
        // api.patchSession(session.id, patchedSession);
        break;
      }
      case "all": {
        console.log("we get here to all")
        // const patchedCourse = {
        //   course_category: sessionFields.category.value,
        //   subject: sessionFields.title,
        //   start_time: start_time.toLocaleString("eng-US", timeFormat),
        //   end_time: end_time.toLocaleString("eng-US", timeFormat),
        //   instructor: instructor.value,
        //   is_confirmed,
        //   start_date: start_time.toLocaleString("sv-SE", dateFormat),
        //   end_date: course.schedule.end_date.toLocaleString(
        //     "sv-SE",
        //     dateFormat
        //   ),
        // };
        // api.patchCourse(course.course_id, patchedCourse);
      }
      // no default
    }
    // history.push("/scheduler/");
  };

  // useEffect(() => {
  //   console.log(location.state)
  //   setEditSelection(location.state)
  //   console.log(editSelection)
  // });

  if (loading || categoriesLoading || instructorsLoading) {
    return <Loading />;
  }

  if (error || categoriesError|| instructorsError) {
    return <Typography>There's been an error!</Typography>;  
  }

  // console.log(data);
  // console.log(categoriesData)
  // console.log(instructorsData)

  const categoriesList = categoriesData.courseCategories.map(({ id, name }) => ({
    value: id,
    label: name,
  }));

  const instructorList = instructorsData.instructors.map(
    ( instructor) => (
      {
      value: instructor.user.id,
      label: `${fullName(instructor.user)} - ${instructor.user.email}`,
    })
  );

  

  const courseDurationOptions = [1, 1.5, 2, 0.5];

  //   const { course, endDatetime, id, startDatetime, title } = data.session;
  const course = data.session.course;
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

  // const editSelection = "no";
// console.log(location.state)
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
              <TextField 
              onChange={handleTextChange("room")}
              value={sessionFields.room} />
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
            {/* DANIEL HAVING TO HARD CODE THIS, I KNOW IT HAS TO DO WITH SCOPE AND ASYNC BUT CAN'T GET TO WORK */}
            {/* Help me update editSelection */}
            {location.state.allOrCurrent === "current" && (
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
                    // onClick={handleEditToggle(true)}
                  >
                    Save
                  </Button>
                </Grid>
                {/* Move back to sessionview and pass through import to = {state}
                Do a check to see if add/current is defined, if not redirect to session view page. it reads as undefined*/}
                {/* <Dialog aria-describedby="form-dialog-description"
                aria-labelledby="form-dialog-title"
                className="session-view-modal"
                fullWidth
                maxWidth="xs"
                onClose={handleEditToggle(true)}
                open={edit}>
                <DialogTitle id="form-dialog-title">Edit Session</DialogTitle>
                <Divider />
                <DialogContent>
                    <RadioGroup aria-label="delete"
                        name="delete"
                        onChange={handleEditSelection}
                        value={editSelection}>
                        <FormControlLabel control={<Radio color="primary" />}
                            label="This Session"
                            labelPlacement="end"
                            value={EDIT_CURRENT_SESSION} />
                        <FormControlLabel control={<Radio color="primary" />}
                            label="All Sessions"
                            labelPlacement="end"
                            value={EDIT_ALL_SESSIONS} />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={handleEditToggle(true)}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        // component={NavLink}
                        // to={{
                        //     "pathname": `/scheduler/edit-session/${course.course_id}/${session.id}/${instructor_id}/edit`
                        //     , "state": { course: course, session: session }
                        // }}>
                        >
                        Confirm to Edit
                    </Button>
                </DialogActions>
            </Dialog> */}
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
