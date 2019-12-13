import * as types from "./actionTypes";
import {submitParentAndStudent, postData, patchData, typeToPostActions} from "./rootActions";
import {wrapGet, postCourse, formatCourse, wrapPost, instance, wrapPatch} from "./apiActions";

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
)