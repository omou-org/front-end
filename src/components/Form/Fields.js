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
import MomentUtils from "@date-io/moment";
import MaskedInput from "react-text-mask";
import { TrendingUpRounded } from "@material-ui/icons";

const getLabel = ({label}) => label;

const useSelectStyles = makeStyles({
    "select": {
        "width": "200px",
        "marginTop": "16px",
        "marginBottom": "24px"
    },
});

export const fieldsMargins = {
    marginTop: "16px",
    marginBottom: "8px"
}

export const { TextField, Checkboxes } = Fields;

export const Select = (props) => {
    const { select } = useSelectStyles();
    return <Fields.Select className={select} {...props} />;
};

export const KeyboardDatePicker = (props) => <Fields.KeyboardDatePicker style={fieldsMargins}  openTo="year" {...props} />;

export const KeyboardTimePicker = (props) => <Fields.KeyboardTimePicker style={fieldsMargins}  {...props} />;

export const DatePicker = (props) => <Fields.KeyboardDatePicker style={fieldsMargins}  dateFunsUtils={MomentUtils} {...props} />;

export const TimePicker = (props) => <Fields.KeyboardTimePicker style={fieldsMargins}  {...props} dateFunsUtils={MomentUtils} />;


const MaskedPhoneInput = (props) => {
    return <MaskedInput mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,]}
                 placeholderChar={'\u2000'}
                 showMask={false}
                 {...props}
    />
};

export const PhoneInput = (props) => 
    {   
        return <TextField
        {...props} 
        InputLabelProps={{ shrink: true }}
        InputProps={{
            inputComponent: MaskedPhoneInput
        }}
    />
};

export const Autocomplete = ({ name, options, ...props }) => {
    const renderOption = useCallback(
        (option) => <span data-cy={`${name}-${option}`}>{option}</span>,
        [name],
    );
    return (
        <Fields.Autocomplete style={fieldsMargins} name={name} options={options}
            renderOption={renderOption} {...props} />
    );
};

export const DataSelect = ({ request, optionsMap, name, ...props }) => {
    const [query, setQuery] = useState();

    const handleQueryChange = useCallback((_, newQuery) => {
        setQuery(newQuery);
    }, []);

    const { data, loading } = useQuery(request, {
        "variables": { query },
    });

    const renderOption = useCallback(
        ({label, value}) => <span data-cy={`${name}-${value}`}>{label}</span>,
        [name],
    );

    const options = data ? optionsMap(data) : [];
    
    return (
        <Fields.Autocomplete getOptionLabel={getLabel}
            loading={loading}
            name={name}
            onInputChange={handleQueryChange}
            options={options}
            renderOption={renderOption} 
            {...props} 
            />
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

export const StudentSelect = (props) => {
    const {studentIdList} = JSON.parse(sessionStorage.getItem("registrations")).currentParent;
    const {data} = useQuery(GET_STUDENTS, {"variables": {"userIds": studentIdList}});
    const studentOptions = data?.userInfos.map((student) => ({
        "label": fullName(student.user),
        "value": student.user.id,
    })) || [];
    return <Select data={studentOptions} label="Select Student" name="selectStudent" {...props}/>;
};

export const PasswordInput = ({ label = "Password", isField = true, ...props }) => {
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
                        <Tooltip aria-label="passwordInfo" title="Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character" >
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
