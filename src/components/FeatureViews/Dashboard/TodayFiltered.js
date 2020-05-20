import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import './Dashboard.scss';
import Loading from "components/Loading";
import Select from 'react-select';
import * as hooks from "actions/hooks";
import {useSearchSession} from "actions/searchActions";


const TodayFiltered = () => {
    let sessions = useSelector(({Search}) => Search.sessions);
    sessions = sessions[1];
    const allCategories = useSelector(({Course}) => Course.CourseCategories);
    let courses = useSelector(({Course}) => Course.NewCourseList);
    let presentCategories;
    let categoryID;
    let categoryNames;
    let categoryList = {};

    console.log(courses);
    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });

    const handleChange = e => {
        setCurrentFilter({filter: e.value, showFiltered: true})
    }

    console.log(sessions);
    console.log(allCategories);

    if (sessions){
        const courseArray = Object.values(courses);
        console.log(courseArray);
        presentCategories = sessions.map(({course}) => course);
        // presentCategories = [...new Set(presentCategories)];
        categoryID = courseArray.filter(allCourses=> {
            return presentCategories.some(coursesToday=> {
                return coursesToday == allCourses.course_id
            }); 
          })
        categoryID = categoryID.map(({category}) => category);
        console.log(categoryID);
        categoryNames = categoryID.map(e => allCategories.filter(arr => arr.id ===e).map(y=>y.name)).flat()

        categoryNames = [...new Set(categoryNames)];

        if (categoryNames && categoryNames.length>0) {
         
            categoryList = categoryNames.map((name) => { 
              return {
                "label": name, 
                "value": name
              }; 
            });    
        categoryList.push({
            "label": "Choose a Category",
            "value": ""
        })
        }

        console.log(categoryList);

    }

    console.log(presentCategories);
    console.log(categoryNames);
    console.log(categoryList);
    useSearchSession(currentFilter.filter, 1, "today", "timeAsc");
    useSelector(({Search}) => Search.sessions);


    const categoryStatus = hooks.useCategory();
    
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
    />
    )
}

export default TodayFiltered;