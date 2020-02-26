import * as types from "./actionTypes";
import {instance, MISC_FAIL, REQUEST_STARTED} from "./apiActions";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

const enrollmentEndpoint = "/course/enrollment/";
const courseEndpoint = "/course/catalog/";
const paymentEndpoint = "/payment/payment/";

export const useSubmitRegistration = (registrationDependencies) => {
    const token = useSelector(({auth}) => auth.token);
    const currentPayingParent = useSelector(({Registration}) => Registration.CurrentParent);
    const [status, setStatus] = useState(null);
    const dispatch = useDispatch();

    const handleError = useCallback((error) => {
        if (error && error.response && error.response.status) {
            setStatus(error.response.status);
        } else {
            setStatus(MISC_FAIL);
            console.error(error);
        }
    }, []);

    const requestSettings = useMemo(() => ({
        "headers": {
            "Authorization": `Token ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const aborted = false;
        (async () => {
            if (registrationDependencies) {
                console.log(registrationDependencies)
                let {tutoringRegistrations, classRegistrations, payment} = registrationDependencies;
                console.log(tutoringRegistrations)
                const newTutorings = tutoringRegistrations.filter(({courseID}) => String(courseID).indexOf("T") > -1);
                const existingTutorings = tutoringRegistrations.filter(({courseID}) => String(courseID).indexOf("T") === "-1");
                tutoringRegistrations = [...newTutorings, ...existingTutorings];
                console.log({tutoringRegistrations, existingTutorings, newTutorings});
                // try {
                    // const newTutorings = tutoringRegistrations.filter(({courseID}) => StrigngcourseID.indexOf("T") > -1);
                    // const existingTutorings = tutoringRegistrations.filter(({courseID}) => courseID.indexOf("T") === "-1");
                    console.log({tutoringRegistrations, existingTutorings, newTutorings});
                    // throw "up";
                    const TutoringCourses = [
                        ...(await Promise.all(
                            newTutorings.map(({newTutoringCourse}) =>
                                instance.post(courseEndpoint, newTutoringCourse, requestSettings))
                        )),
                        ...(await Promise.all(
                            existingTutorings.map(({newTutoringCourse, courseID}) =>
                                instance.patch(`${courseEndpoint}${courseID}`, newTutoringCourse, requestSettings))
                        )),
                    ];
                console.log(tutoringRegistrations)
                    dispatch({
                        "payload": TutoringCourses,
                        "type": types.POST_COURSE_SUCCESSFUL,
                    });
                const tutoringEnrollments = tutoringRegistrations.map((tutoringReg, i) => {
                    console.log(tutoringReg, i);
                    return ({
                        "course": TutoringCourses[i].data.id,
                        "student": tutoringReg.student,
                    })
                });
                    // get existing enrollments involving the given student-course pairs
                    let currEnrollments = await Promise.all(
                        classRegistrations.map(({student, course}) => instance.get(
                            `/course/enrollment/?student=${student}&course_id=${course}`,
                            requestSettings
                        ))
                    );
                            console.log('midway')
                    // filter for the ones that found matches
                    currEnrollments = currEnrollments
                        .map((elem) => elem.data)
                        .filter((data) => data && data.length > 0)
                        .map((data) => data[0]);

                    // set enrollment attribute appropriately
                    classRegistrations = classRegistrations.map((reg) => {
                        const matchingEnrollment = currEnrollments
                            .find(({student, course}) =>
                                `${student}` === `${reg.student}` &&
                                `${course}` === `${reg.course}`);
                        return {
                            ...reg,
                            // true if matching enrollment
                            "enrollment": matchingEnrollment ? matchingEnrollment.id : null,
                        };
                    });

                    // remove existing enrollments
                    const courseEnrollments = classRegistrations
                        .filter((classReg) => !classReg.enrollment)
                        .map(({course, student}) => ({
                            course,
                            student,
                        }))
                        .concat(tutoringEnrollments);

                    const Enrollments = await Promise.all(
                        courseEnrollments.map((enrollment) =>
                            instance.post(enrollmentEndpoint, enrollment, requestSettings))
                    );
                    dispatch({
                        "type": types.POST_ENROLLMENT_SUCCESS,
                        "payload": Enrollments,
                    });
                    const enrollmentSessions = (index) => {
                        if (index < classRegistrations.length) {
                            return classRegistrations[index].sessions;
                        }
                        return tutoringRegistrations[index - classRegistrations.length].sessions;
                    };

                    // Add back in filtered out existing enrollments
                    const previouslyEnrolledCourses = classRegistrations
                        .filter((classReg) => classReg.enrollment);

                    const registrations = Enrollments
                        .map((enrollment, i) =>
                            ({
                                "enrollment": enrollment.data.id,
                                "num_sessions": enrollmentSessions(i),
                            }))
                        .concat(
                            previouslyEnrolledCourses.map(({enrollment, sessions}) => ({
                                enrollment,
                                "num_sessions": sessions,
                            }))
                        );

                    const finalPayment = await instance.post(paymentEndpoint,
                        {
                            ...payment,
                            registrations,
                            "parent": currentPayingParent.user.id,
                        }, requestSettings);
                    dispatch({
                        "payload": finalPayment,
                        "type": types.POST_PAYMENT_SUCCESS,
                    });
                    setStatus({
                        "paymentID": finalPayment.data.id,
                        "status": finalPayment.status,
                    });
                try{
                } catch (error) {
                    if (!aborted) {
                        handleError(error);
                    }
                }
            }
        })();

    }, []);
    return status;
};

export const usePayment = (id) => {
    const token = useSelector(({auth}) => auth.token);
    const [status, setStatus] = useState(null);
    const dispatch = useDispatch();

    const handleError = useCallback((error) => {
        if (error && error.response && error.response.status) {
            setStatus(error.response.status);
        } else {
            setStatus(MISC_FAIL);
            console.error(error);
        }
    }, []);

    const requestSettings = useMemo(() => ({
        "headers": {
            "Authorization": `Token ${token}`,
        },
    }), [token]);

    useEffect(() => {
        const aborted = false;
        if (id) {
            (async () => {
                try {
                    setStatus(REQUEST_STARTED);
                    const Payment = await instance.request({
                        "url": `${paymentEndpoint}${id}/`,
                        ...requestSettings,
                        "method": "get",
                    });
                    Payment.type = "parent";

                    dispatch({
                        "type": types.GET_PAYMENT_SUCCESS,
                        "payload": Payment,
                    });
                    const ParentResponse = await instance.request({
                        "url": `/account/parent/${Payment.data.parent}/`,
                        ...requestSettings,
                        "method": "get",
                    });
                    dispatch({
                        "type": types.FETCH_PARENT_SUCCESSFUL,
                        "payload": ParentResponse,
                    });

                    const studentIDs = Payment.data.registrations.map((registration) => registration.enrollment_details.student);

                    // get students
                    const uniqueStudentIDs = [...new Set(studentIDs)];
                    const StudentResponses = await Promise.all(uniqueStudentIDs.map((studentID) =>
                        instance.request({
                            "url": `/account/student/${studentID.toString()}/`,
                            ...requestSettings,
                            "method": "get",
                        })));
                    StudentResponses.forEach((studentResponse) => {
                        dispatch({"type": types.FETCH_STUDENT_SUCCESSFUL,
                            "payload": studentResponse});
                    });
                    // get courses
                    const courseIDs = Payment.data.registrations.map((registration) => registration.enrollment_details.course);
                    const uniqueCourseIDs = [...new Set(courseIDs)];
                    const CourseResponses = await Promise.all(uniqueCourseIDs.map((courseID) =>
                        instance.request({
                            "url": `/course/catalog/${courseID}/`,
                            ...requestSettings,
                            "method": "get",
                        })));
                    CourseResponses.forEach((courseResponse) => {
                        dispatch({"type": types.FETCH_COURSE_SUCCESSFUL,
                            "payload": courseResponse});
                    });
                    setStatus(200);
                } catch (error) {
                    if (!aborted) {
                        handleError(error);
                    }
                }
            })();
        }
    }, [dispatch, handleError, id, requestSettings]);
    return status;
};

export const useCourseSearch = (query) => {
    const token = useSelector(({auth}) => auth.token);
    const [status, setStatus] = useState(null);
    const dispatch = useDispatch();

    const handleError = useCallback((error) => {
        if (error && error.response && error.response.status) {
            setStatus(error.response.status);
        } else {
            setStatus(MISC_FAIL);
            console.error(error);
        }
    }, []);

    const requestSettings = useMemo(() => ({
        "headers": {
            "Authorization": `Token ${token}`,
        },
        "params": {
            query,
        },
    }), [query, token]);

    useEffect(() => {
        if (typeof query !== "undefined") {
            (async () => {
                const aborted = false;
                try {
                    setStatus(REQUEST_STARTED);
                    const courseSearchResults = await instance.request({
                        "url": "/search/course/",
                        ...requestSettings,
                        "method": "get",
                    });
                    dispatch({
                        "type": types.GET_COURSE_SEARCH_QUERY_SUCCESS,
                        "payload": courseSearchResults,
                    });
                    const instructors = courseSearchResults.map(({data}) => data.instructor);

                    const instructorResults = await Promise.all(instructors.map((instructorID) => {
                        instance.request({
                            "url": `/account/instructor/${instructorID}/`,
                            "headers": {
                                "Authorization": `Token ${token}`,
                            },
                            "method": "get",
                        });
                    }));
                    dispatch({
                        "type": types.FETCH_INSTRUCTOR_SUCCESSFUL,
                        "payload": instructorResults,
                    });
                    setStatus(200);
                } catch (error) {
                    if (!aborted) {
                        handleError(error);
                    }
                }
            })();
        }
    }, [query, dispatch, requestSettings, token, handleError]);

    return status;
};
