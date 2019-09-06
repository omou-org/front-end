import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import './ErrorNotFoundPage.scss';

class modifiedBackButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handleClick() {
        this.goBack();
    }

    goBack() {
        // only call user defined function from parent component if defined
        this.props.onBack && this.props.onBack();
        this.props.history.goBack();
    }


    render() {
        return (
            <Button className="backButton"
                onClick={this.handleClick.bind(this)}
            >
                <div className="buttonText">Let's go back.</div>
            </Button>
        );
    }
}

modifiedBackButton.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    onBack: PropTypes.func,
    alertMessage: PropTypes.string,
};

export default withRouter(modifiedBackButton);
