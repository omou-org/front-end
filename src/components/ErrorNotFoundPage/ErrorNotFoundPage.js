import React from "react";
import {useHistory} from "react-router-dom";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./ErrorNotFoundPage.scss";

const ErrorNotFoundPage = () => {
    const {goBack} = useHistory();
    return (
        <div className="error-page">
            <Paper elevation={2} className="paper">
                <Typography className="center">
                    404.
                    <br />
                    page not found.
                    <div className="space" />
                    <Button
                        className="backButton"
                        onClick={goBack}>
                        <span className="buttonText">Let's go back.</span>
                    </Button>
                </Typography>
            </Paper>
        </div>
    );
};

export default ErrorNotFoundPage;
