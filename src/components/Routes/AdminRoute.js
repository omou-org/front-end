import React, {useCallback} from "react";
import {Redirect, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

const AdminRoute = ({component, children, render, ...rest}) => {
    const {token, isAdmin} = useSelector(({auth}) => auth);

    const renderFunc = useCallback(() => (token && isAdmin ?
        component || children || (render && render(rest)) :
        <Redirect push to="/login" />),
    [token, isAdmin, component, children, render, rest]);

    return (
        <Route {...rest} render={renderFunc} />
    );
};

AdminRoute.propTypes = {
    "children": PropTypes.node,
    "component": PropTypes.node,
    "render": PropTypes.func,
};

export default AdminRoute;
