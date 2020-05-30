import {useSelector} from 'react-redux';
import React, {useState} from 'react';
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

    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });

    const handleChange = e => {
        setCurrentFilter({filter: e.value, showFiltered: true})
    };

    // move this code chunk further down so that you know both the categories and the courses have been loaded
    if (sessions){
        const courseArray = Object.values(courses); // list of all course objects
        presentCategories = sessions.map(({course}) => course); // list of current session categories
        categoryID = courseArray.filter(allCourses => { // rename to coursesTodayList
            return presentCategories.some(coursesToday => {
                return coursesToday == allCourses.course_id
            });
        });
        // courseArray.filter( allCourses => presentCategories.some(...) );
        categoryID = categoryID.map(({category}) => category); // rename to categoryIdList
        categoryNames = categoryID
            .map(e => allCategories.filter(arr => arr.id === e) // use find function to find category you're looking for
                .map(category => category.name))
            .flat();
        categoryNames = [...new Set(categoryNames)];

        //[ 1, 2, 3, 4, 5, 5, 6]
        // .filter(5) => [ 5, 5]
        // .filter(1) => [ 1 ]
        // [ [1], [2], [3], [5, 5]]
        // .flat() [ 1, 2, 3, 5, 5]

        if (categoryNames && categoryNames.length > 0) {

            categoryList = categoryNames.map((name) => ({
                    "label": name, // human readable
                    "value": name // code readable => change to category id
                })
            );
            categoryList.push({ // delete, use the isClearable prop in the react-select component
            "label": "All Categories",
            "value": ""
        })
        }
    }

    // move to earlier in the code
    useSearchSession(currentFilter.filter, 1, "today", "timeAsc"); // TODO: ask Matt why use category name as filter?
    useSelector(({Search}) => Search.sessions); // delete

    const categoryStatus = hooks.useCategory(); // move this to earlier in the code

    if (hooks.isLoading(categoryStatus)) { // move this earlier in the code
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
};

export default TodayFiltered;