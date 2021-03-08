import gql from 'graphql-tag';

// FormFormats.js
export const ADD_STUDENT = gql`
    mutation AddStudent(
        $firstName: String!
        $email: String
        $lastName: String!
        $address: String
        $birthDate: Date
        $city: String
        $gender: GenderEnum
        $grade: Int
        $phoneNumber: String
        $primaryParent: ID
        $school: ID
        $zipcode: String
        $state: String
        $id: ID
    ) {
        createStudent(
            user: {
                firstName: $firstName
                id: $id
                lastName: $lastName
                email: $email
            }
            address: $address
            birthDate: $birthDate
            school: $school
            grade: $grade
            gender: $gender
            primaryParent: $primaryParent
            phoneNumber: $phoneNumber
            city: $city
            state: $state
            zipcode: $zipcode
        ) {
            created
        }
    }
`;

export const CREATE_INSTRUCTOR = gql`
    mutation CreateInstructor(
        $id: ID
        $firstName: String!
        $lastName: String!
        $email: String
        $phoneNumber: String
        $gender: GenderEnum
        $address: String
        $city: String
        $state: String
        $subjects: [ID]
        $experience: String
        $biography: String
        $language: String
        $birthDate: Date
        $zipcode: String
    ) {
        createInstructor(
            user: {
                firstName: $firstName
                lastName: $lastName
                email: $email
                password: "abcdefg"
                id: $id
            }
            address: $address
            biography: $biography
            birthDate: $birthDate
            city: $city
            experience: $experience
            gender: $gender
            language: $language
            phoneNumber: $phoneNumber
            subjects: $subjects
            state: $state
            zipcode: $zipcode
        ) {
            created
            instructor {
                user {
                    id
                }
            }
        }
    }
`;

export const CREATE_ADMIN = gql`
    mutation CreateAdmin(
        $address: String
        $adminType: AdminTypeEnum!
        $birthDate: Date
        $city: String
        $gender: GenderEnum
        $phoneNumber: String
        $id: ID
        $state: String
        $email: String
        $firstName: String!
        $lastName: String!
        $password: String
        $zipcode: String
    ) {
        createAdmin(
            user: {
                firstName: $firstName
                lastName: $lastName
                password: $password
                email: $email
                id: $id
            }
            address: $address
            adminType: $adminType
            birthDate: $birthDate
            city: $city
            gender: $gender
            phoneNumber: $phoneNumber
            state: $state
            zipcode: $zipcode
        ) {
            admin {
                userUuid
                birthDate
                address
                city
                phoneNumber
                state
                zipcode
            }
        }
    }
`;

// dataProvider.js

export const ADD_SCHOOL = gql`
    mutation createSchool($zipcode: String, $name: String, $district: String) {
        createSchool(zipcode: $zipcode, name: $name, district: $district) {
            school {
                id
                name
                zipcode
                district
            }
        }
    }
`;

export const UPDATE_SCHOOL = gql`
    mutation updateSchool(
        $id: ID!
        $name: String!
        $zipcode: String
        $district: String
    ) {
        createSchool(
            id: $id
            name: $name
            zipcode: $zipcode
            district: $district
        ) {
            school {
                district
                id
                name
                zipcode
            }
        }
    }
`;

// cypress/support/command.js

export const CREATE_ADMIN_FOR_TEST = `
mutation CreateOwner {
      __typename
      createAdmin(adminType: OWNER,
        user: {
          email: "b@starkindustries.com",
          firstName: "Tony",
          lastName: "Stark",
          password: "Ironman3000!"
        },
        birthDate: "1970-05-29",
        address: "10880 Malibu Point",
        city: "Point Dume",
        gender: MALE,
        phoneNumber: "1234567890",
        state: "CA",
        zipcode: "90265") {
        admin {
          address
          adminType
          user {
            email
            firstName
            id
            isStaff
            isSuperuser
            lastName
            username
            password
          }
        }
      }
    }
`;

export const CREATE_RECEIPTION_FOR_TEST = `
mutation CreateReceptionist {
  createAdmin(
  adminType: RECEPTIONIST,
  user: {
    email: "pepper@starkindustries.com",
    firstName: "Pepper",
    lastName: "Potts",
    password: "Ironman3000!"
    },
    phoneNumber: "1234567890",
    state: "CA") {
    admin {
      address
      adminType
      user {
        email
        firstName
        id
        lastName
        username
        password
      }
    }
  }
}
`;

// Notes.js
export const CREATE_NOTES = gql`
    mutation CreateAccountNote(
        $ownerID: ID!
        $title: String
        $body: String
        $complete: Boolean
        $important: Boolean
        $id: ID
    ) {
        createAccountNote(
            userId: $ownerID
            title: $title
            important: $important
            body: $body
            complete: $complete
            id: $id
        ) {
            accountNote {
                id
                body
                complete
                important
                timestamp
                title
            }
        }
    }
`;
