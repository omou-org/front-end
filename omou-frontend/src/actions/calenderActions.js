import * as types from './actionTypes';

import axios from 'axios';

// function BaseURL() {
//     return 'http://www.omou.io/api/';
// }


// export const fetchCourses = () =>
//     (dispatch) => axios.get("http://localhost:8000/courses/catalog/", {
//         headers:{
//             'Authorization': `Token ${localStorage.getItem("authToken")}`
//         }
//     })
//     .then(({data}) => {
//         dispatch({
//             type: types.FETCH_COURSES_SUCCESSFUL,
//             payload: {
//                 data,
//             },
//         });
//     })
//     .catch((error) => {
//         dispatch({type: types.FETCH_COURSES_FAILED, payload: error});
//     });

export function fetchTeacherAvailabilities(event){

}

export function addEvent(event) {
    console.log(event)
    return { type: types.ADD_EVENT, payload: event };
}

export function deleteEvent(event) {
    return { type: types.DELETE_EVENT, payload: event }
}

export function deleteAllEvents(event) {
    return { type: types.DELETE_ALL_EVENTS, payload: event }
}

export function filterEvent(event) {
    return { type: types.FILTER_EVENT, payload: event }
}