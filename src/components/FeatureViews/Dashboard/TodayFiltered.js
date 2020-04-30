import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import Loading from "components/Loading";
import Select from 'react-select';
import * as hooks from "actions/hooks";
import {useSearchSession} from "actions/searchActions";


const TodayFiltered = () => {

    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: "Math"
    });

    const handleChange = e => {
        setCurrentFilter({filter: e.label, showFiltered: true})
    }
    
    const categories = useSelector(({Course}) => Course.CourseCategories);
    let categoryList = {};
    if (categories.length>0) {
        categoryList = categories.map(({name, id}) => JSON.parse(JSON.stringify(({
            "label": name,
        }))));

    }
    const sessionSearchResult = useSelector(({Search}) => Search.sessions);
    const filteredSessionArray = sessionSearchResult.results ;
    useSearchSession(currentFilter.filter, 1, "", "timeAsc");

    const categoryStatus = hooks.useCategory();
    
    console.log(filteredSessionArray);

    if(hooks.isLoading(categoryStatus)) {
        return(
            <Loading
                loadingText = "LOADING"
            />
        )
    }   

    return (
        <Select
        className="category-options"
        closeMenuOnSelect={true}
        options={categoryList}
        placeholder={'Choose a Category'}
        onValueClick={(e) => e.preventDefault()}
        onChange={handleChange}
        value={categoryList.id}
    />
    )
}

export default TodayFiltered;