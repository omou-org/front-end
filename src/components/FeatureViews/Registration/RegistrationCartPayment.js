import React, {useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import PriceQuoteForm from "components/Form/PriceQuoteForm";

import "./registration.scss";
import * as registrationActions from "actions/registrationActions";
import {durationParser, isExistingTutoring} from "utils";

const Payment = ({
					 isOneCourse,
					 selectedStudentID,
					 selectedCourseID,
					 selectedCourses,
					 updatedCourses,
				 }) => {
	const dispatch = useDispatch();
	const registered_courses =
		useSelector(({Registration}) => Registration.registered_courses) || {};
	const selectedRegistration = registered_courses[selectedStudentID].find(
		({course_id}) => course_id == selectedCourseID
	);
	const courseList = useSelector(({Course}) => Course.NewCourseList);
	const isSmallGroup =
		isExistingTutoring(selectedCourseID) &&
		courseList[selectedCourseID].capacity < 5;
	const {form, course_id} = selectedRegistration;
	const formType = form ? form.form : "class";

	const allValid = useMemo(
		() =>
			Object.values(selectedCourses)
        .reduce((list, vals) => list.concat(Object.values(vals)), [])
				.every(({validated}) => validated),
		[selectedCourses]
	);

	const updateQuantity = useCallback(() => {
		updatedCourses.forEach((updatedCourse) => {
			dispatch(registrationActions.editRegistration(updatedCourse));
		});
	}, [dispatch, updatedCourses]);

	const selectedCoursesHaveSession = () => {
		let haveSession = true;
		Object.values(selectedCourses).forEach((student) => {
			Object.values(student).forEach((course) => {
				if (course.checked && course.sessions < 1) {
					haveSession = false;
				}
			});
		});
		return haveSession;
	};

	// determines if there's been an update
	// to the number of sessions to checkout for any course
	const selectedCourseSameAsRedux = () => {
		// go to each selectedCourses
		// get selectedCourse from registered_courses
		// compare if both sessions are equal
		let sameSessions = true;
		Object.entries(selectedCourses).forEach(([studentID, studentVal]) => {
			Object.entries(studentVal).forEach(([courseID, courseVal]) => {
				const reduxCourse = registered_courses[studentID].find(
					({course_id}) => course_id == courseID
				);
				if (reduxCourse.sessions !== courseVal.sessions) {
					sameSessions = false;
				}
			});
		});
		return sameSessions;
	};

	// generate registered course object split by class and tutoring
	const registeredCourses = () => {
		const courses = {
			courses: [],
			tutoring: [],
		};
		Object.entries(selectedCourses).forEach(([studentID, studentVal]) => {
			Object.entries(studentVal).forEach(([courseID, courseVal]) => {
				if (courseVal.checked) {
					const course = registered_courses[studentID].find(
						({course_id}) => course_id == courseID
					);
					if (courseID.indexOf("T") > -1) {
						// {category, academic_level, sessions, form}
						const {category, academic_level, form} = course;
						const new_course = course.new_course || {};
						courses.tutoring.push({
							academic_level: academic_level || new_course.academic_level,
							category_id: category || new_course.category,
							courseID: course.course_id,
							duration: durationParser[form.Schedule && form.Schedule.Duration],
							new_course,
							sessions: courseVal.sessions,
							student_id: studentID,
						});
					} else {
						courses.courses.push({
							course_id: courseID,
							enrollment: course && course.form.Enrollment,
							sessions: courseVal.sessions,
							student_id: studentID,
						});
					}
				}
			});
		});
		return courses;
	};

	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Grid container justify="flex-end" spacing={2}>
					<Grid item xs={6}/>
					{isOneCourse && (
						<>
							<Grid item>
								{isSmallGroup && (
									<Button
										className="button"
										component={Link}
										to={`/registration/form/course_details/${selectedCourseID}/edit`}
									>
										Edit Group Course
									</Button>
								)}
							</Grid>
							<Grid item>
								<Button
									className="button"
									component={Link}
									to={`/registration/form/${formType}/${selectedStudentID}+${course_id}/edit`}
								>
									Edit Registration
								</Button>
							</Grid>
						</>
					)}
					<Grid item>
						<Grid container justify="flex-end">
							{!selectedCourseSameAsRedux() && (
								<Button
									className="button"
									disabled={!allValid}
									onClick={updateQuantity}
								>
									UPDATE SESSIONS
								</Button>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<PriceQuoteForm
					courses={registeredCourses().courses}
					disablePay={
						!(selectedCoursesHaveSession() && selectedCourseSameAsRedux())
					}
					tutoring={registeredCourses().tutoring}
				/>
			</Grid>
		</Grid>
	);
};

export default Payment;
