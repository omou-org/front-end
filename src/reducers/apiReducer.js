import * as actions from "../actions/actionTypes";
import initialState from "./initialState";
import * as api from "../actions/apiActions";

export default (state = initialState.RequestStatus, {payload, type}) => {
    let status;
    if (payload && payload.response && payload.response.status) {
        ({status} = payload.response);
    } else {
        // general server error
        status = api.MISC_FAIL;
    }
    switch (type) {
        case actions.FETCH_COURSE_STARTED:
            return updateCourseFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_COURSE_SUCCESSFUL:
            return updateCourseFetch(state, payload.id, status);
        case actions.FETCH_COURSE_FAILED:
            return updateCourseFetch(state, payload.id, status);

        case actions.FETCH_INSTRUCTOR_STARTED:
            return updateInstructorFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorFetch(state, payload.id, status);
        case actions.FETCH_INSTRUCTOR_FAILED:
            return updateInstructorFetch(state, payload.id, status);

        case actions.FETCH_STUDENT_STARTED:
            return updateStudentFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_STUDENT_SUCCESSFUL:
            return updateStudentFetch(state, payload.id, status);
        case actions.FETCH_STUDENT_FAILED:
            return updateStudentFetch(state, payload.id, status);

        case actions.FETCH_PARENT_STARTED:
            return updateParentFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.FETCH_PARENT_SUCCESSFUL:
            return updateParentFetch(state, payload.id, status);
        case actions.FETCH_PARENT_FAILED:
            return updateParentFetch(state, payload.id, status);

        case actions.FETCH_ENROLLMENT_STARTED:
            return updateEnrollmentFetch(state, api.REQUEST_STARTED);
        case actions.FETCH_ENROLLMENT_SUCCESSFUL:
            return updateEnrollmentFetch(state, status);
        case actions.FETCH_ENROLLMENT_FAILED:
            return updateEnrollmentFetch(state, status);

        case actions.POST_INSTRUCTOR_STARTED:
            return updateInstructorPost(state, api.REQUEST_STARTED);
        case actions.POST_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorPost(state, status);
        case actions.POST_INSTRUCTOR_FAILED:
            return updateInstructorPost(state, status);
        case actions.PATCH_INSTRUCTOR_STARTED:
            return updateInstructorPatch(state, payload.id, api.REQUEST_STARTED);
        case actions.PATCH_INSTRUCTOR_SUCCESSFUL:
            return updateInstructorPatch(state, payload.id, status);
        case actions.PATCH_INSTRUCTOR_FAILED:
            return updateInstructorPatch(state, payload.id, status);
        case actions.FETCH_ACCOUNT_NOTE_STARTED:
            return updateAccountNoteFetch(
                state,
                payload.ownerID,
                api.REQUEST_STARTED,
            );
        case actions.FETCH_ACCOUNT_NOTE_SUCCESSFUL:
            return updateAccountNoteFetch(state, payload.ownerID, status);
        case actions.FETCH_ACCOUNT_NOTE_FAILED:
            return updateAccountNoteFetch(state, payload.ownerID, status);

        case actions.FETCH_COURSE_NOTE_STARTED:
            return updateCourseNoteFetch(state, payload.ownerID, api.REQUEST_STARTED);
        case actions.FETCH_COURSE_NOTE_SUCCESSFUL:
            return updateCourseNoteFetch(state, payload.ownerID, status);
        case actions.FETCH_COURSE_NOTE_FAILED:
            return updateCourseNoteFetch(state, payload.ownerID, status);

        case actions.POST_COURSE_NOTE_STARTED:
            return updateCourseNotePost(state, api.REQUEST_STARTED);
        case actions.POST_COURSE_NOTE_SUCCESSFUL:
            return updateCourseNotePost(state, status);
        case actions.POST_COURSE_NOTE_FAILED:
            return updateCourseNotePost(state, status);

        case actions.PATCH_COURSE_NOTE_STARTED:
            return updateCourseNotePatch(state, payload.ownerID, api.REQUEST_STARTED);
        case actions.PATCH_COURSE_NOTE_SUCCESSFUL:
            return updateCourseNotePatch(state, payload.ownerID, status);
        case actions.PATCH_COURSE_NOTE_FAILED:
            return updateCourseNotePatch(state, payload.ownerID, status);

        case actions.FETCH_ENROLLMENT_NOTE_STARTED:
            return updateEnrollmentNoteFetch(
                state,
                payload.ownerID,
                api.REQUEST_STARTED,
            );
        case actions.FETCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return updateEnrollmentNoteFetch(state, payload.ownerID, status);
        case actions.FETCH_ENROLLMENT_NOTE_FAILED:
            return updateEnrollmentNoteFetch(state, payload.ownerID, status);

        case actions.POST_ENROLLMENT_NOTE_STARTED:
            return updateEnrollmentNotePost(state, api.REQUEST_STARTED);
        case actions.POST_ENROLLMENT_NOTE_SUCCESSFUL:
            return updateEnrollmentNotePost(state, status);
        case actions.POST_ENROLLMENT_NOTE_FAILED:
            return updateEnrollmentNotePost(state, status);

        case actions.PATCH_ENROLLMENT_NOTE_STARTED:
            return updateEnrollmentNotePatch(
                state,
                payload.ownerID,
                api.REQUEST_STARTED,
            );
        case actions.PATCH_ENROLLMENT_NOTE_SUCCESSFUL:
            return updateEnrollmentNotePatch(state, payload.ownerID, status);
        case actions.PATCH_ENROLLMENT_NOTE_FAILED:
            return updateEnrollmentNotePatch(state, payload.ownerID, status);

        case actions.POST_ACCOUNT_NOTE_STARTED:
            return updateAccountNotePost(state, api.REQUEST_STARTED);
        case actions.POST_ACCOUNT_NOTE_SUCCESSFUL:
            return updateAccountNotePost(state, status);
        case actions.POST_ACCOUNT_NOTE_FAILED:
            return updateAccountNotePost(state, status);

        case actions.PATCH_ACCOUNT_NOTE_STARTED:
            return updateAccountNotePatch(
                state,
                payload.ownerID,
                api.REQUEST_STARTED,
            );
        case actions.PATCH_ACCOUNT_NOTE_SUCCESSFUL:
            return updateAccountNotePatch(state, payload.ownerID, status);
        case actions.PATCH_ACCOUNT_NOTE_FAILED:
            return updateAccountNotePatch(state, payload.ownerID, status);

        case actions.FETCH_USER_STARTED:
            return updateUserFetch(state, api.REQUEST_STARTED);
        case actions.FETCH_USER_SUCCESSFUL:
            return updateUserFetch(state, status);
        case actions.FETCH_USER_FAILED:
            return updateUserFetch(state, status);

        case actions.GET_CATEGORY_STARTED:
            return updateCategoryFetch(state, payload.id, api.REQUEST_STARTED);
        case actions.GET_CATEGORY_SUCCESS:
            return updateCategoryFetch(state, payload.id, status);
        case actions.GET_CATEGORY_FAILED:
            return updateCategoryFetch(state, payload.id, status);

        case actions.POST_CATEGORY_STARTED:
            return updateCategoryPost(state, payload.id, api.REQUEST_STARTED);
        case actions.POST_CATEGORY_SUCCESS:
            return updateCategoryPost(state, payload.id, status);
        case actions.POST_CATEGORY_FAILED:
            return updateCategoryPost(state, payload.id, status);

        case actions.GET_PRICE_RULE_STARTED:
            return updatePriceRuleStatus(
                state,
                payload.id,
                api.REQUEST_STARTED,
                actions.GET,
            );
        case actions.GET_PRICE_RULE_SUCCESS:
            return updatePriceRuleStatus(state, payload.id, status, actions.GET);
        case actions.POST_PRICE_RULE_FAILED:
            return updatePriceRuleStatus(state, payload.id, status, actions.POST);
        case actions.POST_PRICE_RULE_SUCCESS:
            return updatePriceRuleStatus(state, payload.id, status, actions.POST);

        case actions.GET_DISCOUNT_DATE_RANGE_START:
            return updateDiscountStatus(
                state,
                payload.id,
                api.REQUEST_STARTED,
                actions.GET,
                "dateRange",
            );
        case actions.GET_DISCOUNT_PAYMENT_METHOD_STARTED:
            return updateDiscountStatus(
                state,
                payload.id,
                api.REQUEST_STARTED,
                actions.GET,
                "paymentMethod",
            );
        case actions.GET_DISCOUNT_MULTI_COURSE_STARTED:
            return updateDiscountStatus(
                state,
                payload.id,
                api.REQUEST_STARTED,
                actions.GET,
                "multiCourse",
            );

        case actions.GET_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.GET,
                "dateRange",
            );
        case actions.GET_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.GET,
                "multiCourse",
            );
        case actions.GET_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.GET,
                "paymentMethod",
            );

        case actions.DELETE_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.DELETE,
                "paymentMethod",
            );
        case actions.DELETE_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.DELETE,
                "dateRange",
            );
        case actions.DELETE_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.DELETE,
                "multiCourse",
            );

        case actions.PATCH_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.PATCH,
                "paymentMethod",
            );
        case actions.PATCH_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.PATCH,
                "dateRange",
            );
        case actions.PATCH_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscountStatus(
                state,
                payload.id,
                status,
                actions.PATCH,
                "multiCourse",
            );

        case actions.SET_PARENT:
            return {
                ...state,
                "registeringParent": NEW_REGISTERING_PARENT,
            };

        case actions.GET_PAYMENT_SUCCESS:
            return updatePaymentStatus(state, payload.id, status);
        case actions.GET_PAYMENT_STARTED:
            return updatePaymentStatus(state, payload.id, status);

        case actions.GET_SESSIONS_SUCCESS:
            return updateSessionStatus(state, payload.id, status);
        case actions.GET_SESSIONS_STARTED:
            return updateSessionStatus(state, payload.id, status);

        case actions.GET_UNPAID_SUCCESS:
            return updateUnpaidStatus(state, payload.id, status);
        case actions.GET_UNPAID_STARTED:
            return updateUnpaidStatus(state, payload.id, api.REQUEST_STARTED);
        case actions.GET_UNPAID_FAILED:
            return updateUnpaidStatus(state, payload.id, status);

        default:
            return state;
    }
};

export const NEW_REGISTERING_PARENT = 2;

const updateCategoryPost = (state, payload, status) => {
    const newState = {...state};
    newState.category[actions.POST] = status;
    return newState;
};

const updateCategoryFetch = (state, payload, status) => {
    const newState = {...state};
    newState.category[actions.GET] = status;
    return newState;
};

const updateCourseFetch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.course[actions.GET][id] = status;
    return newState;
};

const updateStudentFetch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.student[actions.GET][id] = status;
    return newState;
};

const updateParentFetch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.parent[actions.GET][id] = status;
    return newState;
};

const updateInstructorFetch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.GET][id] = status;
    return newState;
};

const updateInstructorPost = (state, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.POST] = status;
    return newState;
};

const updateInstructorPatch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.instructor[actions.PATCH][id] = status;
    return newState;
};

const updateEnrollmentFetch = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.enrollment[actions.GET] = status;
    return newState;
};

const updateAccountNoteFetch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.accountNote[actions.GET][ownerID] = status;
    return newState;
};

const updateAccountNotePost = (state, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.accountNote[actions.POST] = status;
    return newState;
};

const updateAccountNotePatch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.accountNote[actions.PATCH][ownerID] = status;
    return newState;
};

const updateUserFetch = (state, status) => ({
    ...state,
    "userFetch": status,
});

const updateCourseNoteFetch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.courseNote[actions.GET][ownerID] = status;
    return newState;
};

const updateCourseNotePost = (state, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.courseNote[actions.POST] = status;
    return newState;
};

const updateCourseNotePatch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.courseNote[actions.PATCH][ownerID] = status;
    return newState;
};

const updateEnrollmentNoteFetch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.enrollmentNote[actions.GET][ownerID] = status;
    return newState;
};

const updateEnrollmentNotePost = (state, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.enrollmentNote[actions.POST] = status;
    return newState;
};

const updateEnrollmentNotePatch = (state, ownerID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.enrollmentNote[actions.PATCH][ownerID] = status;
    return newState;
};

const updatePriceRuleStatus = (state, id, status, requestType) => {
    const newState = {...state};
    newState.priceRule[requestType][id] = status;
    return newState;
};

const updateDiscountStatus = (state, id, status, requestType, discountType) => {
    const newState = {...state};
    if (requestType !== actions.DELETE && requestType !== actions.PATCH) {
        newState.discount[discountType][requestType][id] = status;
    } else {
        newState.discount[requestType] = status;
    }

    return newState;
};

const updatePaymentStatus = (state, paymentID, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.payment[actions.GET][paymentID] = status;
    return newState;
};

const updateSessionStatus = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.schedule[actions.GET][id] = status;
    return newState;
};

const updateUnpaidStatus = (state, id, status) => {
    const newState = JSON.parse(JSON.stringify(state));
    newState.admin[actions.GET][id] = status;
    return newState;
};
