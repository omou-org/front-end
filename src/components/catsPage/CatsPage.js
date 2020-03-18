import React, { useMemo, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import * as catActions from "../../actions/catActions"
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";

function CatsPage() {
    const dispatch = useDispatch();
    const api = useMemo(() => bindActionCreators(catActions, dispatch), [dispatch])
    const list = useSelector((store) => store.Cat)


    useEffect(() => {
        api.fetchCats("cats")
    }, []);



    return (
        <div>

            <img src={list.firstCat} />
        </div>
    )
}

export default withRouter(CatsPage);
