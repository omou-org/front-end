import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import { camelCaseToSentenceCase, capitalizeString } from '../../../../utils';
import moment from 'moment';

const ReceiptFieldRow = ({ keyType, value, isUpdated }) => {
    const keyValue = capitalizeString(camelCaseToSentenceCase(keyType));
    const formatValue = (value) => {
        if (Date.parse(value)) {
            return moment(value).format('l');
        }
        return value;
    };

    return (
        <Grid item container direction='row'>
            <Grid item xs={6}>
                <Typography color={isUpdated ? 'primary' : ''}>
                    {`${keyValue}`}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography color={isUpdated ? 'primary' : ''}>
                    {`${formatValue(value)}`}
                </Typography>
            </Grid>
        </Grid>
    );
};

ReceiptFieldRow.propTypes = {
    keyType: PropTypes.string,
    value: PropTypes.string,
    isUpdated: PropTypes.bool,
};

function SessionEditReceipt({ databaseState, newState }) {
    const receiptFieldData = initializeSessionEditReceiptState(
        databaseState,
        newState
    );

    return (
        <Grid container direction='row' spacing={1}>
            {receiptFieldData.map(({ key, value, isUpdated }) => (
                <ReceiptFieldRow
                    key={key}
                    keyType={key}
                    value={value}
                    isUpdated={isUpdated}
                />
            ))}
        </Grid>
    );
}

SessionEditReceipt.propTypes = {
    databaseState: PropTypes.any.isRequired,
    newState: PropTypes.any.isRequired,
};

export default SessionEditReceipt;

export const initializeSessionEditReceiptState = (databaseState, newState) => {
    if (typeof databaseState !== 'string' || typeof newState !== 'string')
        return null;

    function arrayCompare(_arr1, _arr2) {
        if (
            !Array.isArray(_arr1) ||
            !Array.isArray(_arr2) ||
            _arr1.length !== _arr2.length
        ) {
            return false;
        }

        // .concat() to not mutate arguments
        const arr1 = _arr1.concat().sort();
        const arr2 = _arr2.concat().sort();

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    const actualNewState = JSON.parse(newState);
    const actualDatabaseState = JSON.parse(databaseState);
    const statesDoNotHaveSameKeys = !arrayCompare(
        Object.keys(actualDatabaseState),
        Object.keys(actualNewState)
    );

    if (statesDoNotHaveSameKeys)
        return `The developer messed up! Check the Database and New States!`;

    const compareValue = (oldVal, newVal) => {
        return oldVal !== newVal;
    };

    return Object.entries(actualNewState).map(([key, value]) => {
        return {
            key,
            value,
            isUpdated: compareValue(value, actualDatabaseState[key]),
        };
    });
};
