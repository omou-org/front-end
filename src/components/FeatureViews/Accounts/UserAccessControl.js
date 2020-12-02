import React from "react";
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";

/**
 * @description only allow a the logged in user access to a component
 * */
export default function UserAccessControl({children, user}) {
	const AuthUser = useSelector(({auth}) => auth);
	if (user?.user_id == AuthUser.user.id || user?.user?.id === AuthUser.user.id) {
		return (<div>
			{children}
		</div>)
	}
	return <Redirect to="/PageNotFound"/>;
}
