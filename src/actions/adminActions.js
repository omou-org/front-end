import * as types from "./actionTypes";
import {submitParentAndStudent, postData, patchData, typeToPostActions} from "./rootActions";
import {wrapGet, postCourse, formatCourse, wrapPost, instance, wrapPatch, wrapDelete} from "./apiActions";
import {academicLevelParse, courseTypeParse} from "../reducers/registrationReducer";

export const addCategory = (categoryName, categoryDescription) => wrapPost(
    "/course/categories/",
    [
        types.POST_CATEGORY_STARTED,
        types.POST_CATEGORY_SUCCESS,
        types.POST_CATEGORY_FAILED,
    ],
    {
        name: categoryName,
        description: categoryDescription
    }
);

export const fetchCategories = (id) => wrapGet(
    '/course/categories/',
    [
        types.GET_CATEGORY_STARTED,
        types.GET_CATEGORY_SUCCESS,
        types.GET_CATEGORY_FAILED,
    ],
    {
        id:id,
    }
);

export const fetchUnpaid = (id) => wrapGet(
    '/payment/payment/',
    [
        types.GET_UNPAID_STARTED,
        types.GET_UNPAID_SUCCESS,
        types.GET_UNPAID_FAILED
    ], 
    {
        id:id,
    }
);

export const updateCategory = (id, updatedCategory) => wrapPatch(
    '/course/categories/',
    [
        types.PATCH_CATEGORY_STARTED,
        types.PATCH_CATEGORY_SUCCESS,
        types.PATCH_CATEGORY_FAILED,
    ],
    {
        id:id,
        data:updatedCategory,
    }
);

export const fetchPriceRules = () => wrapGet(
    '/pricing/rule/',
    [
        types.GET_PRICE_RULE_STARTED,
        types.GET_PRICE_RULE_SUCCESS,
        types.GET_PRICE_RULE_FAILED,
    ],
    {}
);

export const setPrice = ({Pricing}) => wrapPost(
    '/pricing/rule/',
    [
        types.POST_PRICE_RULE_STARTED,
        types.POST_PRICE_RULE_SUCCESS,
        types.POST_PRICE_RULE_FAILED,
    ],
    {
        name: Pricing["Price Rule Name"],
        category: Pricing["Category"].value,
        academic_level: academicLevelParse[Pricing["Select Grade"]],
        hourly_tuition: Pricing["Set Hourly Tuition ($)"],
        course_type: courseTypeParse[Pricing["Select Course Size"]],
    }
);

export const updatePriceRule = (id, updatedPriceRule) => wrapPatch(
    '/pricing/rule/',
    [
        types.PATCH_PRICE_RULE_STARTED,
        types.PATCH_PRICE_RULE_SUCCESS,
        types.PATCH_PRICE_RULE_FAILED,
    ],
    {
        id:id,
        data:updatedPriceRule,
    }
);

export const setDiscount = (discountType, discountPayload) => {
    switch(discountType){
        case "Bulk Order Discount":{
            return wrapPost(
                'pricing/discount-multi-course/',
                [
                    types.POST_DISCOUNT_MULTI_COURSE_STARTED,
                    types.POST_DISCOUNT_MULTI_COURSE_SUCCESS,
                    types.POST_DISCOUNT_MULTI_COURSE_FAILED,
                ],
                discountPayload,
            );
        }
        case "Date Range Discount":{
            return wrapPost(
                'pricing/discount-date-range/',
                [
                    types.POST_DISCOUNT_DATE_RANGE_START,
                    types.POST_DISCOUNT_DATE_RANGE_SUCCESS,
                    types.POST_DISCOUNT_DATE_RANGE_FAILED,
                ],
                discountPayload,
            )
        }
        case "Payment Method Discount":{
            return wrapPost(
                'pricing/discount-payment-method/',
                [
                    types.POST_DISCOUNT_PAYMENT_METHOD_STARTED,
                    types.POST_DISCOUNT_PAYMENT_METHOD_SUCCESS,
                    types.POST_DISCOUNT_PAYMENT_METHOD_FAILED,
                ],
                discountPayload,
            )
        }
    }
};

export const fetchMultiCourseDiscount = (id) => wrapGet(
    '/pricing/discount-multi-course/',
    [
        types.GET_DISCOUNT_MULTI_COURSE_STARTED,
        types.GET_DISCOUNT_MULTI_COURSE_SUCCESS,
        types.GET_DISCOUNT_MULTI_COURSE_FAILED,
    ],
    {}
);

export const fetchPaymentMethodDiscount = (id) => wrapGet(
    '/pricing/discount-payment-method/',
    [
        types.GET_DISCOUNT_PAYMENT_METHOD_STARTED,
        types.GET_DISCOUNT_PAYMENT_METHOD_SUCCESS,
        types.GET_DISCOUNT_PAYMENT_METHOD_FAILED,
    ],
    {}
);

export const fetchDateRangeDiscount = (id) => wrapGet(
    '/pricing/discount-date-range/',
    [
        types.GET_DISCOUNT_DATE_RANGE_START,
        types.GET_DISCOUNT_DATE_RANGE_SUCCESS,
        types.GET_DISCOUNT_DATE_RANGE_FAILED,
    ],
    {}
);

export const deleteMultiCourseDiscount= (id)=> wrapDelete(
    '/pricing/discount-multi-course/',
    [
        types.DELETE_DISCOUNT_MULTI_COURSE_STARTED,
        types.DELETE_DISCOUNT_MULTI_COURSE_SUCCESS,
        types.DELETE_DISCOUNT_MULTI_COURSE_FAILED,
    ],
    {
        id:id,
    }
);

export const deletePaymentMethodDiscount = (id) => wrapDelete(
    '/pricing/discount-payment-method/',
    [
        types.DELETE_DISCOUNT_PAYMENT_METHOD_STARTED,
        types.DELETE_DISCOUNT_PAYMENT_METHOD_SUCCESS,
        types.DELETE_DISCOUNT_PAYMENT_METHOD_FAILED,
    ],
    {
        id:id,
    }
);

export const deleteDateRangeDiscount = (id) => wrapDelete(
    '/pricing/discount-date-range/',
    [
        types.DELETE_DISCOUNT_DATE_RANGE_STARTED,
        types.DELETE_DISCOUNT_DATE_RANGE_SUCCESS,
        types.DELETE_DISCOUNT_DATE_RANGE_FAILED,
    ],
    {
        id:id,
    }
);

export const patchMultiCourseDiscount = (id, payload) => wrapPatch(
    '/pricing/discount-multi-course/',
    [
        types.PATCH_DISCOUNT_MULTI_COURSE_STARTED,
        types.PATCH_DISCOUNT_MULTI_COURSE_SUCCESS,
        types.PATCH_DISCOUNT_MULTI_COURSE_FAILED,
    ],
    {
        id:id,
        data: payload,
    }
);

export const patchPaymentMethodDiscount = (id, payload) => wrapPatch(
    '/pricing/discount-payment-method/',
    [
        types.PATCH_DISCOUNT_PAYMENT_METHOD_STARTED,
        types.PATCH_DISCOUNT_PAYMENT_METHOD_SUCCESS,
        types.PATCH_DISCOUNT_PAYMENT_METHOD_FAILED,
    ],
    {
        id:id,
        data: payload,
    }
);

export const patchDateRangeDiscount = (id, payload) => wrapPatch(
    '/pricing/discount-date-range/',
    [
        types.PATCH_DISCOUNT_DATE_RANGE_STARTED,
        types.PATCH_DISCOUNT_DATE_RANGE_SUCCESS,
        types.PATCH_DISCOUNT_DATE_RANGE_FAILED,
    ],
    {
        id: id,
        data: payload,
    }
);