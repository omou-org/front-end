import React, {useCallback} from "react";
import {Redirect, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

const ProtectedRoute = ({component, children, render, ...rest}) => {
    const token = useSelector(({auth}) => auth.token);

    const renderFunc = useCallback(() => (token ?
        component || children || (render && render(rest)) :
        <Redirect push to="/login" />),
    [token, component, render, rest, children]);

    return (
        <Route {...rest} render={renderFunc} />
    );
};

ProtectedRoute.propTypes = {
    "children": PropTypes.node,
    "component": PropTypes.node,
    "render": PropTypes.func,
};

export default ProtectedRoute;
