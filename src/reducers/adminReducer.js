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
        case actions.GET_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "GET");
        case actions.POST_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "POST");
        case actions.PATCH_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "POST");
        case actions.POST_PRICE_RULE_FAILED:
            console.log("Failed posting price rule");
            return {...newState};
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

const updatePriceRule = (state, payload, action) => {
    let {response} = payload;
    let {data} = response;
    let {Admin} = state;
    let {PriceRules} = Admin;
    switch(action){
        case "GET":{
            PriceRules = data;
            break;
        }
        case "POST":{
            PriceRules.push(data);
            break;
        }
        case "PATCH":{
            let updatedPriceRule = PriceRules.find((rule) => {return rule.id === data.id});
            PriceRules = PriceRules.map((rule)=>{
                if(rule.id === data.id){
                    return updatedPriceRule;
                } else {
                    return rule;
                }
            });
        }
    }
    return {
        ...Admin,
        PriceRules,
    }
};