import * as types from "./actionTypes";
import {default as apiActions, instance, MISC_FAIL, REQUEST_ALL, REQUEST_STARTED} from "./apiActions";
import {useCallback, useEffect, useMemo, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";


const enrollmentEndpoint = "/course/enrollment/";
const courseEndpoint = "/course/catalog/";
const paymentEndpoint = "/payment/payment/";

export const submitRegistration = ({tutoringRegistrations, classRegistrations, payment}) => () =>{
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
    console.log("hi from registration hook")

    useEffect(()=>{
        let aborted = false;
        console.log("hi")
        (async ()=> {
            try {
                const TutoringCourses = await Promise.all(tutoringRegistrations.map( ({newTutoringCourse}) =>
                    instance.request(
                        {
                            'url':courseEndpoint,
                            requestSettings,
                            'data': newTutoringCourse,
                            'method':'post',
                        }
                    )
                ));
                console.log(TutoringCourses)
                dispatch({
                    type: types.POST_COURSE_SUCCESSFUL,
                    payload: TutoringCourses,
                });
                const tutoringEnrollments = tutoringRegistrations.map((tutoringReg,i) =>
                    ({student: tutoringReg.student, course: TutoringCourses[i]}));
                const courseEnrollments = classRegistrations.map( classReg =>
                    ({student: classReg.student, course: classReg.course})).concat(tutoringEnrollments);
                const Enrollments = await Promise.all(courseEnrollments.map(enrollment =>
                    instance.request(
                        {
                            'url':enrollmentEndpoint,
                            requestSettings,
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
                    if(index < courseEnrollments.length){
                        return courseEnrollments[index].sessions;
                    } else {
                        return tutoringEnrollments[index].sessions;
                    }
                };
                const registrations = Enrollments.map((enrollment, i) =>
                    ({...enrollment, num_sessions: enrollmentSessions(i)})
                );
                const finalPayment = await instance.request({
                    'url': paymentEndpoint,
                    requestSettings,
                    'data':{
                        ...payment,
                        registrations: registrations,
                    }
                });
                dispatch({
                    type: types.POST_PAYMENT_SUCCESS,
                    payload: finalPayment,
                });
                console.log(finalPayment, registrations, enrollmentSessions, Enrollments, TutoringCourses)
            } catch (error){
                if(!aborted){
                    handleError(error)
                }
            }
        })();

    },[dispatch, token, requestSettings]);
    return status;
};