import React, { useCallback, useState } from 'react';

import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import InputAdornment from '@material-ui/core/InputAdornment';
import MuiTextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// import Button from '@material-ui/core/Button';
import * as Fields from 'mui-rff';
import { Field } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { fullName } from '../../../utils';
import MomentUtils from '@date-io/moment';
import MaskedInput from 'react-text-mask';
import { Schedule } from '@material-ui/icons';
import PropTypes from 'prop-types';
import './Fields.scss';
const getLabel = ({ label }) => label || '';

const useSelectStyles = makeStyles({
    select: {
        width: '200px',
        marginTop: '16px',
        marginBottom: '24px',
    },
});

export const fieldsMargins = {
    width: '216px',
    marginTop: '14px',
    marginBottom: '10px',
};

export const tutoringMargins = {
    marginTop: '14px',
    marginBottom: '10px',
};
export const { TextField, Checkboxes } = Fields;

export const Select = (props) => {
    const { select } = useSelectStyles();
    const denseMarginProps = { ...props, margin: 'dense' };
    return <Fields.Select className={select} {...denseMarginProps} />;
};

export const KeyboardDatePicker = (props) => (
    <Fields.KeyboardDatePicker style={fieldsMargins} openTo='year' {...props} />
);

export const KeyboardTimePicker = (props) => (
    <Fields.KeyboardTimePicker style={fieldsMargins} {...props} />
);

export const DatePicker = (props) => (
    <Fields.KeyboardDatePicker
        style={props.tutoring ? tutoringMargins : fieldsMargins}
        dateFunsUtils={MomentUtils}
        {...props}
    />
);

DatePicker.propTypes = {
    tutoring: PropTypes.bool,
};

export const TimePicker = (props) => (
    <Fields.KeyboardTimePicker
        {...props}
        dateFunsUtils={MomentUtils}
        keyboardIcon={<Schedule />}
        style={fieldsMargins}
    />
);

const MaskedPhoneInput = (props) => {
    return (
        <MaskedInput
            mask={[
                '(',
                /[1-9]/,
                /\d/,
                /\d/,
                ')',
                ' ',
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
            ]}
            placeholderChar={'\u2000'}
            showMask={false}
            {...props}
        />
    );
};

export const PhoneInput = (props) => {
    return (
        <TextField
            {...props}
            InputLabelProps={{ shrink: true }}
            InputProps={{
                inputComponent: MaskedPhoneInput,
            }}
        />
    );
};

export const Autocomplete = ({ name, options, ...props }) => {
    const renderOption = useCallback(
        (option) => <span data-cy={`${name}-${option}`}>{option}</span>,
        [name]
    );
    return (
        <Fields.Autocomplete
            style={fieldsMargins}
            name={name}
            options={options}
            renderOption={renderOption}
            {...props}
        />
    );
};

Autocomplete.propTypes = {
    name: PropTypes.string,
    options: PropTypes.array,
};

export const DataSelect = ({ request, optionsMap, name, ...props }) => {
    const [query, setQuery] = useState();

    const handleQueryChange = useCallback((_, newQuery) => {
        setQuery(newQuery);
    }, []);

    const { data, loading } = useQuery(request, {
        variables: { query },
        skip: !query,
    });

    const renderOption = useCallback(
        ({ label, value }) => <span data-cy={`${name}-${value}`}>{label}</span>,
        [name]
    );

    const options = data ? optionsMap(data) : [];

    const defaultSelectedHandler = (option, value) =>
        option.value === value.value || value === '';

    return (
        <Fields.Autocomplete
            getOptionLabel={getLabel}
            loading={loading}
            name={name}
            onInputChange={handleQueryChange}
            getOptionSelected={defaultSelectedHandler}
            options={options}
            renderOption={renderOption}
            classes={{ inputRoot: { fontSize: '70px' } }}
            {...props}
        />
    );
};

DataSelect.propTypes = {
    request: PropTypes.any,
    optionsMap: PropTypes.any,
    name: PropTypes.string,
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
    let studentIdList;
    if (props.studentIdList) {
        studentIdList = props.studentIdList;
    } else {
        studentIdList = JSON.parse(sessionStorage.getItem('registrations'))
            .currentParent;
    }
    const { data } = useQuery(GET_STUDENTS, {
        variables: { userIds: studentIdList },
    });
    const studentOptions =
        data?.userInfos.map((student) => ({
            label: fullName(student.user),
            value: student.user.id,
        })) || [];

    return (
        <Select
            data={studentOptions}
            // label='Select Student'
            name='selectStudent'
            {...props}
        />
    );
};

StudentSelect.propTypes = {
    studentIdList: PropTypes.array,
};

export const PasswordInput = ({ isField = true, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);

    return React.createElement(isField ? TextField : MuiTextField, {
        InputProps: {
            endAdornment: (
                <InputAdornment position='end'>
                    <IconButton
                        aria-label='toggle password visibility'
                        onClick={toggleVisibility}
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    <Tooltip
                        aria-label='passwordInfo'
                        title='Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
                    >
                        <InfoOutlinedIcon />
                    </Tooltip>
                </InputAdornment>
            ),
        },
        id: 'password',
        label: 'Password',
        type: showPassword ? 'text' : 'password',
        ...props,
    });
};

PasswordInput.propTypes = {
    isField: PropTypes.bool,
};

const GET_COURSE_TOPICS = gql`
    query GetCourseTopics {
        courseCategories {
            name
            id
        }
    }
`;

export const CourseTopicSelect = (props) => {
    const { data, loading, error } = useQuery(GET_COURSE_TOPICS);
    if (loading) return '';
    if (error) console.error(error);
    let topicOptions = data.courseCategories.map(({ name, id }) => {
        return { label: name, value: id };
    });

    return <Select data={topicOptions} name='selectSubject' {...props} />;
};

export const ToggleButton = (toggleProps) => {
    return (
        <Field
            name={toggleProps.name}
            type='checkbox'
            render={(props) => (
                <div className='check-btn'>
                    <label className='btn '>
                        <input
                            type='checkbox'
                            value={props.input.value}
                            checked={props.input.checked}
                            name={props.input.name}
                            onChange={props.input.onChange}
                            {...props}
                        />
                        <span>{props.input.name}</span>
                    </label>
                </div>
            )}
        ></Field>
    );
};
ToggleButton.propTypes = {
    name: PropTypes.string,
    input: PropTypes.object,
    onChange: PropTypes.func,
};
