// React Imports


import { Route, Switch, Redirect } from "react-router-dom";


import React from "react";

// Local Component Imports


import ProtectedRoute from "./ProtectedRoute";
import SearchResults from '../FeatureViews/Search/SearchResults';
import AccountResults from '../FeatureViews/Search/FilterAccountsPage'


function SearchRoutes(props) {
    props.registrationActions.resetSubmitStatus();
    return (
        <Switch>

            <ProtectedRoute
                exact
                path="/search/all/:query?"
                render={(passedProps) => <SearchResults {...passedProps} />} />

            <ProtectedRoute
                exact
                path="/search/account/:query?"
                render={(passedProps) => <AccountResults {...passedProps} />} />

            {/* <ProtectedRoute
                path="/search/course/:query?"
                render={(passedProps) => <SearchResults {...passedProps} />} /> */}


        </Switch>
    );
}

export default SearchRoutes;
