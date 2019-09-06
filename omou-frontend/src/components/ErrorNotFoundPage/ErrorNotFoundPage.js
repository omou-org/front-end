import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Card, Paper, Typography } from "@material-ui/core";
import './ErrorNotFoundPage.scss';
import BackButton from "../BackButton";
import Button from "@material-ui/core/Button";
import BackButton2 from "./modifiedBackButton";


function ErrorNotFoundPage() {
    return (
        <div>
            <Paper className={'paper'}>
                <BackButton />
                <hr />
                <Typography className="center">
                    404.
                    <br />
                    page not found.
                    <div className="space"/>
                    <BackButton2 className="space"/>
                    </Typography>
            </Paper>
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
