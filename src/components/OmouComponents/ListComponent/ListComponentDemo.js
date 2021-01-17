import React from 'react';
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton'
import { LabelBadge } from '../../../theme/ThemedComponents/Badge/LabelBadge'
import ListDetailedItem, { ListContent, ListActions, ListHeading, ListTitle, ListDetails, ListDetail, ListDetailLink, ListButton, ListBadge, ListStatus, ListDivider } from './ListDetailedItem'

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

    const { loading, error, data } = useQuery(GET_COURSES, {
        variables: {

        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <ListDetailedItem>
            <ListContent>
                <ListHeading>
                    <ListBadge>
                        <LabelBadge variant="status-active">ACTIVE</LabelBadge>
                    </ListBadge>
                    <ListTitle>
                        Biology
                    </ListTitle>
                </ListHeading>
                <ListDetails>
                    <ListDetailLink>
                        Daniel Huang
                    </ListDetailLink>
                    <ListDivider />
                    <ListDetail>
                        Oct 5 2020 - Dec 12 2020
                    </ListDetail>
                    <ListDivider />
                    <ListDetail>
                        Wednesday 3:00 - 4:00pm
                    </ListDetail>
                    <ListDivider />
                    <ListDetail>
                        $400
                    </ListDetail>
                </ListDetails>
            </ListContent>
            <ListActions>
                <ListStatus>
                    
                </ListStatus>
                <ListButton>
                    
                </ListButton>
            </ListActions>
        </ListDetailedItem>
    );
}

export default ListComponentDemo;