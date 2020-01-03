import * as types from "./actionTypes";
import {default as apiActions, instance, MISC_FAIL, REQUEST_ALL, REQUEST_STARTED} from "./apiActions";
import {useCallback, useEffect, useMemo, useState, useRef} from "react";
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
                                requestSettings,
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
                    const courseEnrollments = classRegistrations.map( classReg =>
                        ({student: classReg.student, course: classReg.course})).concat(tutoringEnrollments);
                    console.log(tutoringEnrollments, courseEnrollments)
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
                        if(index < classRegistrations.length){
                            return classRegistrations[index].sessions;
                        } else {
                            return tutoringRegistrations[index].sessions;
                        }
                    };
                    console.log(Enrollments);
                    const registrations = Enrollments.map((enrollment, i) =>
                        ({ enrollment:enrollment.data.id, num_sessions: enrollmentSessions(i)})
                    );
                    console.log(registrations, payment, currentPayingParent);
                    const finalPayment = await instance.request({
                        'url': paymentEndpoint,
                        requestSettings,
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
                    console.log(finalPayment);
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