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

// Multiple courses
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

// Gets single course by ID 
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
    instructor {
          user {
              id
              firstName
              lastName
          }
      }
      enrollmentSet {
        id
    }
    courseCategory {
      id
      name
  }
  }
}`;


// Registration Cart Container component
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