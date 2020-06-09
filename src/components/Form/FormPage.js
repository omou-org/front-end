import React, {useCallback, useEffect, useState} from "react";
import {Redirect, useParams} from "react-router-dom";

import BackButton from "../BackButton.js";
import Form from "./Form";
import Forms from "./FormFormats";
import Paper from "@material-ui/core/Paper";

const FormPage = () => {
    const {type, id} = useParams();
    const {form, load, submit, title} = Forms[type];
    const [initialData, setInitialData] = useState();
    const onSubmit =
        useCallback((formData) => submit(formData, id), [id, submit]);

    useEffect(() => {
        if (id) {
            let abort = false;
            (async () => {
                const data = await load(id);
                if (!abort) {
                    setInitialData(data);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [id, load]);

    if (!form || (id && initialData === null)) {
        return <Redirect push to="/PageNotFound" />;
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
