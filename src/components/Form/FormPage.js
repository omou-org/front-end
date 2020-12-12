import React, {Fragment, useCallback, useEffect, useState} from "react";
import {Redirect, useParams} from "react-router-dom";

import BackButton from "components/OmouComponents/BackButton.js";
import Form from "./Form";
import Forms from "./FormFormats";

const FormPage = () => {
    const {type, id} = useParams();
    const {form, load, submit, title} = Forms?.[type] || {};
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

    const withDefaultData = form?.reduce((data, {name, fields}) => ({
        ...data,
        [name]: {
            ...fields.filter((field) => typeof field.default !== "undefined")
                .reduce((sectionData, field) => ({
                    ...sectionData,
                    [field.name]: field.default,
                }), {}),
            ...initialData?.[name],
        },
    }), {});

    const getTitle = () => {
        if (id) {
            return title.edit || `${title} Editing`;
        }
        if (title == 'Add New Class'){
            return title.create
        } else {
        return title.create || `${title} Registration`;
        }
    };

    if (!form || (id && initialData === null)) {
        return <Redirect to="/PageNotFound" />;
    }
    
    return (
        <Fragment>
            <BackButton />
            <Form base={form} initialData={withDefaultData} onSubmit={onSubmit}
                title={getTitle()} />
        </Fragment>
    );
};

export default FormPage;
