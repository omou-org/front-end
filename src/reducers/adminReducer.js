import * as actions from "../actions/actionTypes";
import initialState from "./initialState";

export default function admin(state = initialState.Admin, {payload, type}) {
    const newState = state;
    switch (type) {
        case actions.GET_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "GET");
        case actions.POST_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "POST");
        case actions.PATCH_PRICE_RULE_SUCCESS:
            return updatePriceRule(newState, payload, "PATCH");

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
            return handleUnpaidFetch(newState, payload, "GET");


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

const updatePriceRule = (state, {response}, action) => {
    const {data} = response;
    let newPriceRules = [];
    const {PriceRules} = state;
    switch (action) {
        case "GET":
            newPriceRules = data;
            break;
        case "POST":
            newPriceRules = [...PriceRules, data];
            break;
        case "PATCH":
            newPriceRules = PriceRules.map((rule) =>
                rule.id === data.id ? data : rule);
        // no default
    }
    return {
        ...state,
        "PriceRules": newPriceRules,
    };
};

const handleUnpaidFetch = (state, {response}) => ({
    ...state,
    "Unpaid": response.data,
});

const updateDiscount = (state, {response, id}, action, discountType) => {
    const {data} = response;
    const {Discounts} = state;
    let newDiscounts = [];
    switch (action) {
        case "GET":
            newDiscounts = data;
            break;
        case "POST":
            newDiscounts = [...Discounts[discountType], data];
            break;
        case "PATCH":
            newDiscounts = Discounts[discountType].map((discount) =>
                discount.id === id ? data : discount);
            break;
        case "DELETE":
            newDiscounts = Discounts[discountType].filter((discount) => discount.id !== id);
        // no default
    }

    return {
        ...state,
        "Discounts": {
            ...Discounts,
            [discountType]: newDiscounts,
        },
    };
};
