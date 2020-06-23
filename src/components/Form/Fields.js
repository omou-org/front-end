import React, {useCallback} from "react";

import * as Fields from "mui-rff";
import DateFnsUtils from "@date-io/date-fns";
import {makeStyles} from "@material-ui/core/styles";

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

export const KeyboardDatePicker = (props) => (
    <Fields.KeyboardDatePicker dateFunsUtils={DateFnsUtils}
        {...props} />
);

export const KeyboardTimePicker = (props) => (
    <Fields.KeyboardTimePicker dateFunsUtils={DateFnsUtils}
        {...props} />
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

/*
query GetCourse($courseID: ID!) {
  course(courseId: $courseID) {
    title
    description
    instructor {
      user {
        id
      }
    }
    isConfirmed
    maxCapacity
    courseCategory {
      id
    }
    academicLevel
    endTime
    endDate
    hourlyTuition
    totalTuition
    numSessions
    startDate
    startTime
  }
}
*/

export const InstructorSelect = ({name, ...props}) => {
    const renderOption = useCallback(
        (option) => <span data-cy={`${name}-${option.name}`}>{option.name}</span>,
        [name],
    );
    const options = [{
        "id": 1,
        "name": "Dan",
    }];

    return (
        <Fields.Autocomplete name={name} options={options}
            getOptionLabel={(option) => option.name}
            renderOption={renderOption} {...props} />
    );
};
