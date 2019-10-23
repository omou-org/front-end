import {NavLink, useLocation} from "react-router-dom";
import React, {useCallback} from "react";
import PropTypes from "prop-types";

const NavLinkNoDup = ({to, ...rest}) => {
    const {pathname} = useLocation();

    const handleClick = useCallback((event) => {
        if (pathname === to) {
            event.preventDefault();
        }
    }, [to, pathname]);

    return (
        <NavLink
            {...rest}
            onClick={handleClick}
            to={to} />
    );
};

NavLinkNoDup.propTypes = {
    "to": PropTypes.string.isRequired,
};

export default NavLinkNoDup;
