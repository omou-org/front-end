import React from "react";
import { useSelector } from "react-redux";



const AccessControlComponent = ({permittedAccountTypes, children}) => {
    const { accountType } = useSelector(({ auth }) => auth) || [];
    console.log(permittedAccountTypes.includes(accountType))
    if(!permittedAccountTypes.includes(accountType)) return null
    return (
        <>
        {children}
        </>
    )
};

export default AccessControlComponent;