import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import BackArrow from "@material-ui/icons/ArrowBack";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./registration.scss";
import * as hooks from "actions/hooks";
import * as registrationActions from "actions/registrationActions";
import {dateParser, weeklySessionsParser} from "components/Form/FormUtils";
import Payment from "./RegistrationCartPayment";
import Moment from "react-moment"

const RegistrationCart = () => {
  const dispatch = useDispatch();
  const CurrentParent = useSelector(
	  ({Registration}) => Registration.CurrentParent
  );
  const registered_courses =
	  useSelector(({Registration}) => Registration.registered_courses) || {};
	const studentAccounts = useSelector(({Users}) => Users.StudentList);
	const courseList = useSelector(({Course}) => Course.NewCourseList);
	const enrollments = useSelector(({Enrollments}) => Enrollments);

  const [selectedCourses, setSelectedCourses] = useState({});
  const [updatedCourses, setUpdatedCourse] = useState([]);

	useEffect(() => {
		dispatch(registrationActions.initializeRegistration());
	}, [dispatch]);

  const courseIDs = useMemo(
	  () => {
		  if (Object.values(registered_courses).length > 0) {
			  return Object.values(registered_courses)
				  .flat()
				  .map(({course_id}) => course_id)
		  }
	  },
	  [registered_courses]
  );
  const studentIDs = useMemo(() => Object.keys(registered_courses), [
    registered_courses,
  ]);

  const coursesStatus = hooks.useCourse(courseIDs);
  const studentsStatus = hooks.useStudent(studentIDs);
  registrationActions.useEnrollmentsByStudent(studentIDs);

  useEffect(() => {
    if (registered_courses) {
      setSelectedCourses(
		  studentIDs.reduce(
			  (studentsList, studentID) => ({
				  ...studentsList,
				  [studentID]: registered_courses[studentID]
					  .filter(({course_id}) => course_id)
					  .reduce(
						  (studentCourses, {course_id, sessions}) => ({
							  ...studentCourses,
							  [course_id]: {
								  checked: false,
								  sessions,
								  validated: true,
							  },
						  }),
						  {}
					  ),
			  }),
			  {}
		  )
      );
    }
  }, [registered_courses, studentIDs]);

  useEffect(() => {
    if (registered_courses && CurrentParent) {
      sessionStorage.setItem(
		  "registered_courses",
		  JSON.stringify(registered_courses)
      );
      sessionStorage.setItem("CurrentParent", JSON.stringify(CurrentParent));
    }
  }, [CurrentParent, registered_courses]);

  const handleCourseSelect = useCallback(
	  (studentID, courseID) => () => {
		  setSelectedCourses((prevCourses) => {
			  const newCourses = JSON.parse(JSON.stringify(prevCourses));
			  newCourses[studentID][courseID] = {
				  ...newCourses[studentID][courseID],
				  checked: !newCourses[studentID][courseID].checked,
			  };
			  return newCourses;
		  });
	  },
	  []
  );

  const handleCourseSessionsChange = useCallback(
	  (studentID, courseID) => ({target}) => {
		  let {value} = target;
		  if (value && !isNaN(value)) {
			  value = Number(value);
		  }
		  const enrollment =
			  enrollments[studentID] && enrollments[studentID][courseID];
		  const paidSessions = enrollment ? enrollment.sessions_left : 0;

		  setUpdatedCourse((prevCourses) => {
			  const courseIndex = registered_courses[studentID].findIndex(
				  ({course_id}) => courseID == course_id
			  );
			  const course = courseList[courseID];
			  const newOne = {
				  ...registered_courses[studentID][courseIndex],
				  isNew: !course,
				  sessions: value,
			  };
			  if (!(course && course.course_type === "class")) {
				  const it = registered_courses[studentID][courseIndex];
				  if (!it.new_course) {
					  it.new_course = JSON.parse(JSON.stringify(course));
				  }

				  let finalVal = value;
				  if (course) {
					  finalVal += weeklySessionsParser(
						  course.schedule.start_date,
						  course.schedule.end_date
					  );
				  }

				  newOne.new_course = {
					  ...it.new_course,
					  schedule: {
						  ...it.new_course.schedule,
						  // calculates appropriate date and formats it
						  end_date: dateParser(
							  new Date(it.new_course.schedule.start_date).getTime() +
							  7 * 24 * 60 * 60 * 1000 * (finalVal - 1) +
							  24 * 60 * 60 * 1000
						  ),
					  },
				  };
			  }
			  return [...prevCourses, newOne];
		  });

		  setSelectedCourses((prevCourses) => {
			  const updated = JSON.parse(JSON.stringify(prevCourses));
			  const course = courseList[courseID];
			  updated[studentID][courseID] = {
				  ...updated[studentID][courseID],
				  sessions: value,
			  };
			  if (course && course.course_type === "class") {
				  const {start_date, end_date} = course.schedule;
				  const numSessions = weeklySessionsParser(start_date, end_date);
				  updated[studentID][courseID] = {
					  ...updated[studentID][courseID],
					  validated:
						  Number.isInteger(value) &&
						  0 <= value &&
						  value <= numSessions - paidSessions + 1,
				  };
			  }
			  return updated;
		  });
	  },
	  [registered_courses, enrollments, courseList]
  );

  if (hooks.isLoading(coursesStatus) || hooks.isLoading(studentsStatus)) {
	  return <Loading/>;
  }

  const studentRegistrations = Object.keys(registered_courses).map(
	  (student_id) =>
		  studentAccounts[student_id] && (
			  <Grid className="student-cart-wrapper" container>
				  <Grid item xs={12}>
					  <Typography align="left" gutterBottom variant="h5">
						  {studentAccounts[student_id].name}
					  </Typography>
				  </Grid>
				  <Grid className="accounts-table-heading" container item xs={12}>
					  <Grid item xs={1}/>
					  <Grid item xs={3}>
						  <Typography align="left" className="cart-header">
							  Course
						  </Typography>
					  </Grid>
					  <Grid item xs={3}>
						  <Typography align="left" className="cart-header">
							  Dates
						  </Typography>
					  </Grid>
					  <Grid item xs={1}>
						  <Typography align="center" className="cart-header">
							  Sessions
						  </Typography>
					  </Grid>
					  <Grid item xs={2}>
						  <Typography align="center" className="cart-header">
							  Tuition
						  </Typography>
					  </Grid>
					  <Grid item xs={2}>
						  <Typography align="center" className="cart-header">
							  Material Fee
						  </Typography>
					  </Grid>
				  </Grid>
				  <Grid container item xs={12}>
					  {registered_courses[student_id]
						  .filter(
							  ({new_course, course_id}) =>
								  new_course || courseList[course_id]
						  )
						  .map(({new_course, course_id}) => {
							  const course = new_course || courseList[course_id];
							  const {checked, sessions, validated} = selectedCourses[
								  student_id
								  ][course_id];

                        return (
                            <Grid item key={course.course_id} xs={12}>
                              <Grid
                                  alignItems="center"
                                  component={Paper}
                                  container
                                  square
                              >
                                <Grid item xs={1}>
                                  <Checkbox
                                      checked={checked}
                                      onChange={handleCourseSelect(student_id, course_id)}
                                  />
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography align="left">{course.title}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography align="left">
									  <Moment
										  date={course.schedule.start_date}
										  format="MMM d, YYYY"
									  />
									  {" - "}
									  <Moment
										  date={course.schedule.end_date}
										  format="MMM d, YYYY"
									  />
                                  </Typography>
                                </Grid>
                                <Grid item xs={1}>
                                  {!checked ? (
                                      <Typography align="center">{sessions}</Typography>
                                  ) : (
                                      <TextField
                                          error={!validated}
                                          id="outlined-number"
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          label="Quantity"
                                          margin="normal"
                                          onChange={handleCourseSessionsChange(
                                              student_id,
                                              course_id
                                          )}
                                          type="number"
                                          value={sessions}
                                          variant="outlined"
                                      />
                                  )}
                                </Grid>
                                <Grid item xs={2}>
                                  <Typography align="center">{course.tuition}</Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                        );
                      })}
                </Grid>
              </Grid>
          )
  );

  const selectedCourseOptions = () => {
    let displaySelectionOptions = 0;
    let selectedCourseID = -1,
		selectedStudentID = -1;
    Object.keys(selectedCourses).forEach((studentID) => {
      for (const [courseID, checkbox] of Object.entries(
		  selectedCourses[studentID]
      )) {
        if (checkbox.checked) {
          displaySelectionOptions++;
          selectedCourseID = courseID;
          selectedStudentID = studentID;
        }
      }
    });
    if (selectedCourseID !== -1) {
      return (
		  <Payment
			  isOneCourse={displaySelectionOptions === 1}
			  selectedCourseID={selectedCourseID}
			  selectedCourses={selectedCourses}
			  selectedStudentID={selectedStudentID}
			  updatedCourses={updatedCourses}
		  />
      );
    }
    return null;
  };

  return (
	  <form>
		  <Paper className="registration-cart paper">
			  <Grid container layout="row" spacing={1}>
				  <Grid item xs={12}>
					  <Grid container>
						  <Grid item={3}>
							  <Button className="button" component={Link} to="/registration">
								  <BackArrow/>
								  Register
							  </Button>
						  </Grid>
					  </Grid>
					  <hr/>
				  </Grid>
				  <Grid item xs={12}>
					  <Typography align="left" variant="h3">
						  Select Course(s)
					  </Typography>
				  </Grid>
				  <Grid item xs={12}>
					  {studentRegistrations}
				  </Grid>
				  <Grid item xs={12}>
					  {selectedCourseOptions()}
				  </Grid>
			  </Grid>
		  </Paper>
	  </form>
  );
};

export default RegistrationCart;
