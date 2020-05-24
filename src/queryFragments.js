import gql from "graphql-tag";

/**
 * This contains a library of all of our graphQL fragments that are meant to be shared
 * */
export const SIMPLE_COURSE_DATA = gql`
fragment SimpleCourse on courses {
	courseId
	courseType
	subject
  }
`;

export const MORE_COURSE_DATA = gql`
fragment moreCourse on courses {
    instructor {
      user {
        firstName
        lastName
      }
    }
    courseCategory {
      name
    }
    ...SimpleCourse
  }
	`;

export const GET_COURSE_DETAILS = gql`
	query CourseDetails($courseId: ID!){
		course(id: $courseId) {
			...SimpleCourse
		}
	}
	`;