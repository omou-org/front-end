import * as types from "./actionTypes";
import {submitParentAndStudent, postData, patchData, typeToPostActions} from "./rootActions";
import {wrapGet, postCourse, formatCourse, wrapPost, instance, wrapPatch} from "./apiActions";
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

export const fetchCategories = () => wrapGet(
    '/course/categories/',
    [
        types.GET_CATEGORY_STARTED,
        types.GET_CATEGORY_SUCCESS,
        types.GET_CATEGORY_FAILED,
    ],
    {}
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