import penguin from "./penguin.gif"
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";

function Loading(props) {
    return (
    <img src={penguin}></img>
    );
}


Loading.propTypes = {};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Loading));