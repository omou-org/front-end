import React, {useCallback} from "react";
import {Redirect, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

const ProtectedRoute = ({component, render, ...rest}) => {
    const token = useSelector(({auth}) => auth.token);

    const renderFunc = useCallback(
        () => token
            ? component || render && render(rest)
            : <Redirect
                push
                to="/login" />,
        [token, component, render, rest]
    );

    return (
        <Route
            {...rest}
            exact
            render={renderFunc} />
    );
};

ProtectedRoute.propTypes = {
    "component": PropTypes.any,
    "render": PropTypes.func,
};

export default ProtectedRoute;
