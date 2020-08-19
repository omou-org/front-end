import gql from "graphql-tag";

/**
 * this contains a library of all of our graphQL fragments that are meant to be shared
 *
 */

export const simpleUser = gql`
    fragment SimpleUser on UserType {
        id
        firstName
        lastName
    }
`;

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

export const Enrollment = {
	fragments: {
		basicEnrollment: gql`
fragment BasicEnrollmentData on EnrollmentType {
	id
	course {
		id
	}
	student {
		user {
			id
		}
	}
}`
	}
}

export const ENROLLMENT_ID = gql`
fragment EnrollmentId on EnrollmentType {
	id
}
`

export const BASIC_ENROLLMENT_DATA = gql`
fragment BasicEnrollmentData on EnrollmentType {
	id
	course {
		id
	}
	student {
		user {
			id
		}
	}
}`