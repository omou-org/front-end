import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import PropTypes from "prop-types";

/**
 * @description only allow a the logged in user access to a component
 * */
function UserAccessControl({children, userID}) {
	const AuthUser = useSelector(({auth}) => auth);
	if (userID === AuthUser.user.id) {
		return <div>{children}</div>;
	}
	return <Redirect to='/PageNotFound'/>;
}

UserAccessControl.propTypes = {
	children: PropTypes.object,
	userID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default UserAccessControl;