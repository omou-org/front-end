import * as types from "./actionTypes";
import { instance, MISC_FAIL, REQUEST_STARTED} from "./apiActions";
import {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";


const enrollmentEndpoint = "/course/enrollment/";
const courseEndpoint = "/course/catalog/";
const paymentEndpoint = "/payment/payment/";

export const useSubmitRegistration = (registrationDependencies) => {
    const token = useSelector(({auth}) => auth.token);
    const currentPayingParent = useSelector((({Registration}) => Registration.CurrentParent));
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

    useEffect(()=>{
        let aborted = false;

        (async ()=> {
            if(typeof registrationDependencies !== "undefined"){
                const {tutoringRegistrations, classRegistrations, payment} = registrationDependencies;
                try {
                    const TutoringCourses = await Promise.all(tutoringRegistrations.map( ({newTutoringCourse}) =>
                        instance.request(
                            {
                                'url':courseEndpoint,
                                ...requestSettings,
                                'data': newTutoringCourse,
                                'method':'post',
                            }
                        )
                    ));
                    dispatch({
                        type: types.POST_COURSE_SUCCESSFUL,
                        payload: TutoringCourses,
                    });
                    const tutoringEnrollments = tutoringRegistrations.map((tutoringReg,i) =>
                        ({student: tutoringReg.student, course: TutoringCourses[i].data.id}));
                    // filter out classes were we're adding additional enrollments (there should be a valid enrollment id)
                    const courseEnrollments = classRegistrations
                        .filter( classReg => !classReg.enrollment)
                        .map( classReg => ({student: classReg.student, course: classReg.course}))
                            .concat(tutoringEnrollments);
                    console.log(courseEnrollments);

                    const Enrollments = await Promise.all(courseEnrollments.map(enrollment =>
                        instance.request(
                            {
                                'url':enrollmentEndpoint,
                                ...requestSettings,
                                'data':enrollment,
                                'method':'post',
                            }
                        )
                    ));
                    dispatch({
                        type: types.POST_ENROLLMENT_SUCCESS,
                        payload: Enrollments,
                    });

                    const enrollmentSessions = (index) => {
                        if(index < classRegistrations.length){
                            return classRegistrations[index].sessions;
                        } else {
                            return tutoringRegistrations[index-(classRegistrations.length)].sessions;
                        }
                    };

                    // Add back in filtered out existing enrollments
                    const previouslyEnrolledCourses = classRegistrations
                        .filter( classReg => classReg.enrollment);

                    let registrations = Enrollments.map((enrollment, i) =>
                        ({ enrollment:enrollment.data.id, num_sessions: enrollmentSessions(i)})
                    );

                    previouslyEnrolledCourses.forEach(({enrollment, sessions}) => {
                       registrations.push({enrollment: enrollment, num_sessions: sessions});
                    });

                    const finalPayment = await instance.request({
                        'url': paymentEndpoint,
                        ...requestSettings,
                        'data':{
                            ...payment,
                            registrations: registrations,
                            parent: currentPayingParent.user.id,
                        },
                        'method':'post',
                    });
                    dispatch({
                        type: types.POST_PAYMENT_SUCCESS,
                        payload: finalPayment,
                    });

                    setStatus({status:finalPayment.status, paymentID:finalPayment.data.id});
                } catch (error){
                    if(!aborted){
                        handleError(error)
                    }
                }
            }
        })();

    },[dispatch, requestSettings, registrationDependencies]);
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

    useEffect(()=>{
        let aborted = false;

        (async ()=>{
           try {

                setStatus(REQUEST_STARTED);
               const Payment = await instance.request({
                   'url': `${paymentEndpoint}${id}/`,
                   ...requestSettings,
                   'method':'get',
               });

               dispatch({
                   type: types.GET_PAYMENT_SUCCESS,
                   payload: Payment,
               });
               const ParentResponse = await instance.request({
                   "url":`/account/parent/${Payment.data.parent}/`,
                   ...requestSettings,
                   "method":"get",
               });
               console.log(ParentResponse);
               dispatch({
                   type: types.FETCH_PARENT_SUCCESSFUL,
                   payload: ParentResponse,
               });

               const enrollments = Payment.data.enrollments;
               // get students
               const uniqueStudentIDs = [...new Set(enrollments.map(enrollment => enrollment.student))];
               const StudentResponses = await Promise.all(uniqueStudentIDs.map( studentID =>
                   instance.request({
                       'url':`/account/student/${studentID.toString()}/`,
                       ...requestSettings,
                       'method':'get',
                   })
               ));
               StudentResponses.forEach(studentResponse => {
                       dispatch({type: types.FETCH_STUDENT_SUCCESSFUL, payload: studentResponse})
               });

               // get courses
               const uniqueCourseIDs = [...new Set(enrollments.map(enrollment => enrollment.course))];
               const CourseResponses = await Promise.all(uniqueCourseIDs.map( courseID =>
                    instance.request({
                        "url": `/course/catalog/${courseID}/`,
                        ...requestSettings,
                        'method':'get',
                    })
               ));
               CourseResponses.forEach(courseResponse=> {
                       dispatch({type:types.FETCH_COURSE_SUCCESSFUL, payload: courseResponse})
               });
               setStatus(200);
           } catch (error){
               if(!aborted){
                   handleError(error)
               }
           }
        })();
    },[dispatch, requestSettings]);
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
        "params":{
            "query": query,
        }
    }), [token]);

    useEffect(()=>{
        if(typeof query !== "undefined"){
            (async ()=>{
                let aborted = false;
                try {
                    setStatus(REQUEST_STARTED);
                    const courseSearchResults = await instance.request({
                        'url':`/search/course/`,
                        ...requestSettings,
                        'method':'get'
                    });
                    console.log(courseSearchResults);
                    dispatch({
                        type:types.GET_COURSE_SEARCH_QUERY_SUCCESS,
                        payload:courseSearchResults,
                    });
                    console.log("dispatched results");
                    const instructors = courseSearchResults.map(({data}) => data.instructor);

                    const instructorResults = await Promise.all(instructors.map(instructorID => {
                        instance.request({
                            'url':`/account/instructor/${instructorID}/`,
                            "headers": {
                                "Authorization": `Token ${token}`,
                            },
                            'method':'get',
                        })
                    }));
                    console.log(instructorResults);
                    dispatch({
                        type: types.FETCH_INSTRUCTOR_SUCCESSFUL,
                        payload: instructorResults,
                    });
                    setStatus(200);
                } catch(error) {
                    if(!aborted){
                        handleError(error)
                    }
                }
            })();
        }
    },[query, dispatch,requestSettings])

    return status;
};