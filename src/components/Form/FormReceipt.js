import React from "react";

import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

const FormReceipt = ({formData, format}) => (
    <div style={{
        "margin": "2%",
        "padding": "5px",
    }}>
        <Typography align="left" style={{"fontSize": "24px"}}>
            You have successfully registered!
        </Typography>
        <Typography align="left" style={{"fontSize": "14px"}}>
            An email will be sent to you to confirm your registration
        </Typography>
        <Button align="left" className="button" component={Link}
            style={{"margin": "20px"}} to="/registration">
            REGISTER MORE
        </Button>
        <div className="confirmation-copy">
            <Typography align="left" className="title">
                Confirmation
            </Typography>
            {Object.entries(formData).map(([sectionLabel, fields], sectionIndex) => (
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
                                {/* TODO: better way of rendering field values */}
                                {typeof value === "object" ? new Date(value).toLocaleString("eng-US") : value || "N/A"}
                            </Typography>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);

export default FormReceipt;
