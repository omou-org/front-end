import React, {useCallback, useState} from "react";

import {Redirect, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

import Form from "./Form";
import Forms from "./FormFormats";


import Paper from "@material-ui/core/Paper";
import BackButton from "../BackButton.js";

const FormPage = () => {
    const dispatch = useDispatch();
    const {type, id} = useParams();
    let {form, load, submit, title} = Forms[type];
    const initialData = load(id);
    const onSubmit = useCallback((formData) => submit(dispatch, formData, id),
        [dispatch, id, submit]);

    const [formVariables, setFormVariables] = useState({});

    form = form.map(({fields, ...section}) => ({
        ...section,
        "fields": fields.map(({onChange, ...field}) => {
            console.log(onChange)
            return {
                ...field,
                "onChange": onChange //&& ((params) => {
                //     const updates = onChange(params);
                //     if (updates) {
                //         setFormVariables((variables) => ({
                //             ...variables,
                //             ...updates,
                //         }));
                //     }
                // }),
            }
        }),
    }));

    // const handleChange

    // // const next;
    // const variables = useState({})

    // next = form[1]


    // const handleConditional = (field, func) => {
    //     setVariables({
    //         ...variables,
    //         // ...field.handleConditional(field value)
    //     });
    //     if (func()) showField
    //     else hideField
    // }

    if (!form || (id && initialData === null)) {
        return <Redirect to="/PageNotFound" />;
    }

    return (

        <Paper>
            <BackButton />
        <Form base={form} initialData={initialData} onSubmit={onSubmit}
            title={`${title} ${id ? "Editing" : "Registration"}`} />

        </Paper>
    );
};

export default FormPage;
