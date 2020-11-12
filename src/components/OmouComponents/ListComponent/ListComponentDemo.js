import React from 'react';
import { ListComponent } from './ListComponent'
import gql from "graphql-tag";

const GET_COURSES = gql`
  query getCourses {
    courses {
      dayOfWeek
      endDate
      endTime
      title
      startTime
      academicLevel
      startDate
      instructor {
        user {
          firstName
          lastName
          id
        }
      }
      courseCategory {
        id
        name
      }
      courseId
      id
    }
  }
`;

const ListComponentDemo = () => {
    return (
        <ListComponent />
    )
}

export default ListComponentDemo;