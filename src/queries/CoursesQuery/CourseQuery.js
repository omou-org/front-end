// Course GraphQL Queries

// note
/* 
IF NOT IN GRAPHQL LEAVE EM IN THERE


*/
import gql from "graphql-tag";


/** Course Querys in form */
export const GET_CATEGORIES = gql`
    query GetCategories {
        courseCategories {
            id
            name
        }
    }
`;

// FormFormats.js
export const GET_COURSES = gql`
query GetCourses {
  courses {
    title
    id
    enrollmentSet {
          id
        }
    maxCapacity
    instructor {
      user {
        lastName
        firstName
      }
    }
  }
}
`;

// ClassInfo.js
// CourseClass.js
// CourseRegistrationReceipt.js
export const GET_COURSE = gql`
query CourseFetch($id: ID!) {
  course(courseId: $id) {
      title
      id
      description
      startDate
      endDate
      maxCapacity
      academicLevel
      totalTuition
      hourlyTuition
      isConfirmed
      courseLink
      courseLinkDescription
      courseLinkUpdatedAt
      activeAvailabilityList {
        startTime
        endTime
        dayOfWeek
      }
      courseLinkUser {
          firstName
          lastName
      }
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
      }
      availabilityList {
        startTime
        endTime
        dayOfWeek
    }
    sessionSet {
  startDatetime
  id
}
enrollmentSet {
  id
  student {
      user {
          firstName
          lastName
          id
      }
      primaryParent {
          user {
              firstName
              lastName
              id
              email
          }
          accountType
          phoneNumber
      }
      studentschoolinfoSet {
          textbook
          teacher
          name
      }
      accountType
  }
}
}

    enrollments(courseId: $id) {
      student {
          user {
              id
          }
      }
  }  
}`;


// RegistrationCartContainer.js
export const GET_COURSES_AND_STUDENTS_TO_REGISTER = gql`
  query GetCoursesToRegister($courseIds: [ID]!, $userIds: [ID]!) {
    userInfos(userIds: $userIds) {
      ... on StudentType {
        user {
          firstName
          lastName
          email
          id
        }
      }
    }
    courses(courseIds: $courseIds) {
      id
      title
      startDate
      endDate
      hourlyTuition
      availabilityList {
        dayOfWeek
        endTime
        startTime
      }
      academicLevelPretty
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
      }
    }
  }
`;