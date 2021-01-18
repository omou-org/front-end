import React, { useCallback } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { USER_TYPES } from 'utils';
import { useSelector } from 'react-redux';

const AuthenticatedRoute = ({
    component,
    children,
    render,
    users = Object.values(USER_TYPES),
    ...rest
}) => {
    const { accountType, token } = useSelector(({ auth }) => auth);

    const renderFunc = useCallback(
        () => component || children || (render && render(rest)),
        [component, children, render, rest]
    );

    if (!token) {
        return <Redirect push to='/login' />;
    }
    if (!users.includes(accountType)) {
        return <Redirect to='/PageNotFound' />;
    }

    return <Route {...rest} render={renderFunc} />;
};

AuthenticatedRoute.propTypes = {
    children: PropTypes.node,
    component: PropTypes.node,
    render: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.oneOf(Object.values(USER_TYPES))),
};

export default AuthenticatedRoute;
