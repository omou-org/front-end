import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

/**
 * @description only allow a the logged in user access to a component
 * */
export default function UserAccessControl({ children, userID }) {
    const AuthUser = useSelector(({ auth }) => auth);
    if (userID === AuthUser.user.id) {
        return <div>{children}</div>;
    }
    return <Redirect to='/PageNotFound' />;
}
