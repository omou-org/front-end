

import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import moment from "moment-timezone";
import Navigation from "./components/Navigation/Navigation";

import "./theme/theme.scss";

import React, { useState, useEffect } from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import buildGraphQLProvider from 'ra-data-graphql-simple';
import { useApolloClient } from "@apollo/react-hooks";
import { createBrowserHistory } from 'history';


Moment.globalMoment = moment;
Moment.globalTimezone = "America/Los_Angeles";

const App = () => {
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
        <>
            <Admin dataProvider={dataProvider} >
                <Resource name="posts" list={ListGuesser} />
            </Admin>
            <div className="App">
                <CssBaseline />
                <Navigation />
            </div>
        </>
    )
};




export default App;
