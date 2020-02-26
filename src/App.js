// React
import React, {useEffect, useMemo} from "react";
import * as authActions from "actions/authActions";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {instance} from "actions/apiActions";

// Material UI
import CssBaseline from "@material-ui/core/CssBaseline";

// Local Component Imports
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import "./theme/theme.scss";

const App = () => {
    const dispatch = useDispatch();
    const token = useSelector(({auth}) => auth.token) || localStorage.getItem("authToken");
    const bound = useMemo(() => bindActionCreators(authActions, dispatch), [dispatch]);
    useEffect(() => {
        bound.fetchUserStatus(token);
        instance.defaults.headers.common.Authorization = `Token ${token}`;
    }, [bound, token]);
    return (
        <div className="App">
            <CssBaseline />
            <Navigation />
        </div>
    );
};

export default App;
