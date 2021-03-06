// Accounts GraphQL Queries
import gql from "graphql-tag";
// note
/* 
IF NOT IN GRAPHQL LEAVE EM IN THERE

const getNoteByID = useCallback(
	(noteID) => notes.find(({ id }) => noteID == id),
	[notes]
);
*/

// AccountCard.js
export const USER_DETAILS = gql`
  fragment UserDetails on UserType {
    email
    lastName
    firstName
  }
`;

export const GET_STUDENT = gql`
  query StudentFetch($userID: ID!) {
    student(userId: $userID) {
      user {
        ...UserDetails
      }
    }
  }
  ${USER_DETAILS}
`;

export const GET_PARENT = gql`
  query ParentFetch($userID: ID!) {
    parent(userId: $userID) {
      user {
        ...UserDetails
      }
    }
  }
  ${USER_DETAILS}
`;

export const GET_INSTRUCTOR =  gql`
query InstructorFetch($userID: ID!) {
	instructor(userId: $userID) {
		user {
			...UserDetails
		}
	}
}
${USER_DETAILS}`;

export const GET_ADMIN = gql`
query AdminFetch($userID: ID!) {
	admin(userId: $userID) {
		user {
			...UserDetails
		}
	}
}
${USER_DETAILS}`;

// FormFormats
export const GET_INFO = gql`
  query GetInfo($id: ID!) {
    student(userId: $id) {
      address
      zipcode
      city
      state
      birthDate
      gender
      grade
      phoneNumber
      primaryParent {
        user {
          firstName
          lastName
          id
        }
      }
      school {
        name
        id
      }
      user {
        firstName
        lastName
        email
        id
      }
    }
  }
`;
export const GET_NAME = gql`
  query GetName($id: ID!) {
    parent(userId: $id) {
      user {
        firstName
        lastName
      }
    }
  }
`;

export const GET_PARENT_INFO = gql`
  query GetParent($id: ID!) {
    parent(userId: $id) {
      user {
        firstName
        lastName
        email
      }
      relationship
      gender
      phoneNumber
      birthDate
      address
      city
      state
      zipcode
    }
  }
`;

export const GET_ADMIN_INFO = gql`
  query GetAdmin($userID: ID!) {
    admin(userId: $userID) {
      user {
        id
        email
        firstName
        lastName
      }
      adminType
      gender
      phoneNumber
      birthDate
      address
      city
      state
      zipcode
    }
  }
`;

export const GET_INSTRUCTOR_INFO = gql`
  query GetInstructor($userID: ID) {
    instructor(userId: $userID) {
      address
      user {
        firstName
        lastName
        email
      }
      phoneNumber
      gender
      city
      state
      zipcode
      birthDate
      biography
      experience
      language
      subjects {
        name
        id
      }
    }
  }
`;

// dataProvider.js
export const GET_SCHOOL = {
  schools: gql`
    query getSchool($id: ID) {
      school(schoolId: $id) {
        id
        name
        district
        zipcode
      }
    }
  `,
};

// StudentInfo.js
export const GET_STUDENTS_BY_PARENT = gql`
  query GetStudents($id: ID) {
    parent(userId: $id) {
      studentPrimaryParent {
        ...StudentInfo
      }
      studentSecondaryParent {
        ...StudentInfo
      }
    }
  }

  fragment StudentInfo on StudentType {
    phoneNumber
    user {
      id
      firstName
      lastName
      email
    }
  }
`;

// CourseManagementContainer.js
export const GET_STUDENTS_BY_ENROLLMENT = gql`
  query getStudents($accountId: ID!) {
    parent(userId: $accountId) {
      user {
        id
      }
      studentList {
        user {
          firstName
          id
          lastName
        }
        enrollmentSet {
          course {
            id
            title
          }
        }
      }
    }
  }
`;

// RegistrationActions.js
export const GET_PARENT_QUERY_AND_STUDENTLIST = gql`
  query GetRegisteringParent($userId: ID!) {
    __typename
    parent(userId: $userId) {
      user {
        firstName
        id
        lastName
        email
      }
      studentList
    }
  }
`;

// InstructorSchedule.js
export const GET_INSTRUCTOR_COURSE_INFO = gql`
	query getCourses($instructorID: ID!) {
		instructor(userId: $instructorID) {
			accountType
			user {
			  firstName
			  lastName
			  id
			  instructor {
				sessionSet {
				  endDatetime
				  startDatetime
				  title
				}
				instructoravailabilitySet {
				  dayOfWeek
				  endDatetime
				  startDatetime
				  startTime
				  endTime
				}
				instructoroutofofficeSet {
					endDatetime
					startDatetime
					description
				  }
			  }
			}
		  }
	  }
`
// authActions.js
export const GET_ACCOUNT_TYPE = gql`
    query GetAccountType($username: String!) {
        userInfo(userName: $username) {
            ... on AdminType {
                accountType
                user {
                    id
                    firstName
                    lastName
                    email
                }
            }
            ... on InstructorType {
                accountType
                user {
                    id
                    firstName
                    lastName
                    email
                }
            }
            ... on ParentType {
                accountType
                user {
                    id
                    firstName
                    lastName
                    email
                }
            }
            ... on StudentType {
                accountType
                user {
                    id
                    firstName
                    lastName
                    email
                }
            }
        }
    }`;


// user_info
const GET_PROFILE_HEADING_QUERY = {
  admin: gql`
    query getAdmimUserInfo($userID: ID!) {
      userInfo(userId: $userID) {
        ... on AdminType {
          birthDate
          accountType
          adminType
          phoneNumber
          user {
            firstName
            lastNamed
            lastLogin
            email
            id
          }
        }
      }
    }
  `,
  instructor: gql`
    query getInstructorUserInfo($userID: ID!) {
      userInfo(userId: $userID) {
        ... on InstructorType {
          birthDate
          accountType
          phoneNumber
          user {
            firstName
            lastName
            email
            id
          }
        }
      }
    }
  `,
  parent: gql`
    query getParentUserInfo($userID: ID!) {
      userInfo(userId: $userID) {
        ... on ParentType {
          birthDate
          accountType
          phoneNumber
          balance
          user {
            firstName
            lastName
            email
            id
          }
        }
      }
    }
  `,
  student: gql`
    query getStudentUserInfo($userID: ID!) {
      userInfo(userId: $userID) {
        ... on StudentType {
          birthDate
          accountType
          phoneNumber
          grade
          school {
            name
            id
          }
          user {
            firstName
            lastName
            email
            id
          }
        }
      }
    }
  `,
};

// user_type
const GET_USER_TYPE = gql`
  query GetUserType($username: String!) {
    userType(userName: $username)
  }
`;

// ResetPassword.js
export const GET_EMAIL = gql`
  query GetEmail($token: String) {
    emailFromToken(token: $token)
  }
`;

// ====================================================================================================================

// notes
const QUERIES = {
  account: gql`
    query AccountNotesQuery($ownerID: ID!) {
      notes(userId: $ownerID) {
        id
        body
        complete
        important
        timestamp
        title
      }
    }
  `,
};

// students
const GET_STUDENTS = gql`
  query GetStudents($userIds: [ID]!) {
    userInfos(userIds: $userIds) {
      ... on StudentType {
        user {
          firstName
          lastName
          id
        }
      }
    }
  }
`;

// schools
const QUERIES_LIST = {
  schools: gql`
    query getSchools {
      schools {
        id
        name
        district
        zipcode
      }
    }
  `,
};

// parents
const GET_PARENTS_QUERY = gql`
  query GetParents($query: String!) {
    accountSearch(query: $query, profile: "PARENT") {
      results {
        ... on ParentType {
          user {
            firstName
            lastName
            id
            email
          }
          studentIdList
        }
      }
    }
  }
`;

// admins
// const QUERY_USERS = gql`
// 	query UserQuery($adminType: String) {
// 		students {
// 			user {
// 				...SimpleUser
// 				email
// 			}
// 			accountType
// 			phoneNumber
// 		}
// 		parents {
// 			user {
// 				...SimpleUser
// 				email
// 			}
// 			accountType
// 			phoneNumber
// 		}
// 		instructors {
// 			user {
// 				...SimpleUser
// 				email
// 			}
// 			accountType
// 			phoneNumber
// 		}
// 		admins(adminType: $adminType) {
// 			adminType
// 			userUuid
// 			user {
// 				...SimpleUser
// 				email
// 			}
// 			accountType
// 			phoneNumber
// 		}
// 	}
// 	${simpleUser}
// `;

// instructor_ooo
const GET_UPCOMING_INSTRUCTOR_OOO = gql`
  query getInstructorOOO($instructorID: ID!) {
    instructorOoo(instructorId: $instructorID) {
      id
      description
      endDatetime
      startDatetime
    }
  }
`;

// instructors_availability
const GET_INSTRUCTOR_AVAILABILITY = gql`
  query GetInstructorAvailability($instructorId: ID!) {
    instructorAvailability(instructorId: $instructorId) {
      endTime
      startTime
      id
      dayOfWeek
    }
  }
`;
