import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default function search(
	state = initialState.SearchResults,
	{payload, type}
) {
    const newState = state;
    if (payload && payload.noChangeSearch) {
        return state;
    }
    switch (type) {
        // case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS: {
        //     const {data} = payload.response;
        //     return JSON.parse(
        //         JSON.stringify({
        //             ...state,
        //             accountResultsNum: data.count,
        //             accounts: {
        //                 ...state.accounts,
        //                 [data.page]: data.results,
        //            },
        //         })
        //     );
        // }
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS: {
            const {data} = payload.response;
            return {
                ...state,
                courseResultsNum: data.count,
                courses: {
                    ...state.courses,
                    [data.page]: data.results,
                },
            };
        }

        case actions.GET_SESSION_SEARCH_QUERY_SUCCESS: {
            const {data} = payload.response;
            return{
                ...state,
                sessionResultsNum: data.count,
                sessions: {
                    ...state.sessions,
                    [data.page]: data.results,
                },
            };
        }

        default: 
            return state;
    };
};

//         case actions.GET_SESSION_SEARCH_QUERY_SUCCESS: {
//             return handleSessionFetch(newState, payload, "GET");
//         }
//         default:
//             return state;
//     }
// }

// const handleSessionFetch = (state, {response}) => ({
//     "sessions": response.data,
// });