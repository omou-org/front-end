// Accounts GraphQL Queries

// note
/* 
IF NOT IN GRAPHQL LEAVE EM IN THERE

const getNoteByID = useCallback(
	(noteID) => notes.find(({ id }) => noteID == id),
	[notes]
);
*/

// school
// this is not in Accounts
const QUERIES_ONE = {
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

// parent
// no ID how funsies
const GET_PARENT = gql`
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

// instructor
const GET_INSTRUCTOR = gql`
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

// admin
const GET_ADMIN = gql`
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

// email_from_token
const GET_EMAIL = gql`
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
const QUERY_USERS = gql`
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
