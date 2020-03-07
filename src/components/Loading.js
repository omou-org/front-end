import Penguin from "./penguin.gif";
import React from "react";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";

const Loading = ({paper, small, loadingText}) => {
    if(paper){
        return <Paper
            style={{height:"100vh"}}
            className="paper"
        >
            <Typography variant="h3">
                {loadingText}
            </Typography>
            <img alt="loading penguin" src={Penguin} />
        </Paper>;
    }
    if(small){
        return <div className="small-load-wrap">
        <div className="load-wrap">
            <div className="loading">
                <div className="bounceball"> </div>
                <div className="small-load-text">{loadingText || "NOW LOADING"}</div>
            </div>
        </div>
        </div>
    }
    return <div
        style={{height:"70vh"}}
        className="paper"
    >
        <img alt="loading penguin" src={Penguin} />
        <Typography variant="h3">
            {loadingText}
        </Typography>
    </div>;
};


export default Loading;
