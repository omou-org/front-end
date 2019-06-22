import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";

class BackButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            warningOpen: false,
        };
    }

    handleClick() {
        if (this.props.warn) {
            this.setState({
                warningOpen: true,
            });
        } else {
            this.goBack();
        }
    }

    hideWarning() {
        this.setState({
            warningOpen: false,
        });
    }

    goBack() {
        this.props.onBack();
        this.props.history.goBack();
    }

    render() {
        return (
            <div>
                <div className="control"
                    onClick={this.handleClick.bind(this)}>
                    <BackArrow className="icon" />
                    <div className="label">Back</div>
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.warningOpen}
                    onClick={this.hideWarning.bind(this)}>
                    <div className="exit-popup">
                        <Typography variant="h6" id="modal-title">
                            Are you sure you want to go back?
                        </Typography>
                        <Button
                            onClick={this.hideWarning.bind(this)}
                            color="secondary"
                            className="button secondary">
                            No, leave me here
                        </Button>
                        <Button
                            onClick={this.goBack.bind(this)}
                            color="primary"
                            className="button primary">
                            Yes, take me back
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

BackButton.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    onBack: PropTypes.func,
    warn: PropTypes.bool,
};

export default withRouter(BackButton);
