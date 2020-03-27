import { connect, useSelector } from 'react-redux';
import React from 'react';
import loadingCoursesError from "./loadingCoursesError.png";

function LoadingCoursesError(props){
    return(
    <div>
        <img style={{width:"10%"}} src={loadingCoursesError}/>
        <h2>There was an error loading your {props.error}.</h2>
    </div>);
}

export default LoadingCoursesError