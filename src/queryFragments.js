import gql from "graphql-tag";

/**
 * This contains a library of all of our graphQL fragments that are meant to be shared
 * */
export const SIMPLE_COURSE_DATA = gql`
fragment SimpleCourse on CourseType {
	id
	courseType
	title
  }
`;

export const MORE_COURSE_DATA = gql`
fragment moreCourse on CourseType {
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
  }`;

export const GET_COURSES_DETAILS = gql`
	query courses($after: String) {
		courseId
		courseType
		title
	}`;

export const GET_CATEGORIES = gql`
	query CourseCategoriesList {
		courseCategories { 
			name
			id
			description
		}
	  }
	`;
