import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class InvalidRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return (<h1>Not found</h1>)
    }
}

InvalidRoute.propTypes = {
   
}

export default withRouter(InvalidRoute);