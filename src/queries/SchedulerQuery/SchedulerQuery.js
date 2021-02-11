// Scheduler GraphQL Queries

// note
/* 
IF NOT IN GRAPHQL LEAVE EM IN THERE
*/
import gql from "graphql-tag"

// Single Session
 export const GET_SESSION = gql`
 query SessionViewQuery($sessionId: ID!) {
     session(sessionId: $sessionId) {
         id
         isConfirmed
         startDatetime
         title
         instructor {
             user {
                 id
                 firstName
                 lastName
             }
         }
         course {
             id
             isConfirmed
             room
             title
             availabilityList {
                 dayOfWeek
                 startTime
                 endTime
             }
             startDate
             endDate
             courseCategory {
                 id
                 name
             }
             instructor {
                 user {
                     id
                     firstName
                     lastName
                 }
                 subjects {
                     name
                 }
             }
             enrollmentSet {
                 student {
                     user {
                         id
                         firstName
                         lastName
                     }
                 }
             }
         }
         endDatetime
         startDatetime
     }
 }
`;


// Multi Session
export const GET_SESSIONS = gql`
    query GetSessions($courseId: ID!) {
        sessions(courseId: $courseId) {
            course {
                availabilityList {
                    startTime
                    endTime
                }
                id
                hourlyTuition
            }
            id
            startDatetime
            endDatetime
        }
    }
`;