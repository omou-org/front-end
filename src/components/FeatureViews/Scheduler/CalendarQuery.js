
import gql from "graphql-tag";

/**
 * Used to handle all scheduler queries 
 */

export const GET_ALL_EVENTS = gql`
query getSessionMonth($instructorId: ID, $timeFrame: String, $timeShift: Int, $viewOption:String) {
  sessions(instructorId: $instructorId, timeFrame: $timeFrame, timeShift: $timeShift, viewOption: $viewOption) {
    id
    title
    endDatetime
    startDatetime
    course {
      description
      startTime
      startDate
      title
      room
      id
      isConfirmed
      endDate
      endTime
      courseType
      instructor {
        user {
          firstName
          lastName
          id
        }
      }
    }
  }
}
 `