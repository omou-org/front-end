import React from "react";
import PropTypes from "prop-types";

import Loading from "./Loading";

const LoadingHandler = ({loading, error, children, ...props}) => {
    if (loading) {
        return <Loading {...props} />;
    }
    if (error) {
        return "Error loading!";
    }
    return children;
};

LoadingHandler.propTypes = {
    "children": PropTypes.node,
    "error": PropTypes.bool.isRequired,
    "loading": PropTypes.bool.isRequired,
};

export default LoadingHandler;
