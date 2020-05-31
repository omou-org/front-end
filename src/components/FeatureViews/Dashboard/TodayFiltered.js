import {useSelector} from 'react-redux';
import React, {useState} from 'react';
import './Dashboard.scss';
import Loading from "components/Loading";
import Select from 'react-select';
import * as hooks from "actions/hooks";
import {useSearchSession} from "actions/searchActions";

const TodayFiltered = () => {
    const categoryStatus = hooks.useCategory(); 
    let sessions = useSelector(({Search}) => Search.sessions);
    sessions = sessions[1];
    const allCategories = useSelector(({Course}) => Course.CourseCategories);
    let courses = useSelector(({Course}) => Course.NewCourseList);
    let currentSessionCategories;
    let categoryIdList;
    let courseTodayList;
    let categoryNames;
    let categoryList = {};
    let isDisabled;


    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });

    const handleChange = e => {
        e ? setCurrentFilter({filter: e.value, showFiltered: true}): setCurrentFilter({filter:"", showFiltered: false});
    };

    useSearchSession(currentFilter.filter, 1, "", "", "timeAsc"); 

    if (hooks.isLoading(categoryStatus)) { 
        return(
            <Loading
                loadingText = "LOADING"
            />
        )
    }   



    if (sessions){
        sessions.length>0 ? isDisabled=false: isDisabled=true;
        const coureObjectsList = Object.values(courses); 
        currentSessionCategories = sessions.map(({course}) => course); 
        courseTodayList = coureObjectsList.filter(allCourses => { 
            return currentSessionCategories.some(coursesToday => {
                return coursesToday == allCourses.course_id
            });
        });
        categoryIdList = courseTodayList.map(({category}) => category); // 
        categoryNames = categoryIdList
            .map(e => allCategories.filter(arr => arr.id === e) // use find function to find category you're looking for
                .map(category => category.name))
            .flat();
        categoryNames = [...new Set(categoryNames)];

        if (categoryNames && categoryNames.length > 0) {

            categoryList = categoryNames.map((name) => ({
                    "label": name, // human readable
                    "value": name // code readable => change to category id
                })
            );
        }
    }

    return (
        <Select
        className="category-options"
        closeMenuOnSelect={true}
        isClearable={true}
        isDisabled={isDisabled}
        options={categoryList}
        placeholder={'Choose a Category'}
        onValueClick={(e) => e.preventDefault()}
        onChange={handleChange}
        
    />
    )
};

export default TodayFiltered;