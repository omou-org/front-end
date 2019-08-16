import React from "react";
import PropTypes from "prop-types";
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";

function ErrorNotFoundPage() {
    return (
        <div>
            <h1>404 Page Not Found</h1>
        </div>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorNotFoundPage);
