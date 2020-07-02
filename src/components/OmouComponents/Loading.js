import React from "react";
import PropTypes from "prop-types";

import Paper from "@material-ui/core/Paper";
import Penguin from "../penguin.gif";
import Typography from "@material-ui/core/Typography";

const Loading = ({
    paper = false, small = false, loadingText = "",
}) => {
    if (paper) {
        return (
            <Paper className="paper" style={{"height": "100vh"}}>
                <Typography variant="h3">{loadingText}</Typography>
                <img alt="loading penguin" src={Penguin} />
            </Paper>
        );
    }
    if (small) {
        return (
            <div className="small-load-wrap">
                <div className="load-wrap">
                    <div className="loading">
                        <div className="bounceball"> </div>
                        <div className="small-load-text">{loadingText}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="paper" style={{"height": "70vh"}}>
            <img alt="loading penguin" src={Penguin} />
            <Typography variant="h3">
                {loadingText}
            </Typography>
        </div>
    );
};

Loading.propTypes = {
    "loadingText": PropTypes.string,
    "paper": PropTypes.bool,
    "small": PropTypes.bool,
};

export default Loading;