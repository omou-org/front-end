import React, {useCallback, useState} from "react";

import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InputAdornment from "@material-ui/core/InputAdornment";
import MuiTextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import * as Fields from "mui-rff";
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {fullName} from "../../utils";

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

export const KeyboardDatePicker = (props) => <Fields.KeyboardDatePicker openTo="year" {...props} />;
export const KeyboardTimePicker = (props) => <Fields.KeyboardTimePicker {...props} />;
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
    const {studentList} = JSON.parse(sessionStorage.getItem("registrations")).currentParent;
    const {data} = useQuery(GET_STUDENTS, {"variables": {"userIds": studentList}});
    const studentOptions = data?.userInfos.map((student) => ({
        "label": fullName(student.user),
        "value": student.user.id,
    })) || [];
    return <Select data={studentOptions} label="Select Student" name="selectStudent" />;
};

export const PasswordInput = ({label = "Password", isField = true, ...props}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);

    return React.createElement(
        isField ? TextField : MuiTextField,
        {
            "InputProps": {
                "endAdornment": (
                    <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility"
                            onClick={toggleVisibility}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                        <Tooltip aria-label="passwordInfo" title="Passwords must be at least 8 characters and contain a number or a symbol.">
                            <InfoOutlinedIcon />
                        </Tooltip>
                    </InputAdornment>
                ),
            },
            "id": "password",
            "label": "Password",
            "type": showPassword ? "text" : "password",
            ...props,
        },
    );
};
