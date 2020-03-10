import React, {useMemo, useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import { Typography } from "@material-ui/core";
import image from "./cat1.gif";
import axios from "axios";

function CatsPage() {
    const[catImages, getCatImages] = useState("");
    const instance = axios.create({ "baseURL": "http://api.giphy.com/v1/gifs/", })
    useEffect(()=>{
        getCat()
    }, [])
    const getCat = () => {
        return async (dispatch) => {
            try {
                const response = await instance.get("search", {
                    params: {
                        "q": "cat memes",
                        "api_key": "X7MCaaM0oOaoShVzhtqcEN8JiKF39oRu",
                        'limit': 1
                    }
                })
                getCatImages(response)             
            }
            catch (error) {
                console.log(error)
                dispatch({ payload: error });

            }
        }
    }
    return(console.log(catImages))
}

export default withRouter(CatsPage);
