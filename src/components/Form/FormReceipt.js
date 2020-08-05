import React from "react";
import moment from "moment"

import Typography from "@material-ui/core/Typography";


const toDisplayValue = (value) => {
    if (value === null || typeof value === "undefined") {
        return "N/A";
    }

    if (value instanceof Date) {
        return new Date(value).toLocaleString("eng-US");
    }

    if (value instanceof moment) {
        return value.format("MM/DD/YYYY");
    }

    if (value.hasOwnProperty("label")) {
        return value.label;
    }

    if (Array.isArray(value)) {
        if (value.length > 1) {
            return value.reduce((valueA, valueB) => (valueA.label + ", " + valueB.label));
        } else {
            return value.label;
        }
    }

    return value;
};

const FormReceipt = ({formData, format}) => (
    <div style={{
        "margin": "2%",
        "padding": "5px",
    }}>
        <Typography align="left" style={{"fontSize": "24px"}}>
            You've successfully submitted!
        </Typography>
        <div className="confirmation-copy">
            <Typography align="left" className="title">
                Confirmation
            </Typography>
            {Object.entries(formData).map(([sectionLabel, fields], sectionIndex) =>
                format[sectionIndex] && (
                <div key={sectionLabel}>
                    <Typography align="left" className="section-title">
                        {format[sectionIndex].label}
                    </Typography>
                    {Object.entries(fields).map(([label, value], fieldIndex) => (
                        <div key={label}>
                            <Typography align="left" className="field-title">
                                {format[sectionIndex].fields[fieldIndex].label}
                            </Typography>
                            <Typography align="left" className="field-value">
                                {toDisplayValue(value)}
                            </Typography>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default FormReceipt;
