import initialState from './initialState';
import * as actions from "../actions/actionTypes"

export default function admin(state = initialState.Admin, { payload, type, }) {
    let newState = state;
    switch (type) {
        case actions.GET_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "GET");
        case actions.POST_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "POST");
        case actions.PATCH_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "POST");
        case actions.POST_PRICE_RULE_FAILED:
            return {...newState};
        case actions.GET_UNPAID_FAILED:
            console.log("Failed to retrieve unpaid sessions")
        case actions.POST_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscount(newState, payload, "POST", "PaymentMethod");
        case actions.POST_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscount(newState, payload, "POST", "MultiCourse");
        case actions.POST_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscount(newState, payload, "POST", "DateRange");

        case actions.GET_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscount(newState, payload, "GET", "PaymentMethod");
        case actions.GET_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscount(newState, payload, "GET", "MultiCourse");
        case actions.GET_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscount(newState, payload, "GET", "DateRange");
        case actions.GET_UNPAID_SUCCESS:
            return updateUnpaid(newState, payload, "GET")
    

        case actions.DELETE_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscount(newState, payload, "DELETE", "PaymentMethod");
        case actions.DELETE_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscount(newState, payload, "DELETE", "MultiCourse");
        case actions.DELETE_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscount(newState, payload, "DELETE", "DateRange");

        case actions.PATCH_DISCOUNT_PAYMENT_METHOD_SUCCESS:
            return updateDiscount(newState, payload, "PATCH", "PaymentMethod");
        case actions.PATCH_DISCOUNT_MULTI_COURSE_SUCCESS:
            return updateDiscount(newState, payload, "PATCH", "MultiCourse");
        case actions.PATCH_DISCOUNT_DATE_RANGE_SUCCESS:
            return updateDiscount(newState, payload, "PATCH", "DateRange");

        default:
            return state;   
    }
}

const updatePriceRule = (state, payload, action) => {
    let {response} = payload;
    let {data} = response;
    let {PriceRules} = state;
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
        ...state,
        PriceRules,
    }
};

const updateUnpaid = (state, payload, action) => {
    let {response} = payload
    let {data} = response;
    let {Unpaid} = state;
    switch(action) {
        case "GET":{
            
            return {
                ...state,
                Unpaid,
            };
    }
}
}

const updateDiscount = (state, payload, action, discountType) => {
    let {response, id} = payload;
    let {data} = response;
    let {Discounts} = state;
    switch(action){
        case "GET":{
            Discounts[discountType] = data;
            break;
        }
        case "POST":{
            Discounts[discountType].push(data);
            break;
        }
        case "PATCH":{
            let updatedDiscount = data;
            Discounts[discountType] = Discounts[discountType].map((discount)=>{
                if(discount.id === id){
                    return updatedDiscount;
                } else {
                    return discount;
                }
            });
            break;
        }
        case "DELETE":{
            Discounts[discountType] = Discounts[discountType].filter((discount)=>{
                return discount.id !== id;
            });
        }
    }
    return {
        ...state,
        Discounts,
    }
};
