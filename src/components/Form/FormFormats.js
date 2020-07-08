/* eslint-disable react-hooks/rules-of-hooks */
import * as types from "actions/actionTypes";
import {instance} from "actions/apiActions";
import {useSelector} from "react-redux";
import React from "react";
import {FORM_ERROR} from "final-form";
import * as Fields from "./Fields";
import {StudentSelect} from "./Fields";
import * as Yup from "yup";
import * as hooks from "actions/hooks";
import * as moment from "moment";
import {client} from "index";
import gql from "graphql-tag";
import {fullName} from "../../utils";
import TutoringPriceQuote from "./TutoringPriceQuote";
import {createTutoringDetails, submitRegistration} from "../OmouComponents/RegistrationUtils";

export const responseToForm = (parser, data) => {
    const res = {};
    Object.entries(data).forEach(([key, message]) => {
        if (parser.hasOwnProperty(key)) {
            let match;
            if (Array.isArray(message)) {
                match = parser[key];
                res[match[0]] = res[match[0]] || {};
                res[match[0]][match[1]] = message.join();
            } else {
                // Object of errors, recursion time
                Object.entries(responseToForm(parser[key], message)).forEach(([k2, obj]) => {
                    res[k2] = {
                        ...res[k2] || {},
                        ...obj,
                    };
                });
            }
        }
    });
    return res;
};

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

export const formToRequest = (parser, data) => {
    const body = {};
    Object.entries(parser).forEach(([key, path]) => {
        if (Array.isArray(path)) {
            body[key] = data[path[0]][path[1]];
        } else {
            // Object, recursion time
            body[key] = formToRequest(parser[key], data);
        }
    });
    return body;
};

export const selectField = (options) => ({
        "component": <Fields.Select data={options} />,
        "validator": Yup.mixed().oneOf(options.map(({value}) => value)),
    }),
    stringField = (label) => ({
        "component": <Fields.TextField />,
        label,
        "validator": Yup.string().matches(/[a-zA-Z][^#&<>"~;$^%{}?]+$/u,

            `Invalid ${label}`),
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
	<Fields.DataSelect name={name} optionsMap={userMap}
					   request={SEARCH_INSTRUCTORS}/>
);


const STATE_OPTIONS = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
];

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
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
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
    HOURLY_TUITION_FIELD = {
        "component": <Fields.TextField />,
        "validator": Yup.number().min(0),
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
        "required": true,
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
        "component": <Fields.TextField />,
        "validator": Yup.string().matches(/\d{3}-?\d{3}-?\d{4}?/u,
            "Invalid phone number"),
    },
    START_DATE_FIELD = {
        "name": "startDate",
        "label": "Start Date",
        "component": <Fields.KeyboardDatePicker format="MM/dd/yyyy" />,
        "validator": Yup.date(),
    },
    START_TIME_FIELD = {
        "name": "startTime",
        "label": "Start Time",
        "component": <Fields.KeyboardTimePicker format="hh:mm"/>,
        "validator": Yup.date(),
    },
    STATE_FIELD = {
        "name": "state",
        "label": "State",
        "component": <Fields.Autocomplete options={STATE_OPTIONS} textFieldProps={{
            "fullWidth": false,
        }} />,
        "validator": Yup.mixed().oneOf(STATE_OPTIONS, "Invalid state"),
    },
    ZIPCODE_FIELD = {
        "name": "zipcode",
        "label": "Zip Code",
        "component": <Fields.TextField textInputProps={{"fullWidth": false}} />,
        "validator": Yup.string().matches(/^\d{5}(?:[-\s]\d{4})?$/u,
            "Invalid zipcode"),
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
                    "value": "mother",
                },
                {
                    "label": "Father",
                    "value": "father",
                },
                {
                    "label": "Guardian",
                    "value": "guardian",
                },
                {
                    "label": "Other",
                    "value": "other",
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
				"component": <TutoringPriceQuote courseType={"TUTORING"}/>,
				"validator": Yup.mixed(),
			},
		],

	},];

const SEARCH_STUDENTS = gql`
    query StudentSearch($query: String!) {
        accountSearch(query: $query, profile: "STUDENT") {
            results {
                ... on StudentType {
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
        instructor {
          user {
            lastName
            firstName
          }
        }
      }
    }
`;

const studentSelect = (name) => (
	<Fields.DataSelect name={name} optionsMap={userMap}
					   request={SEARCH_STUDENTS}/>
);

const courseMap = ({courses}) => courses.map(({title, instructor, id}) => ({
	"label": `${title} - ${fullName(instructor.user)}`,
	"value": id,
}));

const categoryMap = ({courseCategories}) => courseCategories.map(({id, name}) => ({
    "label": name,
    "value": id,
}));

const categorySelect = (name) => (
    <Fields.DataSelect name={name} optionsMap={categoryMap}
        request={GET_CATEGORIES} />
);

export default {
    "student": {
        "title": "Student",
        "form": [
            {
                "name": "student",
                "label": "Student Information",
                "fields": [
                    ...NAME_FIELDS,
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
                        ...stringField("School"),
                    },
                    PHONE_NUMBER_FIELD,
                ],
            },
            PARENT_FIELDS,
        ],
        "load": (id) => {
            const studentStatus = hooks.useStudent(id);
            const {parent_id, ...student} = useSelector(({Users}) => Users.StudentList[id]) || {};
            hooks.useParent(parent_id);
            const {relationship, ...parent} = useSelector(({Users}) => Users.ParentList[parent_id]) || {};
            if (hooks.isFail(studentStatus)) {
                return null;
            }
            return {
                student,
                "parent": {
                    ...parent,
                    "relationship": (relationship || "").toLowerCase(),
                },
            };
        },
        "submit": async (dispatch, formData, id) => {
            const studentResponseToFormKey = {
                "gender": ["student", "gender"],
                "birth_date": ["student", "birthday"],
                "address": ["parent", "address"],
                "city": ["parent", "city"],
                "phone_number": ["student", "phone_number"],
                "state": ["parent", "state"],
                "zipcode": ["parent", "zipcode"],
                "grade": ["student", "grade"],
                "school": ["student", "school"],
                "user": {
                    "first_name": ["student", "first_name"],
                    "last_name": ["student", "last_name"],
                    "email": ["student", "email"],
                },
            };
            const parentResponseToFormKey = {
                "gender": ["parent", "gender"],
                "birth_date": ["parent", "birthday"],
                "address": ["parent", "address"],
                "city": ["parent", "city"],
                "phone_number": ["student", "phone_number"],
                "state": ["parent", "state"],
                "zipcode": ["parent", "zipcode"],
                "relationship": ["parent", "relationship"],
                "user": {
                    "first_name": ["parent", "first_name"],
                    "last_name": ["parent", "last_name"],
                    "email": ["parent", "email"],
                },
            };
            const parent = formToRequest(parentResponseToFormKey, formData);
            parent.birth_date = parseDate(parent.birth_date);
            const student = formToRequest(studentResponseToFormKey, formData);
            try {
                const parentResponse = await instance.post("/account/parent/",
                    parent);
                dispatch({
                    "type": types.POST_PARENT_SUCCESSFUL,
                    "payload": parentResponse,
                });
                student.primary_parent = parentResponse.id;
                const studentResponse = await submitToApi("/account/student/", student, id);
                dispatch({
                    "type": types.POST_STUDENT_SUCCESSFUL,
                    "payload": studentResponse,
                });
            } catch ({response}) {
                return {
                    ...responseToForm(studentResponseToFormKey, response.data),
                    ...responseToForm(parentResponseToFormKey, response.data),
                    [FORM_ERROR]: response.data,
                };
            }
        },
    },
    "parent": {
        "title": "Parent",
        "form": [PARENT_FIELDS],
        // TODO: loading and submitting with GraphQL
        "load": (id) => {},
        "submit": async (dispatch, formData, id) => {},
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
                $adminType: AdminTypeEnum,
                $birthDate: Date,
                $city: String,
                $gender: GenderEnum,
                $phoneNumber: String,
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
                        password: $password, email: $email
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
            const modifiedData = {
                ...formData,
                "user": {
                    ...formData.user,
                    "birthDate": parseDate(formData.user.birthDate),
                },
            };
            try {
                await client.mutate({
                    "mutation": CREATE_ADMIN,
                    "variables": Object.values(modifiedData)
                        .reduce((obj, section) => ({
                            ...obj,
                            ...section,
                        }), {}),
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
                        ...HOURLY_TUITION_FIELD,
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
        "title": "Course Information",
        "form": [
            {
                "name": "courseInfo",
                "label": "Course Info",
                "fields": [
                    {
                        "name": "title",
                        "required": true,
                        ...stringField("Course Name"),
                    },
                    {
                        "name": "description",
                        ...stringField("Description"),
                    },
                    {
                        "name": "instructor",
                        "label": "Instructor",
                        "component": instructorSelect("instructor"),
                        "validator": Yup.mixed(),
                    },
                    INSTRUCTOR_CONFIRM_FIELD,
                    START_DATE_FIELD,
                    START_TIME_FIELD,
                    {
                        "name": "maxCapacity",
                        "label": "Capacity",
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(1)
                            .integer(),
                    },
                ],
                "next": "tuition",
            },
            {
                "name": "tuition",
                "label": "Tuition",
                "fields": [
                    {
                        "name": "courseCategory",
                        "label": "Category",
                        "required": "true",
                        "component": categorySelect("courseCategory"),
                        "validator": Yup.mixed(),
                    },
                    {
                        ...ACADEMIC_LVL_FIELD,
                        "label": "Grade Level",
                        "required": true,
                    },
                    {
                        "name": "duration",
                        "label": "Duration",
                        "required": "true",
                        ...selectField([
                            {
                                "label": "0.5 Hours",
                                "value": 0.5,
                            },
                            {
                                "label": "1 Hour",
                                "value": 1,
                            },
                            {
                                "label": "1.5 Hours",
                                "value": 1.5,
                            },
                            {
                                "label": "2 Hours",
                                "value": 2,
                            },
                        ]),
                    },
                    {
                        "name": "hourlyTuition",
                        "label": "Hourly Tuition",
                        "required": true,
                        ...HOURLY_TUITION_FIELD,
                    },
                    {
                        "name": "numSessions",
                        "label": "# of Weekly Sessions",
                        "required": true,
                        "component": <Fields.TextField />,
                        "validator": Yup.number().min(1)
                            .integer(),
                    },
                    {
                        "name": "totalTuition",
                        "label": "Total Tuition",
                        "required": true,
                        "component": <Fields.TextField />,
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
                    startTime
                    maxCapacity
                    courseCategory {
                    id
                    name
                    }
                    academicLevel
                    endDate
                    endTime
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
                    "courseInfo": {
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
                return null;
            }
        },
        "submit": async (formData, id) => {
            const CREATE_COURSE = gql`
            mutation CreateCourse($startDate:DateTime, $endDate:DateTime, $startTime:Time!, $endTime:Time!, $academicLevel:AcademicLevelEnum,$courseCategory:ID, $description:String, $hourlyTuition:Decimal, $instructor:ID, $isConfirmed:Boolean, $maxCapacity:Int, $totalTuition: Decimal, $title:String!) {
  createCourse(endTime: $endTime, startTime: $startTime, title: $title, maxCapacity: $maxCapacity, isConfirmed: $isConfirmed, instructor: $instructor, hourlyTuition: $hourlyTuition, academicLevel: $academicLevel, course_category: $courseCategory, courseType: CLASS, description: $description, endDate: $endDate, startDate: $startDate, totalTuition: $totalTuition) {
    course {
      id
    }
  }
}
            `;

            const {courseInfo, tuition} = formData;
            const modifiedData = {
                "courseInfo": {
                    ...courseInfo,
                    "instructor": courseInfo.instructor.value,
                    "endDate": courseInfo.startDate
                        .add(tuition.numSessions - 1, "w"),
                    "endTime": courseInfo.startTime.add(tuition.duration, "h")
                        .format("HH:mm"),
                    "startTime": courseInfo.startTime.format("HH:mm"),
                },
                "tuition": {
                    ...tuition,
                    "courseCategory": tuition.courseCategory.value,
                    "duration": formData.tuition.duration.value,
                },
            };
            try {
                await client.mutate({
                    "mutation": CREATE_COURSE,
                    "variables": Object.values(modifiedData)
                        .reduce((obj, section) => ({
                            ...obj,
                            ...section,
                        }), {}),
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
            {
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
            },
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
                        "validator": Yup.mixed(),
                        "default": [],
                    },
                    {
                        "name": "experience",
                        ...stringField("Teaching Experience (Years)"),
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
                        "birthDate": instructor.birthDate,
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
            mutation CreateInstructor($firstName: String!, $lastName: String!, $email: String, $phoneNumber: String, $gender: GenderEnum, $address: String, $city: String, $state: String, $subjects: [ID], $experience: String, $biography: String, $language: String, $birthDate: Date, $zipcode: String) {
                createInstructor(user: {firstName: $firstName, lastName: $lastName, email: $email, password: "abcdefgh"}, address: $address, biography: $biography, birthDate: $birthDate, city: $city, experience: $experience, gender: $gender, language: $language, phoneNumber: $phoneNumber, subjects: $subjects, state: $state, zipcode: $zipcode) {
                    instructor {
                    user {
                        id
                    }
                    }
                }
            }
            `;

            const {basicInfo, experience} = formData;
            const modifiedData = {
                basicInfo,
                "experience": {
                    ...experience,
                    "subjects": experience.subjects.map(({value}) => value),
                },
            };

            try {
                await client.mutate({
                    "mutation": CREATE_INSTRUCTOR,
                    "variables": Object.values(modifiedData)
                        .reduce((obj, section) => ({
                            ...obj,
                            ...section,
                        }), {}),
                });
            } catch (error) {
                return {
                    [FORM_ERROR]: error,
                };
            }
        },
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
						"component": <StudentSelect/>,
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
						"component": <Fields.DataSelect name="Classes" optionsMap={courseMap} request={GET_COURSES}/>,
						"validator": Yup.mixed(),
                    },
                ],
            },
        ],
		"submit": (formData) => {
			submitRegistration(formData.selectStudent, formData.course.class.value);
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
			const course = createTutoringDetails("tutoring", formData);
            console.log(course);
			submitRegistration(formData.selectStudent, course);
		}

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
			console.log(course);
			submitRegistration(formData.selectStudent, course);
		}
	},
    "course_category": {
        "title": "Course",
        "form": [
            {
                "name": "category",
                "label": "Category Details",
                "fields": [
                    {
                        "name": "name",
                        ...stringField("Category Name"),
                        "required": true,
                    },
                    {
                        "name": "description",
                        ...stringField("Description"),
                    },
                ],
            },
        ],
    },
    // "discount"
};
