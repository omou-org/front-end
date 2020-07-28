import * as moment from "moment";
import {arraysMatch} from "../../utils";

export const createTutoringDetails = (courseType, formData) => ({
	title: formData.tutoring_details.course,
	instructor: formData.tutoring_details.instructor.value,
	startDate: moment(formData.tutoring_details.startDate, "DD-MM-YYYY"),
	endDate: moment(new Date(formData.tutoring_details.startDate), "DD-MM-YYYY").add(formData.sessions, 'weeks'),
	startTime: moment(formData.tutoring_details.startTime, "hh:mm"),
	endTime: moment(new Date(formData.tutoring_details.endTime), "hh:mm").add(formData.duration, 'hours'),
	courseType,
});

const mapRegistrationInfo = (student, course) => ({
	course: {
		id: typeof course === "string" && course,
		...(typeof course !== "string" && course),
	},
	student: student,
	numSessions: 0,
	status: "REGISTERING"
});

const saveRegistration = (student, course, registrationState) => {
	const newRegistrationInfo = mapRegistrationInfo(student, course);
	const existingStudentRegistration = registrationState?.[student] || [];
	const newRegistrationState = {
		...registrationState,
		[student]: [...existingStudentRegistration, newRegistrationInfo],
	};
	sessionStorage.setItem("registrations", JSON.stringify(newRegistrationState));
};

/**
 * @description this will save a registration to session storage, so it will appear in our checkout
 * @param: student - this is the studentID
 * @param: course - this is either a courseID or a course object if this is a tutoring course
 * */
export const submitRegistration = (student, course) => {
	const registrationState = JSON.parse(sessionStorage.getItem("registrations"));
	const existingEnrollmentsByStudents = Object.entries(registrationState)
		.map(([studentID, studentRegistrations]) =>
			Array.isArray(studentRegistrations) ? studentRegistrations
				.map(registration => [studentID, registration.course.existing_id]) : []
		);
	const isEnrolled = existingEnrollmentsByStudents.map(studentEnrollments =>
		studentEnrollments.filter((enrollment) => arraysMatch(enrollment, [student, course])))
		.some(studentEnrollments => studentEnrollments.length > 0);
	if (!isEnrolled) {
		saveRegistration(student, course, registrationState);
	}
};

/**
 * @description this will close and clear out the registration cart including the registering parent
 * */
export const closeRegistrationCart = () => {
	sessionStorage.setItem("registrations", "{}");
};

/**
 * @description return the registration object from session storage
 * */
export const getRegistrationCart = () => {
	const registrationState = JSON.parse(sessionStorage.getItem("registrations"));
	if (typeof registrationState !== "object" || !registrationState) return {currentParent: null};
	if (Object.keys(registrationState).length > 0) return registrationState;
	return {currentParent: null};
};

/**
 * @description sets the registering parent to sessionStorage
 * */
export const setParentRegistrationCart = (parent) => sessionStorage.setItem("registrations", JSON.stringify({
	currentParent: parent,
}));