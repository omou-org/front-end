import { capitalizeString } from 'utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const toDisplayValue = (value) => {
    if (value === null || typeof value === 'undefined') {
        return 'N/A';
    }

    if (value instanceof Date) {
        return new Date(value).toLocaleString('eng-US');
    }

    if (value instanceof moment) {
        return value.format('MM/DD/YYYY');
    }

    if (value.hasOwnProperty('label')) {
        return value.label;
    }

    // all caps string with underscores, i.e. a constant, but not a state
    if (typeof value === 'string' && /^(?:[A-Z]|_){3,}$/gu.test(value)) {
        return capitalizeString(value.toLowerCase()).replace('_', ' ');
    }

    if (Array.isArray(value)) {
        if (value.length > 1) {
            return value.reduce(
                (valueA, valueB) => `${valueA.label}, ${valueB.label}`
            );
        }
        return value.label;
    }

    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).reduce(
            (accumulator, [keyTitle, valueTitle]) =>
                `${accumulator}\n${keyTitle}: ${valueTitle}`,
            ''
        );
    }

    return value.toString();
};

const DefaultFormReceipt = ({ formData, format }) => (
    <div
        style={{
            margin: '2%',
            padding: '5px',
        }}
    >
        <Typography align='left' style={{ fontSize: '24px' }}>
            You've successfully submitted!
        </Typography>
        <div className='confirmation-copy'>
            <Typography align='left' className='title'>
                Confirmation
            </Typography>
            {format.map((section) => (
                <div key={section.name}>
                    <Typography align='left' className='section-title'>
                        {section.label}
                    </Typography>
                    {section.fields.map((field) => (
                        <div key={field.name}>
                            <Typography align='left' className='field-title'>
                                {field.label}
                            </Typography>
                            <Typography align='left' className='field-value'>
                                {toDisplayValue(
                                    formData[section.name][field.name]
                                )}
                            </Typography>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

DefaultFormReceipt.propTypes = {
    formData: PropTypes.objectOf(PropTypes.object),
    format: PropTypes.arrayOf(
        PropTypes.shape({
            fields: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string,
                    name: PropTypes.string,
                })
            ),
            label: PropTypes.string,
            name: PropTypes.string,
        })
    ),
};

export default DefaultFormReceipt;
