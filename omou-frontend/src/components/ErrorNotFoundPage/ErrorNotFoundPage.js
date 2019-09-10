import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Card, Paper, Typography } from "@material-ui/core";
import './ErrorNotFoundPage.scss';
import BackButton from "../BackButton";
import Button from "@material-ui/core/Button";


function ErrorNotFoundPage(props) {
    return (
        <div className={'error-page'}>
            <Paper className={'paper'}>
                <BackButton />
                <hr />
                <Typography className="center">
                    404.
                    <br />
                    page not found.
                    <div className="space" />
                    <Button className="backButton"
                        onClick={
                            props.history.goBack}
                    >
                        <div className="buttonText">Let's go back.</div>
                    </Button>
                </Typography>
            </Paper>
        </div>
    );
}

const mapStateToProps = (state) => ({
    auth: state.auth,
});

ErrorNotFoundPage.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    onBack: PropTypes.func,
    alertMessage: PropTypes.string,
};


const mapDispatchToProps = () => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ErrorNotFoundPage);
