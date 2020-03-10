import Penguin from "./penguin.gif";
import cat1 from "./cat1.gif";
import cat2 from "./cat2.gif";
import cat3 from "./cat3.gif";
import React from "react";
import Paper from "@material-ui/core/Paper";

const catImages = {
    0:{
        "gif":<img alt="loading penguin" src={cat1} />
    },
    1:{
        "gif":<img alt="loading penguin" src={cat2} />
    },
    2:{
        "gif":<img alt="loading penguin" src={cat3} />
    }
}

function renderLoading(isNelson){
    return(isNelson ? <img alt="loading penguin" src={Penguin} /> : catImages[Math.floor(Math.random() * 3)].gif)
}

const Loading = () => {
    // setTimeout(()=> <Paper
    //     style={{height:"70vh"}}
    //     className="paper"
    // >
    //     <img alt="loading penguin" src={Penguin} />
    // </Paper>, 500);
    return (<Paper
        style={{height:"70vh"}}
        className="paper"
    >
        
        {renderLoading(false)}
    </Paper>);
};


export default Loading;
