import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';

import Form from './Form';
import Forms from './FormFormats';

function useRouteQuery() {
    return new URLSearchParams(useLocation().search);
}

const FormPage = () => {
    const { type, id, action } = useParams();
    const query = useRouteQuery();
    const parentIdOfNewStudent = query.get('parentId');
    const { form, load, submit, title } = Forms?.[type] || {};
    const [initialData, setInitialData] = useState();
    const onSubmit = useCallback(
        (formData) => submit(formData, id, parentIdOfNewStudent),
        [id, submit, parentIdOfNewStudent]
    );
    useEffect(() => {
        if (id || parentIdOfNewStudent) {
            let abort = false;
            (async () => {
                const data = await load(id, parentIdOfNewStudent);
                if (!abort) {
                    setInitialData(data);
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [id, load, parentIdOfNewStudent]);

    const withDefaultData = form?.reduce(
        (data, { name, fields }) => ({
            ...data,
            [name]: {
                ...fields
                    .filter((field) => typeof field.default !== 'undefined')
                    .reduce(
                        (sectionData, field) => ({
                            ...sectionData,
                            [field.name]: field.default,
                        }),
                        {}
                    ),
                ...initialData?.[name],
            },
        }),
        {}
    );

    const getTitle = (title) => {
        if (action === 'edit') {
            return title.edit || `Edit ${title}`;
        } else {
            if (title === 'Class') {
                return 'Create New Class';
            }
            return title.create || `Add New ${title}`;
        }
    };

    if (!form || (id && initialData === null)) {
        return <Redirect to='/PageNotFound' />;
    }

    return (
        <Fragment>
            <Form
                base={form}
                initialData={withDefaultData}
                onSubmit={onSubmit}
                title={getTitle(title)}
            />
        </Fragment>
    );
};

export default FormPage;
