import React, {useCallback, useState} from "react";
import * as Fields from "mui-rff";
import DateFnsUtils from "@date-io/date-fns";
import {makeStyles} from "@material-ui/core/styles";
import {useQuery} from "@apollo/react-hooks";

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
