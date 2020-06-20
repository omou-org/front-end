import {useSelector} from 'react-redux';
import React, {useState} from 'react';
import './Dashboard.scss';
import Loading from "components/Loading";
import Select from 'react-select';
import * as hooks from "actions/hooks";
import {useSearchSession} from "actions/searchActions";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const TodayFiltered = () => {

    // const categoryStatus = hooks.useCategory(); 
    // let sessions = useSelector(({Search}) => Search.sessions);
    // sessions = sessions[1];
    // const allCategories = useSelector(({Course}) => Course.CourseCategories);
    // let courses = useSelector(({Course}) => Course.NewCourseList);
    // let currentSessionCategories;
    // let categoryIdList;
    // let courseTodayList;
    // let categoryNames;
    // let categoryList = {};
    const [currentFilter, setCurrentFilter] = useState({
        showFiltered: false,
        filter: ""
    });
    let isDisabled;

    const QUERIES = {
        "categories": gql`query MyQuery {
            courseCategories {
              id
              name
              courseSet {
                id
              }
            }
          }
          `,
          "sessions": gql`query MyQuery {
            sessionSearch(query: "${currentFilter.filter}", time: "today", sort: "timeAsc") {
              results {
                id
                course {
                  title
                  startTime
                  maxCapacity
                  id
                  enrollmentSet {
                    id
                  }
                  courseCategory {
                    id
                    name
                  }
                  instructor {
                    user {
                      firstName
                      lastName
                      id
                    }
                  }
                }
              }
            }
          }
        `
    }

    const { data, loading, error } = useQuery(QUERIES["categories"]);

    if (loading) {
        return (
            <Loading
                loadingText="SESSIONS ARE LOADING"
                small />
        );
    }

    console.log(data.courseCategories);
    let categoryList = data.courseCategories.map(category=> ({
        "label": category.name,
        "value": category.id
    }));

    console.log(categoryList)


    const handleChange = e => {
        e ? setCurrentFilter({filter: e.label, showFiltered: true}): setCurrentFilter({filter:"", showFiltered: false});
        console.log(currentFilter.filter, data.courseCategories);
    };

    // useSearchSession(currentFilter.filter, 1, "", "today", "timeAsc"); 

    if (loading) { 
        return(
            <Loading
                loadingText = "LOADING"
            />
        )
    }   

    // if (sessions){
    //     sessions.length>0 ? isDisabled=false: isDisabled=true;
    //     const courseObjectsList = Object.values(courses); 
    //     currentSessionCategories = sessions.map(({course}) => course); 
    //     courseTodayList = courseObjectsList.filter(allCourses => 
    //         {currentSessionCategories.some(coursesToday => 
    //             coursesToday == allCourses.course_id);
    //     });
    //     categoryIdList = courseTodayList.map(({category}) => category); // 
    //     categoryNames = categoryIdList
    //         .map(e => allCategories.filter(arr => arr.id === e) // use find function to find category you're looking for
    //             .map(category => category.name))
    //         .flat();
    //     categoryNames = [...new Set(categoryNames)];

    //     if (categoryNames && categoryNames.length > 0) {

    //         categoryList = categoryNames.map((name) => ({
    //                 "label": name, // human readable
    //                 "value": name // code readable => change to category id
    //             })
    //         );
    //     }
    // }

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