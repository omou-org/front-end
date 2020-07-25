/* eslint-disable react-hooks/rules-of-hooks */
import React, {useCallback, useState} from "react";

import * as Fields from "mui-rff";
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {fullName} from "../../utils";
import MomentUtils from "@date-io/moment";

const getLabel = ({label}) => label;

const useSelectStyles = makeStyles({
    "select": {
        "width": "200px",
    },
});

export const {TextField, Checkboxes} = Fields;

export const Select = (props) => {
    const {select} = useSelectStyles();
    return <Fields.Select className={select} {...props} />;
};

export const DatePicker = (props) => (
	<Fields.KeyboardDatePicker dateFunsUtils={MomentUtils} {...props} />
);

export const TimePicker = (props) => (
	<Fields.KeyboardTimePicker {...props} dateFunsUtils={MomentUtils}/>
);

export const Autocomplete = ({name, options, ...props}) => {
    const renderOption = useCallback(
        (option) => <span data-cy={`${name}-${option}`}>{option}</span>,
        [name],
    );
    return (
        <Fields.Autocomplete name={name} options={options}
                             renderOption={renderOption} {...props} />
    );
};

export const DataSelect = ({request, optionsMap, name, ...props}) => {
    const [query, setQuery] = useState();

    const handleQueryChange = useCallback((_, newQuery) => {
        setQuery(newQuery);
    }, []);

    const {data, loading} = useQuery(request, {
        "variables": {query},
    });

    const renderOption = useCallback(
        ({label}) => <span data-cy={`${name}-${label}`}>{label}</span>,
        [name],
    );

    const options = data ? optionsMap(data) : [];

    return (
        <Fields.Autocomplete getOptionLabel={getLabel}
                             loading={loading}
                             name={name}
                             onInputChange={handleQueryChange}
                             options={options}
                             renderOption={renderOption} {...props} />
    );
};

const GET_STUDENTS = gql`
    query GetStudents($userIds: [ID]!) {
      userInfos(userIds: $userIds) {
        ... on StudentType {
          user {
            firstName
            lastName
            id
          }
        }
      }
    }
`;

export const StudentSelect = () => {
	const studentList = JSON.parse(sessionStorage.getItem("registrations")).currentParent.studentList;
	const {data} = useQuery(GET_STUDENTS, {variables: {userIds: studentList}});
	const studentOptions = data?.userInfos.map(student => ({
		label: fullName(student.user),
		value: student.user.id,
	})) || [];
	return <Select data={studentOptions} name="selectStudent" label="Select Student"/>
};
