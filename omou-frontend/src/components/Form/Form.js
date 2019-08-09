import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TableRow from "@material-ui/core/TableRow";
import { Prompt } from 'react-router';
import { NavLink } from "react-router-dom";

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import { InputValidation } from "../FeatureViews/Registration/Validations";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Clear";

//Outside React Component
import SearchSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import BackButton from "../BackButton.js";
import Modal from "@material-ui/core/Modal";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditional: "",
            nextSection: false,
            activeStep: 0,
            activeSection: "",
            form: "",
            submitted: false,
            existingUser: false,
        };
    }

    componentWillMount() {
        let prevState = JSON.parse(sessionStorage.getItem("form") || null);
        const formType = this.props.computedMatch.params.type;
        if (!prevState || formType !== prevState.form || prevState["submitted"] || this.props.computedMatch.params.course) {
            if (this.props.registrationForm[formType]) {
                this.setState((oldState) => {
                    let formContents = JSON.parse(JSON.stringify(this.props.registrationForm[formType]));
                    let NewState = {
                        ...oldState,
                        activeSection: formContents.section_titles[0],
                        form: formType,
                    };

                    let course = '';
                    if (this.props.computedMatch.params.course) {
                        course = decodeURIComponent(this.props.computedMatch.params.course);
                        course = Object.keys(this.props.courses).find(( courseID ) => {
                            return this.props.courses[courseID].title === course});
                        course = this.props.courses[course];
                        if (course) {
                            // convert it to a format that onselectChange can use
                            course = {
                                value: `${course.course_id}: ${course.title}`,
                                label: `${course.course_id}: ${course.title}`,
                            };
                        }
                    }
                    formContents.section_titles.forEach((title) => {
                        // create blank fields based on form type
                        NewState[title] = {};
                        // set a value for every non-conditional field (object)
                        if (Array.isArray(formContents[title])) {
                            formContents[title].forEach(({ field, type, options }) => {
                                switch (type) {
                                    case "course":
                                        NewState[title][field] = course;
                                        break;
                                    case "select":
                                        NewState[title][field] = options[0];
                                        break;
                                    case "student":
                                        NewState[title][field] = '';
                                        break;
                                    default:
                                        NewState[title][field] = null;
                                }
                            });
                        }
                        // create validated state for each field
                        NewState[`${title}_validated`] = {};
                        if (Array.isArray(formContents[title])) {
                            formContents[title].forEach((field) => {
                                NewState[`${title}_validated`][field.field] = true;
                            });
                        }
                    });
                    return NewState;
                }, () => {
                    this.setState({
                        nextSection: this.validateSection(),
                    });
                });
            }
        } else if (prevState && !prevState["submitted"]) {
            this.setState(prevState);
        }
    }

    getFormObject() {
        return this.props.registrationForm[this.state.form];
    }

    getActiveSection() {
        let section = this.getFormObject()[this.state.activeSection];
        if (Array.isArray(section)) {
            return section;
        } else {
            return section[this.state.conditional]
        }
    }

    onBack() {
        // clear session storage
        sessionStorage.setItem("form", "");
    }

    getStepContent(step, formType) {
        return this.props.registrationForm[formType][step]
    }

    validateSection() {
        const currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];

        return (
            this.getActiveSection()
                .filter(({ required }) => required)
                .every(({ field }) => this.state[currSectionTitle][field]) &&
            Object.values(this.state[`${currSectionTitle}_validated`])
                .every((valid) => valid)
        );
    }

    getConditionalFieldFromCurrentSection() {
        let nextSectionInput = false;
        let currSectionTitle = this.state.activeSection;
        // Get input from the conditional field
        if (Array.isArray(this.getFormObject()[currSectionTitle])) {
            this.getFormObject()[currSectionTitle].some((field) => {
                if (field.conditional) {
                    nextSectionInput = this.state[currSectionTitle][field.field];
                    return true;
                } else {
                    return false;
                }
            });
        }
        return nextSectionInput;
    }

    // Progresses to next section in registration form
    handleNext() {
        const currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        let section = this.props.registrationForm[this.state.form][this.state.activeSection];
        if (!Array.isArray(section)) {
            section = section[this.state.conditional];
        }
        section.forEach((field) => {
            this.validateField(currSectionTitle, field, this.state[currSectionTitle][field.field]);
        });
        this.setState((oldState) => {
            if (this.validateSection()) {
                if (!oldState.submitted && oldState.activeStep === this.getFormObject().section_titles.length - 1) {
                    this.props.registrationActions.submitForm(this.state);
                    sessionStorage.setItem("form", "");
                    return {
                        submitted: true,
                    };
                } else {
                    const conditionalField = this.getConditionalFieldFromCurrentSection(),
                        nextActiveStep = oldState.activeStep + 1,
                        nextActiveSection = this.getFormObject().section_titles[nextActiveStep];
                    let newState = {
                        activeStep: nextActiveStep,
                        activeSection: nextActiveSection,
                        conditional: conditionalField ? conditionalField : oldState.conditional,
                        nextSection: false,
                    };
                    if (conditionalField) {
                        let formContents = this.getFormObject(),
                            title = nextActiveSection;
                        // create blank fields based on form type
                        newState[title] = {};
                        formContents[nextActiveSection][conditionalField].forEach((field) => {
                            newState[title][field.field] = null;
                        });
                        // create validated state for each field
                        newState[`${title}_validated`] = {};
                        formContents[nextActiveSection][conditionalField].forEach((field) => {
                            newState[`${title}_validated`][field.field] = true;
                        });
                    }
                    return newState;
                }
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    // Regresses to previous section in registration form
    handleBack() {
        this.setState((oldState) => {
            if (oldState.activeStep !== 0 && oldState.activeSection) {
                return {
                    activeStep: oldState.activeStep - 1,
                    activeSection: this.getFormObject().section_titles[oldState.activeStep - 1],
                };
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    handleReset() {
        this.setState({ activeStep: 0 });
    }

    handleFieldUpdate(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            oldState[sectionTitle][field.field] = fieldValue;
            return oldState;
        });
    }

    validateField(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            if (!fieldValue) { // if empty field
                oldState[`${sectionTitle}_validated`][field.field] = !field.required;
            } else if (InputValidation(fieldValue, field.type)) { // if valid input
                let isValid = true;
                if (field.type === "number") {
                    // parse if number
                    oldState[sectionTitle][field.field] = parseInt(fieldValue, 10);
                } else if (field.type === "email") {
                    let emails = [];
                    if (field.field === "Student Email") {
                        emails = this.props.students.map(({ email }) => email);
                    }
                    // validate that email doesn't exist in database already
                    console.log(emails.includes(fieldValue));
                    isValid = !emails.includes(fieldValue);
                    if (!isValid) {
                        oldState.existingUser = true;
                    }
                }
                oldState[`${sectionTitle}_validated`][field.field] = isValid;
            } else {
                oldState[`${sectionTitle}_validated`][field.field] = false;
            }
            return oldState;
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            }, () => {
                sessionStorage.setItem("form", JSON.stringify(this.state));
            });
        });
    }

    onSelectChange(value, label, field) {
        if (field.type.indexOf("create") > -1 && typeof value === 'object' && !value.__isNew__) {
            if (field.type === "create parent") {
                this.setState((OldState) => {
                    let NewState = OldState;
                    console.log(value, this.props.parents);
                    let selectedParentID = value.label.substring(0, value.label.indexOf(":"));
                    let { user_id, name, gender, email, address, city, zipcode, state, relationship, phone_number } = this.props.parents.find((parent) => {
                        return selectedParentID == parent.user_id;
                    });

                    NewState[label] = {
                        "Parent Name": name,
                        "Gender": gender,
                        "Parent Email": email,
                        "Address": address,
                        "City": city,
                        "State": state,
                        "Zip Code": zipcode,
                        "Relationship to Student": relationship,
                        "Parent Phone Number": phone_number,
                        "user_id": user_id,
                    };
                    let ParentKeys = Object.keys(NewState[label]);
                    ParentKeys.forEach((key) => {
                        NewState[label + "_validated"][key] = true;
                    });
                    return NewState;
                }, () => {
                    if (!(field.type === "create parent")) {
                        this.validateField(this.state.activeSection, field, value);
                    } else {
                        // This is when the parent field is filled, submit the form
                        this.validateSection();
                        this.setState({ nextSection: true });
                    }

                });
            } else {
                this.setState({ existingUser: true });
            }
        } else if (value.__isNew__) {
            this.setState((OldState) => {
                let NewState = OldState;
                NewState[label][field.field] = value.value;
                console.log(NewState[label][field.field], "new value!");
                return NewState;
            }, () => {
                this.validateField(this.state.activeSection, field, value);
            });
        } else {
            this.setState((OldState) => {
                let NewState = OldState;
                NewState[label][field.field] = value;
                return NewState;
            }, () => {
                this.validateField(this.state.activeSection, field, value);
            });
        }
    }

    // removes duplicates with arr1 from arr2 from search select field
    removeDuplicates(arr1, arr2) {
        let stringValue, stringOtherValue;
        arr1.forEach((value) => {
            if (value) {
                stringValue = value.value;
            } else {
                stringValue = '';
            }
            arr2.forEach((otherValue, j) => {
                if (otherValue) {
                    stringOtherValue = otherValue.value;
                } else {
                    stringOtherValue = '';
                }
                if (stringValue === stringOtherValue) {
                    arr2[j] = '1';
                }
            });
        });
        let uniqueVals = [...new Set(arr2)], indexOfString = -1;
        uniqueVals.forEach((value, i) => {
            if (typeof value === "string") {
                indexOfString = i;
            }
        });
        if (indexOfString > -1) {
            uniqueVals.splice(indexOfString, 1);
        }
        return uniqueVals;
    }

    renderField(field, label, fieldIndex) {
        let fieldTitle = field.field, currSelectedValues;
        switch (field.type) {
            case "select":
                return <FormControl className={"form-control"}>
                    <InputLabel htmlFor={fieldTitle}>{fieldTitle}</InputLabel>
                    <Select
                        value={this.state[label][fieldTitle]}
                        onChange={({ target }) => {
                            this.onSelectChange(target.value, label, field);
                        }}>
                        {
                            field.options.map((option) => (
                                <MenuItem value={option} key={option}>
                                    <em>{option}</em>
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>;
            case "course":
                const courseList = Object.keys(this.props.courses)
                    .filter((courseID) => this.props.courses[courseID].capacity > this.props.courses[courseID].filled)
                    .map((courseID) => ({
                        value: `${courseID}: ${this.props.courses[courseID].title}`,
                        label: `${courseID}: ${this.props.courses[courseID].title}`,
                    }));
                return <SearchSelect
                    value={this.state[label][fieldTitle]}
                    onChange={(value) => {
                        this.onSelectChange(value, label, field);
                    }}
                    options={courseList}
                    className="search-options" />;
            case "student":
                if (this.state.conditional) {
                    currSelectedValues = Object.values(this.state[label]);
                } else {
                    currSelectedValues = Object.values(this.state[label]);
                }

                let studentList = this.props.students
                    .map(({ user_id, name, email }) => ({
                        value: `${name} - ${email}`,
                        label: `${user_id}: ${name} - ${email}`,
                    }));
                studentList.unshift({
                    value: `${0}: ${'None'}`,
                    label: `${0}: ${'None'}`,
                });
                studentList = this.removeDuplicates(currSelectedValues, studentList);

                return (<div style={{ width: "inherit", }}>
                    <Grid container className={"student-align"} spacing={2000}>
                        <SearchSelect
                            value={this.state[label][fieldTitle] ? this.state[label][fieldTitle] : ''}
                            onChange={(value) => {
                                this.onSelectChange(value, label, field);
                            }}
                            options={studentList}
                            className="search-options" />
                        {
                            ((this.state.conditional && fieldIndex <= 1) || (fieldIndex === 0)) ? '' :
                                <RemoveIcon color="primary" aria-label="Add" variant="extended"
                                    className="button-remove-student"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        //deletes answer field from state
                                        this.removeField(fieldIndex);
                                        this.setState((prevState) => {
                                            return prevState;
                                        })
                                    }}>
                                </RemoveIcon>
                        }
                    </Grid>
                </div>);
            case "teacher":

                currSelectedValues = Object.values(this.state[label]);
                let teacherList = this.props.teachers;

                teacherList = teacherList.map((teacher) => {
                    return {
                        value: teacher.id.toString() + ": " + teacher.name,
                        label: teacher.id.toString() + ": " + teacher.name,
                    }
                });
                teacherList = this.removeDuplicates(currSelectedValues, teacherList);
                return (<div style={{ width: "inherit", }}>

                    <Grid container className={"student-align"} spacing={2000}>
                        <SearchSelect
                            value={this.state[label][fieldTitle] ? this.state[label][fieldTitle] : ''}
                            onChange={(value) => {
                                this.onSelectChange(value, label, field);
                            }}
                            options={teacherList}
                            className="search-options" />
                    </Grid>
                </div>);
            case "create parent":
                let currParentList = this.props.parents
                    .map(({ user_id, name, email }) => ({
                        value: `${name} - ${email}`,
                        label: `${user_id}: ${name} - ${email}`,
                    }));
                return (
                    <CreatableSelect
                        className="search-options"
                        isClearable
                        onChange={(value) => {
                            this.onSelectChange(value, label, field);
                        }}
                        options={currParentList}
                    />
                );
            default:
                return <TextField
                    label={field.field}

                    multiline={ field.multiline}
                      // className={this.state[label+"_validated"][field.field] ? "": "error"}
                    margin="normal"
                    value={this.state[label][field.field]}
                    error={!this.state[label + "_validated"][field.field]}
                    helperText={!this.state[label + "_validated"][field.field] ? field.field + " invalid" : ""}
                    type={field.type === "int" ? "Number" : "text"}
                    required={field.required}
                    fullWidth={field.full}
                    onChange={(e) => {
                        e.preventDefault();
                        this.handleFieldUpdate.bind(this)(label, field, e.target.value);
                    }}
                    onBlur={(e) => {
                        e.preventDefault();
                        this.validateField.bind(this)(label, field, e.target.value);
                    }}
                />
        }
    }

    addField(field, fieldIndex) {
        const currentForm = this.getFormObject();
        let param = [this.state.form, this.state.activeSection, fieldIndex];
        if (!Array.isArray(currentForm[this.state.activeSection])) {
            param.splice(2, 0, this.state.conditional);
        }
        this.props.registrationActions.addField(param);
        sessionStorage.setItem("form", JSON.stringify(this.state));
        // for some reason it isn't rerendering automatically
        this.forceUpdate();
    }

    removeField(fieldIndex) {
        this.setState((prevState) => {
            // Delete field from state
            let fieldtoDeleteKey;
            if (Array.isArray(this.props.registrationForm[this.state.form][this.state.activeSection])) {
                fieldtoDeleteKey = this.props.registrationForm[this.state.form][this.state.activeSection][fieldIndex].field;
            } else {
                fieldtoDeleteKey = this.props.registrationForm[this.state.form][this.state.activeSection][this.state.conditional][fieldIndex].field;
            }
            delete prevState[prevState["activeSection"]][fieldtoDeleteKey];
            delete prevState[prevState["activeSection"] + "_validated"][fieldtoDeleteKey];

            //rename all existing fields to be in the right order. currently there can be 2 student 3's
            let currentSectionFields = prevState[prevState["activeSection"]];
            let currentSectionValidationFields = prevState[prevState["activeSection"] + "_validated"];
            let baseFieldName, curFieldName;

            for (const [index, [origFieldKey, field]] of Object.entries(Object.entries(currentSectionFields))) {
                if (index === String(0)) {
                    baseFieldName = origFieldKey;
                    curFieldName = baseFieldName
                } else {
                    curFieldName = baseFieldName + " " + (index !== 0 ? index : '');
                }
                // Rename Answer Fields
                if (origFieldKey !== curFieldName) {
                    Object.defineProperty(currentSectionFields, curFieldName,
                        Object.getOwnPropertyDescriptor(currentSectionFields, origFieldKey));
                    delete currentSectionFields[origFieldKey];
                }
                // Rename Validation Fields
                if (origFieldKey + "_validated" !== curFieldName + "_validated") {
                    Object.defineProperty(currentSectionValidationFields, curFieldName,
                        Object.getOwnPropertyDescriptor(currentSectionValidationFields, origFieldKey));
                    delete currentSectionValidationFields[origFieldKey];
                }
            }

            //save to session Storage
            sessionStorage.setItem("form", JSON.stringify(this.state));
            return prevState;
        }, () => {
            //delete field from redux store
            let param = [this.state.form, this.state.activeSection];
            this.props.registrationActions.removeField(param, fieldIndex, this.state.conditional);
            this.forceUpdate();
        });
        this.forceUpdate();
    }

    renderForm() {
        let { activeSection, activeStep, conditional, nextSection } = this.state,
            currentForm = this.props.registrationForm[this.state.form],
            steps = currentForm.section_titles;
        let section = currentForm[activeSection];
        if (!Array.isArray(section)) {
            section = section[conditional];
        }
        return (
            <Stepper activeStep={activeStep} orientation="vertical" className="form-section">
                {
                    steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {
                                    section.map((field, j) => {
                                        // number of fields of the same type as the current field
                                        const numSameTypeFields = section.reduce((count, otherField) => field.name === otherField.name ? count + 1 : count, 0),
                                            reversedSection = [...section].reverse(),
                                            lastFieldOfType = reversedSection.find((otherField) => otherField.name === field.name);
                                        return (
                                            <div key={j} className="fields-wrapper" style={{}}>
                                                <Grid container className={"student-align"} spacing={20}>
                                                    {label === this.state.activeSection ? this.renderField(field, label, j) : ''}
                                                </Grid>
                                                <br />
                                                {
                                                    this.props.computedMatch.params.course === undefined && numSameTypeFields < field.field_limit &&
                                                    field === lastFieldOfType &&
                                                    <Fab color="primary" aria-label="Add" variant="extended"
                                                        className="button add-student"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            this.addField(field.field, j);
                                                        }}>
                                                        <AddIcon />
                                                        Add {field.field}
                                                    </Fab>
                                                }

                                            </div>
                                        );
                                    })
                                }
                                <div className="controls">
                                    <Button
                                        disabled={activeStep === 0}
                                        color="secondary"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleBack();
                                        }}
                                        className={`button ${activeStep === 0 ? "hide" : ""}`}>
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!nextSection}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleNext();
                                        }}
                                        className="button primary">
                                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    ))
                }
            </Stepper>
        );
    }

    // view after a submitted form
    renderSubmitted() {
        let { activeSection, activeStep, conditional, nextSection } = this.state,
            currentForm = this.props.registrationForm[this.state.form],
            steps = currentForm.section_titles;
        return (
            <div style={{margin:2+"%", padding:5+"px"}}>
                <Typography align={"left"} style={{fontSize:24+'px'}}>
                    You have successfully registered!
                </Typography>
                <Typography align={"left"} style={{fontSize:14+'px'}}>
                    An email will be sent to you to confirm your registration
                </Typography>
                <Button
                    align={"left"}
                    component={NavLink}
                    to={"/registration"}
                    style={{margin:"20px"}}
                    className={"button"}>Back to Registration</Button>
                <div className={"confirmation-copy"}>
                    <Typography className={"title"} align={'left'}>Confirmation Copy</Typography>
                {
                    steps.map((sectionTitle)=>{
                        return (<div>
                            <Typography className={'section-title'}
                                align={'left'}>{sectionTitle}</Typography>
                            {
                                currentForm[sectionTitle].map((field)=>{
                                    let fieldVal = this.state[sectionTitle][field.field];
                                    if(fieldVal){
                                        if("value" in fieldVal){
                                            fieldVal = fieldVal.value;
                                        }
                                    }
                                    return (<div>
                                        <Typography className={'field-title'} align={'left'}>{field.field !== null ? field.field: ''}</Typography>
                                        <Typography className={'field-value'} align={'left'}>{ fieldVal !== '' && fieldVal !== null && fieldVal ? fieldVal : "N/A"}</Typography>
                                    </div>);
                                })
                            }
                        </div>)
                    })
                }
                </div>
            </div>
        );
    }

    render() {
        return (
            <Grid container className="">
                {/*Determine if finished component is displayed. If not, then don't prompt*/}
                {this.state.submitted ? '' : <Prompt message="Are you sure you want to leave?" />}
                <Grid item xs={12}>
                    <Paper className={"registration-form paper"}>
                        <BackButton
                            warn={true}
                            onBack={this.onBack}
                            alertMessage={"Do you want to save your changes?"}
                            alertConfirmText={"Yes, save changes"}
                            confirmAction={"saveForm"}
                            alertDenyText={"No, don't save changes"}
                            denyAction={"default"}
                        />
                        <Typography className={"heading"} align={"left"}>
                            {this.props.computedMatch.params.course ? `${decodeURIComponent(this.props.computedMatch.params.course)} ` : ""}
                            {this.props.computedMatch.params.type} Registration
                        </Typography>
                        {
                            !this.state.submitted ?
                                this.props.registrationForm[this.state.form] ?
                                    this.renderForm.bind(this)() :
                                    <Typography>
                                        Sorry! The form is unavailable.
                                    </Typography>
                                : this.renderSubmitted()
                        }
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.existingUser}
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({ existingUser: false })
                            }}>
                            <div className="existing-user-popup">
                                <Typography variant="h6" id="modal-title">
                                    {"The user you are entering already exists in the database! Please enter a new email, and check for spelling."}
                                </Typography>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({ existingUser: false })
                                    }}
                                    color="primary"
                                    className="button primary">
                                    {"I will enter a new email"}
                                </Button>
                            </div>
                        </Modal>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses: state.Course["NewCourseList"],
        courseCategories: state.Course["CourseCategories"],
        registrationForm: state.Registration["registration_form"],
        parents: state.Users["ParentList"],
        students: state.Users["StudentList"],
        teachers: state.Users["TeacherList"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form);