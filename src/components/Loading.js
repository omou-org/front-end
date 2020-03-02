import Penguin from "./penguin.gif";
import React from "react";
import Paper from "@material-ui/core/Paper";

const Loading = () => {
    // setTimeout(()=> <Paper
    //     style={{height:"70vh"}}
    //     className="paper"
    // >
    //     <img alt="loading penguin" src={Penguin} />
    // </Paper>, 500);
    return <Paper
        style={{height:"70vh"}}
        className="paper"
    >
        <img alt="loading penguin" src={Penguin} />
    </Paper>;
};


export default Loading;
