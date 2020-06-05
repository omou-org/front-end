import React, {useCallback} from "react";

import * as Fields from "mui-rff";
import DateFnsUtils from "@date-io/date-fns";
import {makeStyles} from "@material-ui/core/styles";

const useSelectStyles = makeStyles({
    "select": {
        "width": "200px",
    },
});

export const TextField = (props) =>
    <Fields.TextField {...props} />;

export const Select = (props) => {
    const {select} = useSelectStyles();
    return <Fields.Select className={select} {...props} />;
};

export const KeyboardDatePicker = (props) => (
    <Fields.KeyboardDatePicker dateFunsUtils={DateFnsUtils}
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

export const Checkboxes = (props) => (
    <Fields.Checkboxes {...props} />
)
