import React, {useCallback} from "react";

import {Redirect, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

import Form from "./Form";
import Forms from "./FormFormats";

const FormPage = () => {
    const dispatch = useDispatch();
    const {type, id} = useParams();
    const {form, load, submit} = Forms[type];
    const initialData = load(id);
    const onSubmit = useCallback((formData) => submit(dispatch, formData, id),
        [dispatch, id, submit]);

    if (!form || (id && initialData === null)) {
        return <Redirect to="/PageNotFound" />;
    }

    return (
        <Form base={form} initialData={initialData} onSubmit={onSubmit} />
    );
};

export default FormPage;
