// Accounts GraphQL Queries
import gql from 'graphql-tag';
import { simpleUser } from '../queryFragments';
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

export const GET_INSTRUCTOR = gql`
    query InstructorFetch($userID: ID!) {
        instructor(userId: $userID) {
            user {
                ...UserDetails
            }
        }
    }
    ${USER_DETAILS}
`;

export const GET_ADMIN = gql`
    query AdminFetch($userID: ID!) {
        admin(userId: $userID) {
            user {
                ...UserDetails
            }
        }
    }
    ${USER_DETAILS}
`;

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

export const GET_USER_TYPE_AND_PARENT_TYPE = gql`
    query GET_USER_TYPE($id: ID!) {
        userInfo(userId: $id) {
            ... on StudentType {
                accountType
            }
            ... on ParentType {
                accountType
            }
        }
    }
`;

export const GET_ALL_STUDENTS = gql`
    query GetAllStudents {
        students {
            accountType
            phoneNumber
            user {
                email
                lastName
                firstName
                id
            }
        }
    }
`;

export const GET_ALL_ADMINS = gql`
    query GetAllAdmins {
        admins {
            accountType
            adminType
            phoneNumber
            user {
                email
                firstName
                id
                lastName
            }
            userUuid
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

export const GET_SCHOOLS = gql`
    query getSchools {
        schools {
            id
            name
            district
            zipcode
        }
    }
`;

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
`;
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
    }
`;

// ProfileHeading.js
export const GET_ADMIN_USER_INFO = gql`
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
`;

export const GET_INSTRUCTOR_USER_INFO = gql`
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
`;

export const GET_PARENT_USER_INFO = gql`
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
`;

export const GET_STUDENT_USER_INFO = gql`
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
`;

// UserProfile.js
export const GET_ACCOUNT_NOTES = `
	notes(userId: $ownerID) {
		id
		body
		complete
		important
		timestamp
		title
	}`;

export const GET_STUDENT_INFO_QUERY = gql`query StudentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on StudentType {
			birthDate
			grade
			phoneNumber
			user {
			  id
			  firstName
			  lastName
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	}
	`;

export const GET_PARENT_INFO_QUERY = gql`
	query ParentInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on ParentType {
			balance
			accountType
			phoneNumber
			user {
			  email
			  id
			  firstName
			  lastName
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`;

export const GET_INSTRUCTOR_INFO_QUERY = gql`query InstructorInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on InstructorType {
			userUuid
			phoneNumber
			birthDate
			accountType
			biography
		  	experience
			language
			 subjects {
			  name
			}
			user {
			  lastName
			  firstName
			  id
			  email
			}
			instructoravailabilitySet {
			  dayOfWeek
			  endDatetime
			  startDatetime
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`;

export const GET_ADMIN_INFO_QUERY = gql`
	  query AdminInfoQuery($ownerID: ID!) {
		userInfo(userId: $ownerID) {
		  ... on AdminType {
			birthDate
			phoneNumber
			adminType
			accountType
			user {
			  firstName
			  lastName
			  id
			  email
			}
		  }
		}
		${GET_ACCOUNT_NOTES}
	  }`;

// Bio.js
export const GET_USER_BIO = gql`
    query getUserBio($ownerID: ID!) {
        userInfo(userId: $ownerID) {
            ... on InstructorType {
                biography
                experience
                language
                subjects {
                    name
                }
            }
        }
    }
`;

// NewAccount.js
export const CHECK_EMAIL = gql`
    query CheckEmail($email: String) {
        userType(userName: $email)
    }
`;

// LoginPage.js
export const GET_USER_TYPE = gql`
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

// ParentContact.js
export const GET_STUDENT_PARENTS = gql`
    query getParentAsStudent($userID: ID!) {
        student(userId: $userID) {
            primaryParent {
                accountType
                user {
                    id
                    firstName
                    lastName
                    email
                    parent {
                        phoneNumber
                    }
                }
            }
        }
    }
`;

// ====================================================================================================================

// Accounts.js
export const QUERY_USERS = gql`
    query UserQuery($adminType: String) {
        students {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        parents {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        instructors {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        admins(adminType: $adminType) {
            adminType
            userUuid
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
    }
    ${simpleUser}
`;

// EditSessionView.js
export const GET_INSTRUCTORS = gql`
    query EditSessionCategoriesQuery {
        instructors {
            user {
                firstName
                id
                lastName
                email
            }
        }
    }
`;

// ActionLog.js
export const GET_LOGS = gql`
    query GetLogs(
        $action: String
        $adminType: String
        $page: Int
        $pageSize: Int
        $sort: String
        $objectType: String
        $userId: ID!
        $startDateTime: String
        $endDateTime: String
    ) {
        logs(
            action: $action
            adminType: $adminType
            page: $page
            pageSize: $pageSize
            sort: $sort
            objectType: $objectType
            userId: $userId
            startDateTime: $startDateTime
            endDateTime: $endDateTime
        ) {
            results {
                date
                userId
                adminType
                action
                objectType
                objectRepr
            }
            total
        }
        admins {
            user {
                id
                firstName
                email
                lastName
            }
        }
    }
`;

// CourseList.js
export const GET_STUDENTS_AND_ENROLLMENTS = gql`
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
        enrollments(studentIds: $userIds) {
            id
            course {
                id
            }
        }
    }
`;

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

// Fields
export const GET_STUDENTS_USER_INFOS = gql`
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

// UpcomingLogOOO.js
export const GET_UPCOMING_INSTRUCTOR_OOO = gql`
    query getInstructorOOO($instructorID: ID!) {
        instructorOoo(instructorId: $instructorID) {
            id
            description
            endDatetime
            startDatetime
        }
    }
`;

// TimeAvailabilityContainer.js
export const GET_INSTRUCTOR_AVAILABILITY = gql`
    query GetInstructorAvailability($instructorId: ID!) {
        instructorAvailability(instructorId: $instructorId) {
            endTime
            startTime
            id
            dayOfWeek
        }
    }
`;
