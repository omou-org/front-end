import initialState from './initialState';
import * as actions from "../actions/actionTypes"

export default function admin(state = initialState, { payload, type, }) {
    let newState = state;

    switch (type) {
        case actions.POST_CATEGORY_SUCCESS:
            return updateCourseCategories(newState, payload, "POST");
        case actions.POST_CATEGORY_FAILED:
            return newState;
        case actions.GET_CATEGORY_SUCCESS:
            return updateCourseCategories(newState, payload,"GET");
        case actions.PATCH_CATEGORY_SUCCESS:
            return updateCourseCategories(newState, payload, "PATCH");
        default:
            return newState;
    }
}

const updateCourseCategories = (state, payload, action) => {
    let {response} = payload;
    let {data} = response;
    switch(action){
        case "GET":{
            state["Course"]["CourseCategories"] = data;
            break;
        }
        case "POST":{
            state["Course"]["CourseCategories"].push(data);
            break;
        }
        case "PATCH":{
            let categoryList = state["Course"]["CourseCategories"];
            let updatedCategory = categoryList.find((category)=>{return category.id === data.id});
            state["Course"]["CourseCategories"] = categoryList.map((category)=>{
                if(category.id === data.id){
                    return updatedCategory;
                } else {
                    return category;
                }
            });
        }
    }
    return {...state};
};