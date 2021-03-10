import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const AccessControlComponent = ({ permittedAccountTypes, children }) => {
    // AUTH selector
    const { accountType } = useSelector(({ auth }) => auth) || [];
    if (!permittedAccountTypes.includes(accountType)) return null;
    return <>{children}</>;
};

AccessControlComponent.propTypes = {
    permittedAccountTypes: PropTypes.arrayOf(PropTypes.string),
};

export default AccessControlComponent;
