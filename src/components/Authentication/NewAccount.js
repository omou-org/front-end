import React, {useState} from "react";

import {Link, useParams} from "react-router-dom";
import useStyles from "./styles.js";

import Form from "../Form/Form";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import * as Fields from "../Form/FormFormats";
import {TextField} from "mui-rff";
import {FORM_ERROR} from "final-form";
import * as Yup from "yup";
import gql from "graphql-tag";
import {useApolloClient} from "@apollo/react-hooks";


const NewAccount = () => {
    const client = useApolloClient();
    const {type} = useParams();
    const classes = useStyles();
    const [submitted, setSubmitted] = useState(false);


    const Receipt = ({formData}) => (
        <>
            <Typography>You can now log in to your account</Typography>
            <Button component={Link} to={{
                "pathname": "/login",
                "state": {"email": formData.basicInfo.email},
            }} variant="outlined">Back to login
            </Button>
        </>
    );

    const FORMS = {
        "parent": {
            "form": [
                {
                    "name": "basicInfo",
                    "label": "Basic Information",
                    "fields": [
                        ...Fields.NAME_FIELDS,
                        Fields.EMAIL_FIELD,
                        Fields.PASSWORD_FIELD,
                        Fields.PHONE_NUMBER_FIELD,
                    ],
                },
                {
                    "name": "moreInfo",
                    "label": "More About You",
                    "fields": [
                        Fields.BIRTH_DATE_FIELD,
                        {
                            "name": "grade",
                            "label": "Grade",
                            "component": <TextField />,
                            "validator": Yup.number()
                                .typeError("Grade must be a number.")
                                .integer()
                                .min(1)
                                .max(13),
                        },
                        {
                            "name": "school",
                            ...Fields.stringField("School"),
                        },
                    ],
                },
            ],
            "submit": async (formData) => {
                setSubmitted(true);
                const CREATE_PARENT = gql`
                mutation CreateParentAccount($firstName: String!, $lastName: String!, $email: String!, $password: String!, $phoneNumber: String) {
                    createParent(user: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}, phoneNumber: $phoneNumber) {
                        parent {
                            accountType
                        }
                    }
                }`;

                try {
                    await client.mutate({
                        "mutation": CREATE_PARENT,
                        "variables": Object.values(formData)
                            .reduce((obj, section) => ({
                                ...obj,
                                ...section,
                            }), {}),
                    });
                    setSubmitted(true);
                } catch (error) {
                    return {
                        [FORM_ERROR]: error,
                    };
                }
            },
        },
        "student": {
            "form": [
                {
                    "name": "basicInfo",
                    "label": "Basic Information",
                    "fields": [
                        ...Fields.NAME_FIELDS,
                        Fields.EMAIL_FIELD,
                        Fields.PASSWORD_FIELD,
                        Fields.PHONE_NUMBER_FIELD,
                    ],
                },
            ],
            "submit": async (formData) => {
                setSubmitted(true);
                const CREATE_STUDENT = gql`
                mutation CreateStudentAccount($firstName: String!, $lastName: String!, $password: String!, $email: String!, $parent: ID!, $phoneNumber: String, $grade: Int!, $birthDate: Date!) {
                    createStudent(user: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}, phoneNumber: $phoneNumber, primaryParent: $parent, grade: $grade, birthDate: $birthDate) {
                        student {
                            accountType
                        }
                    }
                }`;

                try {
                    await client.mutate({
                        "mutation": CREATE_STUDENT,
                        "variables": Object.values(formData)
                            .reduce((obj, section) => ({
                                ...obj,
                                ...section,
                            }), {}),
                    });
                    setSubmitted(true);
                } catch (error) {
                    return {
                        [FORM_ERROR]: error,
                    };
                }
            },
        },
    };

    const {submit, form} = FORMS[type];

    return (
        <Paper className={classes.root} style={{
            "width": 800,
            "height": "auto",
        }}>
            <Form base={form} onSubmit={submit} receipt={Receipt} stepperOrientation="horizontal" title={submitted ? "account created" : `create a ${type} account`} />
        </Paper>
    );
};

export default NewAccount;
