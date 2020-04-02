const GENDER_OPTIONS = [
    {
        "label": "Do Not Disclose",
        "value": "U",
    },
    {
        "label": "Male",
        "value": "M",
    },
    {
        "label": "Female",
        "value": "F",
    },
];

const studentForm = [
    {
        "name": "student",
        "label": "Student Information",
        "fields": [
            {
                "name": "first_name",
                "label": "First Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "last_name",
                "label": "Last Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "gender",
                "label": "Gender",
                "type": "select",
                "options": GENDER_OPTIONS,
            },
            {
                "name": "grade",
                "label": "Grade",
                "type": "number",
                "min": 1,
                "max": 13,
                "integer": true,
            },
            {
                "name": "birthday",
                "label": "Birth Date",
                "type": "date",
                "min": new Date("1900"),
                "max": new Date(),
            },
            {
                "name": "school",
                "label": "School",
                "type": "string",
            },
            {
                "name": "phone_number",
                "label": "Phone Number",
                "type": "phone",
            },
        ],
    },
    {
        "name": "parent",
        "label": "Parent Information",
        "fields": [
            {
                "name": "first_name",
                "label": "First Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "last_name",
                "label": "Last Name",
                "type": "name",
                "required": true,
            },
            {
                "name": "relationship",
                "label": "Relationship to Student",
                "type": "select",
                "required": true,
                "options": [
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
                ],
            },
            {
                "name": "gender",
                "label": "Gender",
                "type": "select",
                "options": GENDER_OPTIONS,
            },
            {
                "name": "email",
                "label": "Parent Email",
                "type": "email",
                "required": true,
            },
            {
                "name": "phone_number",
                "label": "Phone Number",
                "type": "phone",
                "required": true,
            },
            {
                "name": "birth_date",
                "label": "Birth Date",
                "type": "date",
                "min": new Date("1900"),
                "max": new Date(),
            },
            {
                "name": "address",
                "label": "Address",
                "type": "address",
            },
            {
                "name": "city",
                "label": "City",
                "type": "string",
            },
            {
                "name": "state",
                "label": "State",
                "type": "autocomplete",
                "options": [
                    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
                    "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
                    "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
                    "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
                    "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
                    "WY",
                ],
            },
            {
                "name": "zipcode",
                "label": "Zip Code",
                "type": "zipcode",
            },
        ],
    },
];

export default {
    "student": studentForm,
};
