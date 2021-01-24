import * as types from "actions/actionTypes";
import {createTutoringDetails, submitRegistration} from "../OmouComponents/RegistrationUtils";
import {instance} from "actions/apiActions";
import React from "react";
import {FORM_ERROR} from "final-form";
import * as Fields from "./Fields";
import {StudentSelect} from "./Fields";
import * as Yup from "yup";
import * as moment from "moment";
import {client} from "index";
import gql from "graphql-tag";
import {fullName} from "../../utils";
import TutoringPriceQuote from "./TutoringPriceQuote";

Yup.addMethod(Yup.array, 'unique', function (message, mapper = a => a) {
    return this.test('unique', message, function (list) {
        return list.length === new Set(list.map(mapper)).size;
    });
});

export const submitToApi = (endpoint, data, id) => (id ?
    instance.patch(`${endpoint}${id}/`, data) :
    instance.post(endpoint, data));

export const parseDate = (date) => {
    if (!date) {
        return null;
    }
    if (typeof date === "string") {
        return date.substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
};

export const selectField = (options) => ({
        "component": <Fields.Select data={options} />,
        "validator": Yup.mixed().oneOf(options.map(({value}) => value)),
    }),
    stringField = (label) => ({
        "component": <Fields.TextField />,
        label,
        "validator": Yup.string().matches(
            /[a-zA-Z][^#&<>"~;$^%{}?]+$/u,
            `Invalid ${label}`,
        ),
    });

const SEARCH_INSTRUCTORS = gql`
    query InstructorSearch($query: String!) {
        accountSearch(query: $query, profile: "INSTRUCTOR") {
            results {
                ... on InstructorType {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const userMap = ({accountSearch}) => accountSearch.results.map(({user}) => ({
    "label": `${user.firstName} ${user.lastName}`,
    "value": user.id,
}));

const instructorSelect = (name) => (
    <Fields.DataSelect name={name} 
        optionsMap={userMap}
        request={SEARCH_INSTRUCTORS}
        noOptionsText="No instructors available"/>
);


const STATE_OPTIONS = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
    "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
    "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
    "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA",
    "WV", "WI", "WY",
];

const DAY_OF_WEEK_OPTIONS = [
    {
        "label" : "Sunday",
        "value" : "SUNDAY"
    },
    {
        "label": "Monday",
        "value": "MONDAY",
    },
    {
        "label": "Tuesday",
        "value": "TUESDAY"
    },
    {
        "label": "Wednesday",
        "value": "WEDNESDAY"
    },
    {
        "label": "Thursday",
        "value": "THURSDAY"
    },
    {
        "label": "Friday",
        "value": "FRIDAY"
    },
    {
        "label": "Saturday",
        "value": "SATURDAY"
    },
]

export const ACADEMIC_LVL_FIELD = {
        "name": "academicLevel",
        "label": "Grade",
        ...selectField([
            {
                "label": "Elementary School",
                "value": "ELEMENTARY_LVL",
            },
            {
                "label": "Middle School",
                "value": "MIDDLE_LVL",
            },
            {
                "label": "High School",
                "value": "HIGH_LVL",
            },
            {
                "label": "College",
                "value": "COLLEGE_LVL",
            },
        ]),
    },
    ADDRESS_FIELD = {
        "name": "address",
        ...stringField("Address"),
    },
    BIRTH_DATE_FIELD = {
        "name": "birthDate",
        "label": "Birth Date",
        "component": <Fields.DatePicker format="MM/DD/YYYY" openTo="year" />,
        "validator": Yup.date().max(moment()),
    },
    CITY_FIELD = {
        "name": "city",
        ...stringField("City"),
    },
    EMAIL_FIELD = {
        "name": "email",
        "label": "Email",
        "component": <Fields.TextField />,
        "validator": Yup.string().email(),
        "required": true,
    },
    GENDER_FIELD = {
        "name": "gender",
        "label": "Gender",
        ...selectField([
            {
                "label": "Do Not Disclose",
                "value": "UNSPECIFIED",
            },
            {
                "label": "Male",
                "value": "MALE",
            },
            {
                "label": "Female",
                "value": "FEMALE",
            },
        ]),
    },
    INSTRUCTOR_CONFIRM_FIELD = {
        "name": "isConfirmed",
        "label": "",
        "component": <Fields.Checkboxes
            data={[
                {
                    "label": "Did Instructor Confirm?",
                    "value": false,
                },
            ]} />,
        "validator": Yup.boolean(),
    },
    NAME_FIELDS = [
        {
            "name": "firstName",
            ...stringField("First Name"),
            "required": true,
        },
        {
            "name": "lastName",
            ...stringField("Last Name"),
            "required": true,
        },
    ],
    PHONE_NUMBER_FIELD = {
        "name": "phoneNumber",
        "label": "Phone Number",
        "component": <Fields.PhoneInput />,
        "validator": Yup.string().matches(/(^[(]\d{3}[)][- ]?\d{3}[- ]?\d{4}?$)/u,
            "Invalid phone number"),
    },
    POSITIVE_NUMBER_FIELD = {
        "component": <Fields.TextField />,
        "validator": Yup.number().min(0),
    },
    START_DATE_FIELD = {
        "name": "startDate",
        "label": "Start Date",
        "required": "true",
        "component": <Fields.DatePicker format="MM/DD/YYYY" />,
        "validator": Yup.date(),
    },
    END_DATE_FIELD = {
        "name" : "endDate",
        "label" : "End Date",
        "required": "true",
        "component": <Fields.DatePicker format="MM/DD/YYYY" />,
        "validator" : Yup.date(),
    },
    START_TIME_FIELD = {
        "name": "startTime",
        "label": "Start Time",
        "component": <Fields.TimePicker format="hh:mm a" />,
        "validator": Yup.date(),
    },
    END_TIME_FIELD = {
        "name" : "endTime",
        "label" : "End Time",
        "component": <Fields.TimePicker format="hh:mm a" />,
        "validator" : Yup.date(),
    },
    STATE_FIELD = {
        "name": "state",
        "label": "State",
        "component": <Fields.Autocomplete options={STATE_OPTIONS} textFieldProps={{
            "fullWidth": false,
        }} />,
        "validator": Yup.mixed().oneOf([...STATE_OPTIONS, null], "Invalid state"),
    },
    ZIPCODE_FIELD = {
        "name": "zipcode",
        "label": "Zip Code",
        "component": <Fields.TextField textInputProps={{"fullWidth": false}} />,
        "validator": Yup.string().matches(/^\d{5}(?:[-\s]\d{4})?$/u,
            "Invalid zipcode"),
    };
    
const INSTRUCTOR_FIELDS = {
    "name": "basicInfo",
    "label": "Basic Information",
    "fields": [
        ...NAME_FIELDS,
        EMAIL_FIELD,
        PHONE_NUMBER_FIELD,
        GENDER_FIELD,
        ADDRESS_FIELD,
        CITY_FIELD,
        ZIPCODE_FIELD,
        STATE_FIELD,
        BIRTH_DATE_FIELD,
    ],
};

const PARENT_FIELDS = {
    "name": "parent",
    "label": "Parent Information",
    "fields": [
        ...NAME_FIELDS,
        {
            "name": "relationship",
            "label": "Relationship to Student",
            ...selectField([
                {
                    "label": "Mother",
                    "value": "MOTHER",
                },
                {
                    "label": "Father",
                    "value": "FATHER",
                },
                {
                    "label": "Guardian",
                    "value": "GUARDIAN",
                },
                {
                    "label": "Other",
                    "value": "OTHER",
                },
            ]),
            "required": true,
        },
        GENDER_FIELD,
        EMAIL_FIELD,
        PHONE_NUMBER_FIELD,
        BIRTH_DATE_FIELD,
        ADDRESS_FIELD,
        CITY_FIELD,
        STATE_FIELD,
        ZIPCODE_FIELD,
    ],
};

const STUDENT_INFO_FIELDS = {
    "name": "student_info",
    "label": "Student Information",
    "fields": [
        {
            "name": "current_instructor",
            ...stringField("Current Instructor in School"),
        },
        {
            "name": "textbook",
            ...stringField("Textbook Used"),
        },
        {
            "name": "current_grade",
            ...stringField("Current Grade in Class"),
            "validator": Yup.string().matches(/([ABCDFabcdf][+-]?)?$/u),
        },
        {
            "name": "topic",
            ...stringField("Current Topic in School / Topic of Interest"),
        },
        {
            "name": "strength",
            ...stringField("Student Strengths"),
        },
        {
            "name": "weakness",
            ...stringField("Student Weaknesses"),
        },
    ],
};
const BUSINESS_INFO_FIELDS = [
    {
        "name": "name",
        "required": "true",
        ...stringField("Business Info")
    },
    {
        "name": "phone",
        "required": "true",
        ...stringField("Business Phone")
    },
    {
        "name": "email",
        "required": "true",
        ...stringField("Business Email")
    },
    {
        "name": "address",
        "required": "true",
        ...stringField("Business Address")
    }
]

const TUTORING_COURSE_SECTIONS = [
    {
        "name": "tutoring_details",
        "label": "Tutoring Details",
        "fields": [
            {
                "name": "instructor",
                "label": "Instructor",
                "component": instructorSelect("instructor"),
                "validator": Yup.mixed(),
            },
            {
                "name": "course",
                ...stringField("Course Name"),
            },
            INSTRUCTOR_CONFIRM_FIELD,
            {
                ...START_DATE_FIELD,
                "required": true,
            },
            {
                ...START_TIME_FIELD,
                "required": true,
            },
        ],
    },
    {
        "name": "tuition",
        "label": "Tuition Quote Tool",
        "fields": [
            {
                // TODO: price quote tool
                "name": "price",
                "label": "Price",
                "component": <TutoringPriceQuote courseType="TUTORING" />,
                "validator": Yup.mixed(),
            },
        ],

    },
];

const SEARCH_PARENTS = gql`
    query ParentSearch($query: String!) {
        accountSearch(query: $query, profile: "PARENT") {
            results {
                ... on ParentType {
                    user {
                        id
                        firstName
                        lastName
                    }
                }
            }
        }
    }
`;

const GET_CATEGORIES = gql`
    query GetCategories {
        courseCategories {
            id
            name
        }
    }
`;

const GET_COURSES = gql`
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

const parentSelect = (name) => (
    <Fields.DataSelect name={name} 
        optionsMap={userMap}
        request={SEARCH_PARENTS}
        noOptionsText="No parents available"/>
);

const courseMap = ({courses}) => courses.map(({title, instructor, id}) =>
    ({
        "label": `${title} - ${fullName(instructor.user)}`,
        "value": id,
    }));
const openCourseMap = ({courses}) => courses
    .filter(({maxCapacity, enrollmentSet}) => (maxCapacity > enrollmentSet.length))
    .map(({title, instructor, id}) => ({
        "label": `${title} - ${fullName(instructor.user)}`,
        "value": id,
    }));

const categoryMap = ({courseCategories}) => courseCategories
    .map(({id, name}) => ({
        "label": name,
        "value": id,
    }));

const categorySelect = (name) => (
    <Fields.DataSelect name={name} 
        optionsMap={categoryMap}
        request={GET_CATEGORIES}
        noOptionsText="No categories available"/>
);

const schoolMap = ({schools}) => schools.map(({name, id}) => ({
    "label": name,
    "value": id,
}));

const GET_SCHOOLS = gql`
    query GetSchools {
        schools {
            name
            id
        }
    }`;

const schoolSelect = (name) => (
    <Fields.DataSelect name={name} 
        optionsMap={schoolMap}
        request={GET_SCHOOLS}
        noOptionsText="No schools available"/>
);

const GET_USER_TYPE = gql`
    query GET_USER_TYPE($id: ID!) {
        userInfo(userId: $id) {
            ... on StudentType {
                accountType
            }
            ... on ParentType {
                accountType
            }
        }
    }`;

export default {
    "student": {
        "title": "Student",
        "form": [
            {
                "name": "student",
                "label": "Student Information",
                "fields": [
                    {
                        "name": "primaryParent",
                        "label": "Parent",
                        "component": parentSelect("primaryParent"),
                        "validator": Yup.mixed(),
                    },
                    ...NAME_FIELDS,
                    {
                        ...EMAIL_FIELD,
                        "required": false,
                    },
                    GENDER_FIELD,
                    {
                        "name": "grade",
                        "label": "Grade",
                        "component": <Fields.TextField />,
                        "validator": Yup.number()
                            .typeError("Grade must be a number.")
                            .integer()
                            .min(1)
                            .max(13),
                    },
                    BIRTH_DATE_FIELD,
                    {
                        "name": "school",
                        "label": "School",
                        "component": schoolSelect("school"),
                        "validator": Yup.mixed(),
                    },
                    PHONE_NUMBER_FIELD,
                    ADDRESS_FIELD,
                    CITY_FIELD,
                    STATE_FIELD,
                    ZIPCODE_FIELD,
                ],
            },
        ],
        "load": async (id) => {
            try {
                const {"data": {userInfo}} = await client.query({
                    "query": GET_USER_TYPE,
                    "variables": {id},
                });
                if (userInfo.accountType === "PARENT") {
                    const GET_NAME = gql`
                query GetName($id: ID!) {
                    parent(userId: $id) {
                        user {
                            firstName
                            lastName
                        }
                    }
                }`;
                    const {"data": {parent}} = await client.query({
                        "query": GET_NAME,
                        "variables": {id},
                    });
                    return {
                        "student": {
                            "primaryParent": {
                                "label": `${parent.user.firstName} ${parent.user.lastName}`,
                                "value": id,
                            },
                        },
                    };
                } else if (userInfo.accountType === "STUDENT") {
                    const GET_INFO = gql`
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
                }`;
                    const {"data": {student}} = await client.query({
                        "query": GET_INFO,
                        "variables": {id},
                    });

                    const modifiedData = {
                        ...student,
                        "firstName": student.user.firstName,
                        "lastName": student.user.lastName,
                        "email": student.user.email,
                        "school": student.school && {
                            "label": student.school.name,
                            "value": student.school.id,
                        },
                        "primaryParent": student.primaryParent && {
                            "label": `${student.primaryParent.user.firstName} ${student.primaryParent.user.lastName}`,
                            "value": student.primaryParent.user.id,
                        },
                    };
                    // delete modifiedData.pr;
                    delete modifiedData.user;

                    return {
                        "student": modifiedData,
                    };
                }
            } catch (err) {
                console.error(err);
            }
            return null;
        },
        "submit": async ({student}, id) => {
            const ADD_STUDENT = gql`
            mutation AddStudent(
            $firstName: String!,
            $email: String,
            $lastName: String!,
            $address: String,
            $birthDate:Date,
            $city:String,
            $gender:GenderEnum,
            $grade:Int,
            $phoneNumber:String,
            $primaryParent:ID,
            $school:ID,
            $zipcode:String,
            $state:String,
            $id: ID) {
                createStudent(user: {firstName: $firstName, id: $id, lastName: $lastName,  email:$email}, address: $address, birthDate: $birthDate, school: $school, grade: $grade, gender: $gender, primaryParent: $primaryParent, phoneNumber: $phoneNumber, city: $city, state: $state, zipcode: $zipcode) {
                    created
                    student {
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
            }`;

            const GET_ALL_STUDENTS = gql`
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
                }`
    

            try {
                await client.mutate({
                    "mutation": ADD_STUDENT,
                    "variables": {
                        ...student,
                        id,
                        "email": student.email || "",
                        "birthDate": parseDate(student.birthDate),
                        "primaryParent": student.primaryParent.value,
                        "school": student.school.value,
                    },
                    "update": (cache, { data }) => {
                        const newStudent = data.createStudent;

                        const cachedStudents = cache.readQuery({
                            query: GET_ALL_STUDENTS
                        })["students"] || []

                        let updatedStudents = [...cachedStudents];

                        updatedStudents.push(newStudent);

                        cache.writeQuery({
                            data: {
                                "students": updatedStudents
                            },
                            query: GET_ALL_STUDENTS
                        });
                    }
                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
        },
    },
    "parent": {
        "title": "Parent",
        "form": [PARENT_FIELDS],
        "load": async (id) => {
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
            }`;

            try {
                const {"data": {parent}} = await client.query({
                    "query": GET_PARENT,
                    "variables": {id},
                });
                return {
                    "parent": {
                        ...parent.user,
                        ...parent,
                    },
                };
            } catch (error) {
                return null;
            }
        },
        "submit": async ({parent}, id) => {
            const CREATE_PARENT = gql`
            mutation CreateParentAccount(
                $firstName: String!, $lastName: String!, $email: String!,
                $password: String, $phoneNumber: String, $address: String,
                $birthDate: Date, $city: String, $state: String, $id: ID,
                $zipcode: String, $relationship: RelationshipEnum, $gender: GenderEnum
            ) {
                createParent(
                    user: {
                        firstName: $firstName, lastName: $lastName, id: $id,
                        email: $email, password: $password
                    },
                    city: $city, address: $address, gender: $gender,
                    birthDate: $birthDate,  phoneNumber: $phoneNumber,
                    zipcode: $zipcode, relationship: $relationship,
                    state: $state,
                ) {
                    created
                }
            }`;
            try {
                await client.mutate({
                    "mutation": CREATE_PARENT,
                    "variables": {
                        ...parent,
                        "birthDate": parseDate(parent.birthDate),
                        id,
                        "password": "",
                    },
                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
        },
    },
    "admin": {
        "title": "Administrator",
        "form": [
            {
                "name": "login",
                "label": "Login Details",
                "fields": [
                    EMAIL_FIELD,
                    {
                        "name": "password",
                        "label": "Password",
                        "component": <Fields.TextField type="password" />,
                        "validator": Yup.mixed(),
                        "required": true,
                    },
                    ...NAME_FIELDS,
                ],
            },
            {
                "name": "user",
                "label": "User Information",
                "fields": [
                    {
                        "name": "adminType",
                        "label": "Admin Type",
                        ...selectField([
                            {
                                "label": "Owner",
                                "value": "OWNER",
                            },
                            {
                                "label": "Receptionist",
                                "value": "RECEPTIONIST",
                            },
                            {
                                "label": "Assistant",
                                "value": "ASSISTANT",
                            },
                        ]),
                        "required": true,
                    },
                    GENDER_FIELD,
                    BIRTH_DATE_FIELD,
                    ADDRESS_FIELD,
                    CITY_FIELD,
                    PHONE_NUMBER_FIELD,
                    STATE_FIELD,
                    ZIPCODE_FIELD,
                ],
            },
        ],
        "load": async (id) => {
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
            }`;
            try {
                const {"data": {admin}} = await client.query({
                    "query": GET_ADMIN,
                    "variables": {
                        "userID": id,
                    },
                });
                return {
                    "login": admin.user,
                    "user": admin,
                };
            } catch (error) {
                return null;
            }
        },
        "submit": async (formData, id) => {
            const CREATE_ADMIN = gql`
            mutation CreateAdmin(
                $address: String,
                $adminType: AdminTypeEnum!,
                $birthDate: Date,
                $city: String,
                $gender: GenderEnum,
                $phoneNumber: String,
                $id: ID,
                $state: String,
                $email: String,
                $firstName: String!,
                $lastName: String!,
                $password: String,
                $zipcode: String
            ) {
                createAdmin(
                    user: {
                        firstName: $firstName, lastName: $lastName,
                        password: $password, email: $email,
                        id: $id,
                    },
                    address: $address,
                    adminType: $adminType,
                    birthDate: $birthDate,
                    city: $city,
                    gender: $gender,
                    phoneNumber: $phoneNumber,
                    state: $state,
                    zipcode: $zipcode
                ) {
                    admin {
                        accountType
                        adminType
                        userUuid
                        birthDate
                        address
                        city
                        phoneNumber
                        state
                        zipcode
                        user {
                            email
                            firstName
                            id
                            lastName
                        }
                    }
                }
            }
            `;

            const GET_ALL_ADMINS = gql`
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
                  }`;

            const modifiedData = {
                ...formData,
                "user": {
                    ...formData.user,
                    "birthDate": parseDate(formData.user.birthDate),
                },
            };

            const adminMutationVariable = Object.values(modifiedData)
            .reduce((obj, section) => ({
                ...obj,
                ...section,
            }), {});

            const userUuid = `${adminMutationVariable.firstName.charAt(0).toLowerCase()}${adminMutationVariable.lastName}`

            try {
                await client.mutate({
                    "mutation": CREATE_ADMIN,
                    "variables": {
                        ...adminMutationVariable,
                        id,
                        userUuid
                    },
                    "update": (cache, { data: { createAdmin: { admin } } }) => {
                        const newAdmin = {
                            accountType: admin.accountType,
                            adminType: admin.adminType,
                            phoneNumber: admin.phoneNumber,
                            user: admin.user,
                            userUuid: admin.userUuid
                        }

                        const cachedAdmins = cache.readQuery({
                            query: GET_ALL_ADMINS
                        })["admins"] || []

                        let updatedAdmins = [...cachedAdmins, newAdmin]

                        cache.writeQuery({
                            data: {
                                "admins": updatedAdmins
                            },
                            query: GET_ALL_ADMINS
                        })
                    }
                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
        },
    },
    "pricing": {
        "title": "Pricing",
        "form": [
            {
                "name": "pricing",
                "label": "Pricing",
                "fields": [
                    {
                        "name": "name",
                        ...stringField("Name"),
                        "required": true,
                    },
                    {
                        "name": "category",
                        "label": "Category",
                        "required": true,
                        // TODO: category selector
                        "component": <Fields.TextField />,
                        "validator": Yup.mixed(),
                    },
                    {
                        ...ACADEMIC_LVL_FIELD,
                        "required": true,
                    },
                    {
                        "name": "course_type",
                        "label": "Course Size",
                        "required": true,
                        ...selectField([
                            {
                                "label": "Tutoring",
                                "value": "tutoring",
                            },
                            {
                                "label": "Small Group",
                                "value": "small_group",
                            },
                            {
                                "label": "Class",
                                "value": "class",
                            },
                        ]),
                    },
                    {
                        "name": "hourlyTuition",
                        "label": "Hourly Tuition ($)",
                        "required": true,
                        ...POSITIVE_NUMBER_FIELD,
                    },
                ],
            },
        ],
        // this form does not support edits at the moment
        "load": () => {},
        "submit": async (dispatch, {pricing}, id) => {
            try {
                const response = await submitToApi("/pricing/rule/", pricing, id);
                dispatch({
                    "type": types.POST_PRICE_RULE_SUCCESS,
                    "payload": response,
                });
            } catch ({response}) {
                return {
                    "pricing": Object.entries(response.data)
                        .reduce((obj, [key, error]) => ({
                            ...obj,
                            [key]: error[0],
                        }), {}),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
    "course_details": {
        "title": "Class",
        "form": [
            {
                "name": "courseDescription",
                "label": "Course Description",
                "fields": [
                    {
                        "name": "title",
                        "required": true,
                        ...stringField("Course Name"),
                    },
                    {
                        "name": "description",
                        ...stringField("Course Description"),
                    },
                    {
                        ...ACADEMIC_LVL_FIELD,
                        "required": true,
                    },
                    {
                        "name": "courseCategory",
                        "label": "Subject",
                        "required": "true",
                        "component": categorySelect("courseCategory"),
                        "validator": Yup.mixed(),
                    },
                    {
                        "name": "instructor",
                        "label": "Select Instructor",
                        "component": instructorSelect("instructor"),
                        "validator": Yup.mixed(),
                    },
                    INSTRUCTOR_CONFIRM_FIELD,
                    //!TODO FIX TO DISPLAY N NUMBER OF OTPIONS
                    {
                        "name": "maxCapacity",
                        "label": "Capacity",
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(1)
                            .integer(),
                    },
                ],
                "next": "dayAndTime",
            },
            {
                "name" : "dayAndTime",
                "label" : "Day & Time",
                "fields" : [
                    START_DATE_FIELD,
                    END_DATE_FIELD,
                    {
                        "name": "weekday1",
                        "label": "Day of Week",
                        "required": "true",
                        ...selectField(DAY_OF_WEEK_OPTIONS)
                    },
                    {
                        "name": "startTime1",
                        "label": "Start Time",
                        "required" : "true",
                        "component": <Fields.TimePicker format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                    {
                        "name": "endTime1",
                        "label": "End Time",
                        "required" : "true",
                        "component": <Fields.TimePicker width={50} format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                    {
                        "name": "weekday2",
                        "label": "Day of Week",
                        ...selectField(DAY_OF_WEEK_OPTIONS)
                    },
                    {
                        "name": "startTime2",
                        "label": "Start Time",
                        "component": <Fields.TimePicker format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                    {
                        "name": "endTime2",
                        "label": "End Time",
                        "component": <Fields.TimePicker format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                    {
                        "name": "weekday3",
                        "label": "Day of Week",
                        ...selectField(DAY_OF_WEEK_OPTIONS)
                    },
                    {
                        "name": "startTime3",
                        "label": "Start Time",
                        "component": <Fields.TimePicker format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                    {
                        "name": "endTime3",
                        "label": "End Time",
                        "component": <Fields.TimePicker format="hh:mm a" />,
                        "validator": Yup.date(),
                    },
                ],
                "next": "tuition",
            },
            {
                "name": "tuition",
                "label": "Tuition",
                "fields": [
                    {
                        "name": "room",
                        "label": "Room",
                        "required": true,
                        "component": <Fields.TextField/>,
                        "validator": Yup.string(),
                    },
                    {
                        "name": "totalTuition",
                        "label": "Total Tuition",
                        "required": true,
                        "component": <Fields.TextField/>,
                        "validator": Yup.number().min(0),
                    },
                ],
            },
        ],
        "load": async (id) => {
            const GET_COURSE = gql`
            query CourseFetch($id: ID!) {
                course(courseId: $id) {
                    title
                    id
                    description
                    instructor {
                        user {
                            id
                            firstName
                            lastName
                        }
                    }
                    startDate
                    maxCapacity
                    courseCategory {
                        id
                        name
                    }
                    academicLevel
                    endDate
                    totalTuition
                    hourlyTuition
                    isConfirmed
                }
            }`;

            try {
                const {"data": {course}} = await client.query({
                    "query": GET_COURSE,
                    "variables": {
                        id,
                    },
                });

                const {"instructor": {user}} = course;
                return {
                    "courseDescription": {
                        "title": course.title,
                        "description": course.description,
                        "isConfirmed": course.isConfirmed,
                        "maxCapacity": course.maxCapacity,
                        "instructor": {
                            "label": `${user.firstName} ${user.lastName}`,
                            "value": user.id,
                        },
                        "startDate": moment(course.startDate, "YYYY-MM-DD"),
                        "startTime": moment(course.startTime, "HH:mm:ss"),
                    },
                    "tuition": {
                        "academicLevel": course.academicLevel,
                        "courseCategory": {
                            "label": course.courseCategory.name,
                            "value": course.courseCategory.id,
                        },
                        "duration": moment(course.endTime, "HH:mm:ss").diff(
                            moment(course.startTime, "HH:mm:ss"), "hours", true,
                        ),
                        "numSessions": moment(course.endDate, "YYYY-MM-DD")
                            .diff(moment(course.startDate, "YYYY-MM-DD"), "weeks") + 1,
                        "hourlyTuition": course.hourlyTuition,
                        "totalTuition": course.totalTuition,
                    },
                };
            } catch (error) {
                console.log(error)
                return null;
            }
        },
        "submit": async (formData, id) => {
            const CREATE_COURSE = gql`
            mutation	createCourse(
                $id: ID,
                $startDate: DateTime, $endDate: DateTime
                $availabilities: [CourseAvailabilityInput], $academicLevel: AcademicLevelEnum, $courseCategory: ID,
                $description: String, $instructor:ID, $isConfirmed:Boolean, $maxCapacity: Int, $totalTuition: Decimal,
                $title: String!) {
            createCourse(
                  id: $id,
                  title: $title,
                  description:$description,
                  courseType: CLASS,
                  academicLevel: $academicLevel,
                  instructor: $instructor,
                  startDate: $startDate,
                  endDate: $endDate,
                  room: "Stanford Room",
                  maxCapacity: $maxCapacity,
                  courseCategory: $courseCategory,
                  totalTuition: $totalTuition,
                  isConfirmed: $isConfirmed,
                  availabilities: $availabilities
              ) {
                  created
                  course {
                      academicLevelPretty
                      id
                      title
                      description
                      courseType
                      academicLevel
                      startDate
                      endDate
                      instructor {
                          user {
                              firstName
                              lastName
                          }
                      }
                      }
                  }
              }
            `;

            const { courseDescription, dayAndTime, tuition  } = formData;
            const availabilities = (() => {
                const availabilityList = [
                    {
                        "dayOfWeek": dayAndTime.weekday1,
                        "startTime": dayAndTime.startTime1.format("HH:mm"),
                        "endTime":  dayAndTime.endTime1.format("HH:mm"),
                    }
                ]
                if (dayAndTime.weekday2 && dayAndTime.startTime2 && dayAndTime.EndTime2){
                    availabilities.push(
                        {
                            "dayOfWeek": dayAndTime.weekday2,
                            "startTime": dayAndTime.startTime2 ? dayAndTime.startTime2.format("HH:mm") : null,
                            "endTime": dayAndTime.endTime2 ? dayAndTime.endTime2.format("HH:mm") : null,
                        }
                    );
                }
                if (dayAndTime.weekday3 && dayAndTime.startTime3 && dayAndTime.EndTime3) {
                    availabilities.push(
                        {
                            "dayOfWeek": dayAndTime.weekday3,
                            "startTime": dayAndTime.startTime3 ? dayAndTime.startTime3.format("HH:mm"): null,
                            "endTime": dayAndTime.endTime3 ? dayAndTime.endTime3.format("HH:mm"): null
                        }
                    );
                }
                return availabilityList;

            })();
            const modifiedData = {
                "courseDescription": {
                    ...courseDescription,
                    "instructor": courseDescription.instructor.value,
                    "courseCategory": courseDescription.courseCategory.value,
                },
                "dayAndTime": {
                    "startDate": dayAndTime.startDate,
                    "endDate": dayAndTime.endDate,
                    availabilities,
                },
                "tuition": {
                    ...tuition,
                    "courseCategory": courseDescription.courseCategory.value,
                },
            };
            const courseFormFields = Object.values(modifiedData)
                .reduce((obj, section) => ({
                    ...obj,
                    ...section,
                }), {});
            const editedCourseFormFields = {
                id,
                ...courseFormFields,
            }
            try {
                await client.mutate({
                    "mutation": CREATE_COURSE,
                    "variables": id ? editedCourseFormFields : courseFormFields,
                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
        },
    },
    "instructor": {
        "title": "Instructor",
        "form": [
            INSTRUCTOR_FIELDS,
            {
                "name": "experience",
                "label": "Experience",
                "fields": [
                    {
                        "name": "subjects",
                        "label": "Subjects Tutor Can Teach",
                        "component": React.cloneElement(
                            categorySelect("subjects"),
                            {"multiple": true},
                        ),
                        "validator": Yup.array().of(
                            Yup.object().shape({
                                label: Yup.string(),
                                value: Yup.string(),
                            })
                        ).unique("Can't select the same subjects!", (field) => (field.value)),
                        "default": [],
                    },
                    {
                        "name": "experience",
                        "label": "Years of Experience",
                        ...POSITIVE_NUMBER_FIELD,
                    },
                    {
                        "name": "biography",
                        ...stringField("Background"),
                    },
                    {
                        "name": "language",
                        ...stringField("Languages"),
                    },
                ],
            },
        ],
        "load": async (id) => {
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
                }`;
            try {
                const {"data": {instructor}} = await client.query({
                    "query": GET_INSTRUCTOR,
                    "variables": {
                        "userID": id,
                    },
                });
                return {
                    "basicInfo": {
                        "firstName": instructor.user.firstName,
                        "lastName": instructor.user.lastName,
                        "email": instructor.user.email,
                        "phoneNumber": instructor.phoneNumber,
                        "gender": instructor.gender,
                        "address": instructor.address,
                        "city": instructor.city,
                        "zipcode": instructor.zipcode,
                        "state": instructor.state,
                        "birthDate": moment(instructor.birthDate, "YYYY-MM-DD"),
                    },
                    "experience": {
                        "subjects": instructor.subjects.map(({name, id}) => ({
                            "label": name,
                            "value": id,
                        })),
                        "experience": instructor.experience,
                        "biography": instructor.biography,
                        "language": instructor.language,
                    },
                };
            } catch (error) {
                return null;
            }
        },
        "submit": async (formData, id) => {
            const CREATE_INSTRUCTOR = gql`
            mutation CreateInstructor(
            $id: ID,
            $firstName: String!,
            $lastName: String!,
            $email: String,
            $phoneNumber: String,
            $gender: GenderEnum,
            $address: String,
            $city: String,
            $state: String,
            $subjects: [ID],
            $experience: String,
            $biography: String,
            $language: String,
            $birthDate: Date,
            $zipcode: String,
            ) {
                createInstructor(
                user: {
                    firstName: $firstName,
                    lastName: $lastName,
                    email: $email,
                    password: "abcdefg",
                    id: $id
                },
                address: $address,
                biography: $biography,
                birthDate: $birthDate,
                city: $city,
                experience: $experience,
                gender: $gender,
                language: $language,
                phoneNumber: $phoneNumber,
                subjects: $subjects,
                state: $state,
                zipcode: $zipcode
                ) {
                    created
                    instructor {
                        user {
                          id
                        }
                      }
                }
            }`;

            const INVITE_INSTRUCTOR = gql`
            mutation InviteInstructor($email:String!) {
  inviteInstructor(email: $email) {
    status
  }
}
`;
            const { basicInfo, experience } = formData;

            const modifiedData = {
                "basicInfo": {
                    ...basicInfo,
                    "birthDate": basicInfo.birthDate ? basicInfo.birthDate.toISOString().substr(0, 10) :
                        "2020-01-01",
                },
                "experience": {
                    ...experience,
                    "subjects": experience.subjects.map(({value}) => value),
                },
            };

            const instructorMutationVariable = Object.values(modifiedData)
                .reduce((obj, section) => {
                    return ({
                        ...obj,
                        ...section,
                    })
                }, {});
            try {
                await client.mutate({
                    "mutation": CREATE_INSTRUCTOR,
                    "variables": {
                        ...instructorMutationVariable,
                        id,
                    }

                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
            await client.mutate({
                "mutation": INVITE_INSTRUCTOR,
                "variables": {
                    "email": formData.basicInfo.email,
                },
            });
        },
    },
    "business-info": {
        "title": "Business Information",
        "form": [
            BUSINESS_INFO_FIELDS
        ],
        "load": async (id) => {
            const GET_BUSINESS_INFO = gql`

            `
        },
        "submit": async(formData, id) => {
            const CREATE_BUSINESS = gql`
                mutation createBusiness($name: String, $phone: String, $email: String, $address: String) {
                    createBusiness(name: $name, phone: $phone, email: $email, address: $address){
                        business{
                            id
                        }
                    }
                }
            `;
            const {businessInfo} = formData;
            const modifiedData = {
                "businessInfo": {
                    ...businessInfo
                }
            }
        }
    },
    "class-registration": {
        "title": "Class",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [
                    {
                        "name": "student",
                        "label": "Student",
                        "component": <Fields.StudentSelect />,
                        "validator": Yup.mixed(),
                    },
                ],
            },
            STUDENT_INFO_FIELDS,
            {
                "name": "course",
                "label": "Course",
                "fields": [
                    {
                        "name": "class",
                        "label": "Class",
                        "component": <Fields.DataSelect name="Classes" 
                            optionsMap={openCourseMap}
                            request={GET_COURSES}
                            noOptionsText="No classes available"/>,
                        "validator": Yup.mixed(),
                    },
                ],
            },
        ],
        "submit": (formData) => {
            const {dispatch} = window.store;
            dispatch({
                type: types.ADD_CLASS_REGISTRATION,
                payload: {
                    courseId: formData.course.class.value,
                    studentId: formData.student.student,
                }
            })
        }
    },
    "tutoring-registration": {
        "title": "Tutoring",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [
                    {
                        "name": "student",
                        "label": "Student",
                        "component": <Fields.StudentSelect />,
                        "validator": Yup.mixed(),
                    },
                ],
            },
            STUDENT_INFO_FIELDS,
            ...TUTORING_COURSE_SECTIONS,
        ],
        "submit": (formData) => {
            const course = createTutoringDetails("tutoring", formData);
            submitRegistration(formData.selectStudent, course);
        },

    },
    "small-group-registration": {
        "title": "New Small Group Tutoring",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [
                    {
                        "name": "student",
                        "label": "Student",
                        "component": <StudentSelect/>,
                        "validator": Yup.mixed(),
                    },
                ],
            },
            STUDENT_INFO_FIELDS,
            ...TUTORING_COURSE_SECTIONS,
        ],
        "submit": (formData) => {
            console.log(formData, moment(formData.tutoring_details.startDate, "DD-MM-YYYY").add(formData.sessions, 'weeks'));
            const course = createTutoringDetails("smallGroup", formData);
            submitRegistration(formData.selectStudent, course);
        }
    },
    "course_category": {
        "title": "Course",
        "form": [
            {
                "name": "student",
                "label": "Student",
                "fields": [
                    {
                        "name": "student",
                        "label": "Student",
                        "component": <Fields.StudentSelect />,
                        "validator": Yup.mixed(),
                    },
                ],
            },
            STUDENT_INFO_FIELDS,
            ...TUTORING_COURSE_SECTIONS,
        ],
        "submit": (formData) => {
            const course = createTutoringDetails("smallGroup", formData);
            submitRegistration(formData.selectStudent, course);
        },
    },
};
