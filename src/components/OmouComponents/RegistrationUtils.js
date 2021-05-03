import * as moment from 'moment';
import { arraysMatch, USER_TYPES } from '../../utils';
import { useSelector } from 'react-redux';

export const createTutoringDetails = (courseType, formData) => ({
    title: formData.tutoring_details.course,
    instructor: formData.tutoring_details.instructor.value,
    startDate: moment(formData.tutoring_details.startDate, 'DD-MM-YYYY'),
    endDate: moment(
        new Date(formData.tutoring_details.startDate),
        'DD-MM-YYYY'
    ).add(formData.sessions, 'weeks'),
    startTime: moment(formData.tutoring_details.startTime, 'hh:mm'),
    endTime: moment(new Date(formData.tutoring_details.endTime), 'hh:mm').add(
        formData.duration,
        'hours'
    ),
    courseType,
});

export const mapRegistrationInfo = (student, course) => ({
    course: {
        id: typeof course === 'string' && course,
        ...(typeof course !== 'string' && course),
    },
    student: student,
    numSessions: 0,
    status: 'REGISTERING',
});

const saveRegistration = (student, course, registrationState) => {
    const newRegistrationInfo = mapRegistrationInfo(student, course);
    const existingStudentRegistration = registrationState?.[student] || [];
    const newRegistrationState = {
        ...registrationState,
        [student]: [...existingStudentRegistration, newRegistrationInfo],
    };
    sessionStorage.setItem(
        'registrations',
        JSON.stringify(newRegistrationState)
    );
    return newRegistrationState;
};

/**
 * @description this will save a registration to session storage, so it will appear in our checkout
 * @param: student - this is the studentID
 * @param: course - this is either a courseID or a course object if this is a tutoring course
 * */
export const submitRegistration = (student, course) => {
    const registrationState = JSON.parse(
        sessionStorage.getItem('registrations')
    );
    const existingEnrollmentsByStudents = Object.entries(
        registrationState
    ).map(([studentID, studentRegistrations]) =>
        Array.isArray(studentRegistrations)
            ? studentRegistrations.map((registration) => [
                  studentID,
                  registration.course.id,
              ])
            : []
    );
    const isEnrolled = existingEnrollmentsByStudents
        .map((studentEnrollments) =>
            studentEnrollments.filter((enrollment) =>
                arraysMatch(enrollment, [student, course])
            )
        )
        .some((studentEnrollments) => studentEnrollments.length > 0);
    if (!isEnrolled) {
        return saveRegistration(student, course, registrationState);
    }
    return registrationState;
};

/**
 * @description this will remove a registration from session storage
 * */
export const removeRegistration = (student, course) => {
    const registrationState = JSON.parse(
        sessionStorage.getItem('registrations')
    );
    const indexOfRegistration = registrationState[student]
        .map(({ course }) => course)
        .indexOf(course);

    registrationState[student].splice(indexOfRegistration, 1);

    sessionStorage.setItem(
        'registrations',
        JSON.stringify({
            ...registrationState,
            [student]: registrationState[student],
        })
    );

    return {
        ...registrationState,
        [student]: registrationState[student],
    };
};

/**
 * @description returns boolean of if the current logged in user is the parent registering
 * */
export const useValidateRegisteringParent = () => {
    const AuthUser = useSelector(({ auth }) => auth);
    const { currentParent } = getRegistrationCart();
    return {
        parentIsLoggedIn:
            AuthUser?.user.id == currentParent?.user.id ||
            AuthUser.accountType === USER_TYPES.parent,
    };
};

/**
 * @description this will close and clear out the registration cart including the registering parent
 * */
export const closeRegistrationCart = (AuthParent) => {
    if (AuthParent) {
        let registrationState = JSON.parse(
            sessionStorage.getItem('registrations')
        );
        Object.entries(registrationState).forEach(([key]) => {
            if (key !== 'currentParent') {
                delete registrationState[key];
            }
        });
        sessionStorage.setItem(
            'registrations',
            JSON.stringify(registrationState)
        );
    } else {
        sessionStorage.setItem('registrations', '{}');
    }
};

/**
 * @description return the registration object from session storage
 * */
export const getRegistrationCart = () => {
    const registrationState = JSON.parse(
        sessionStorage.getItem('registrations')
    );
    if (typeof registrationState !== 'object' || !registrationState)
        return { currentParent: null };
    if (Object.keys(registrationState).length > 0) return registrationState;
    return { currentParent: null };
};

/**
 * @description sets the registering parent to sessionStorage
 * */
export const setParentRegistrationCart = (parent) =>
    sessionStorage.setItem(
        'registrations',
        JSON.stringify({
            currentParent: parent,
        })
    );

/**
 * @description loads passed in registration cart to registration state in session storage
 * */
export const loadRegistrationCart = (prevRegistration) => {
    const registrationState = JSON.parse(
        sessionStorage.getItem('registrations')
    );
    sessionStorage.setItem(
        'registrations',
        JSON.stringify({
            ...registrationState,
            ...prevRegistration,
        })
    );
    return {
        ...registrationState,
        ...prevRegistration,
    };
};
