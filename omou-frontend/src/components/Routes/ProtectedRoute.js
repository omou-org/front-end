import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";

function ProtectedRoute({component, render, auth, ...rest}) {
    return (
        <Route
            {...rest}
            render={() =>
                auth.token
                    ? component || (render && render(rest))
                    : <Redirect push to="/login" />
            } />
    );
}

ProtectedRoute.propTypes = {
    component: PropTypes.any,
    render: PropTypes.func,
    auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProtectedRoute);
