import React, {useCallback, useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import {Form as ReactForm} from "react-final-form";
import Step from "@material-ui/core/Step";
import StepContent from "@material-ui/core/StepContent";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import Typography from "@material-ui/core/Typography";
import FormReceipt from "./FormReceipt";

import {makeValidate} from "mui-rff";
import {Button} from "@material-ui/core";
import * as Yup from "yup";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';

const useStyles = makeStyles({
    "buttons": {
        "& Button": {
            "margin": "10px",
        },
        "textAlign": "right",
    },
    "root": {
        "& .MuiSelect-select-root": {
            "width": 200,
        },
    },
    "step": {
        "textAlign": "left",
    },
});

const generateFields = (format) => {
    const sections = format.map(({fields, ...settings}) => ({
        ...settings,
        "fields": fields.map((field) => {
            let jsField = field.component;
            jsField = React.cloneElement(jsField, {
                "key": field.name,
                "label": field.label,
                "name": field.name,
                "required": Boolean(field.required),
            });
            return jsField;
        }),
    }));

    const schema = Yup.object().shape(format.reduce((allValidators, section) => {
        const sectionObj = section.fields.reduce((fieldValidators, field) => {
            const {name, label, required} = field;
            let {validator} = field;
            if (required) {
                validator = validator.required();
            }
            validator = validator.label(label).nullable();
            return {
                ...fieldValidators,
                [name]: validator,
            };
        }, {});
        return {
            ...allValidators,
            [section.name]: Yup.object().shape(sectionObj)
                .label(section.label),
        };
    }, {}));

    return [schema, sections];
};

const Form = ({base, initialData, title, onSubmit, "receipt": Receipt = FormReceipt}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const classes = useStyles();

    const [schema, sections] = generateFields(base);
    const validate = makeValidate(schema);

    const handleNext = useCallback(() => {
        setActiveStep((prevStep) => prevStep + 1);
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevStep) => prevStep - 1);
    }, []);

    const submit = useCallback(async (formData) => {
        const errors = await onSubmit(formData);
        if (!errors) {
            setSubmittedData(formData);
            setShowReceipt(true);
        }
        return errors;
    }, [onSubmit]);

    const renderStep = useCallback((index, {label, name, fields}, errors, submitting, mutators) => (
        <Step className={classes.step} key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
                {fields.map((field) => React.cloneElement(field,
                    {
                        "SelectDisplayProps": {
                            "data-cy": `${name}-${field.props.name}-select`,
                        },
                        "data-cy": `${name}-${field.props.name}`,
                        "inputProps": {
                            "data-cy": `${name}-${field.props.name}-input`,
                        },
                        "margin": "normal",
                        "name": `${name}.${field.props.name}`,
                        mutators,
                    }))}
                <div className={classes.buttons}>
                    {index > 0 && index < sections.length &&
                    <ResponsiveButton 
                        data-cy="backButton" 
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </ResponsiveButton>}
                    {index < sections.length - 1 &&
                        <ResponsiveButton data-cy={`${name}-nextButton`}
                                disabled={Boolean(errors[name])}
                                onClick={handleNext}
                                variant="outlined">
                            Next
                        </ResponsiveButton>}
                    {index === sections.length - 1 &&
                    <ResponsiveButton 
                        data-cy="submitButton"
                        disabled={Boolean(errors[name]) || submitting}
                        type="submit" variant="outlined"
                    >
                        {submitting ? "Submitting" : "Submit"}
                    </ResponsiveButton>}
                </div>
            </StepContent>
        </Step>
    ), [classes.step, classes.buttons, sections.length, handleBack, handleNext]);

    const Render = ({handleSubmit, errors, submitError, submitting, form}) => {
        const [openError, setOpenError] = useState(false);
        useEffect(() => {
            if (submitError) {
                setOpenError(true);
            }
        }, [submitError]);

        return (
            <form noValidate onSubmit={handleSubmit}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {sections.map((section, index) => renderStep(
                        index, section, errors, submitting, form.mutators,
                    ))}
                </Stepper>
                {submitError &&
                    <Dialog className="error" onClose={() => setOpenError(false)}
                        open={openError}>
                        <DialogTitle disableTypography>
                            An error occurred while submitting. Try again.
                        </DialogTitle>
                        <DialogContent>
                            {submitError.message}
                        </DialogContent>
                        <DialogActions>
                            <ResponsiveButton variant='outlined' onClick={() => setOpenError(false)}>
                                Close
                            </ResponsiveButton>
                        </DialogActions>
                    </Dialog>}
            </form>
        );
    };
    return (
        <div className={classes.root}>
            <Typography align="left" className="heading" data-cy="formTitle"
                variant="h3">
                {title}
            </Typography>
            {showReceipt ?
                <Receipt formData={submittedData} format={base} /> :
                <ReactForm initialValues={initialData} mutators={{
                    "setHourlyTuition": ([name], state, utils) => {
                        utils.changeValue(state, "hourlyTuition", () => name);
                    },
                }}
                onSubmit={submit} render={Render} validate={validate} />}
        </div>
    );
};

export default Form;
