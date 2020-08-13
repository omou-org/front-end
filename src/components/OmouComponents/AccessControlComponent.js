import React from "react";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";



const AccessControlComponent = ({permittedAccountTypes, children}) => {
    const { accountType } = useSelector(({ auth }) => auth) || [];
    if(!permittedAccountTypes.includes(accountType)) return null
    return (
        <>
        {children}
        </>
    )
};

AccessControlComponent.propTypes = {
    "permittedAccountTypes": PropTypes.string
}

export default AccessControlComponent;