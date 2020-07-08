import React, { useState, useEffect } from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import buildGraphQLProvider from 'ra-data-graphql-simple';
import { useApolloClient } from "@apollo/react-hooks";
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

const history = createBrowserHistory();

const ManageCategories2 = () => {
    const [categories, setCategories] = useState({})
    const [dataProvider, setDataProvider] = useState({})

    const client = useApolloClient();



    useEffect(() => {
        buildGraphQLProvider({ client: client })
            .then((result) => {
                setDataProvider(result)
            });
    }, [])

    return (
        <Admin dataProvider={dataProvider} history={history}>
            <Resource name="posts" list={ListGuesser} />
        </Admin>
    )
}


export default ManageCategories2
