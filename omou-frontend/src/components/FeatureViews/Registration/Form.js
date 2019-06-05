import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import BackArrow from "@material-ui/icons/ArrowBack";
import {Typography} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {NavLink} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import {InputValidation, NumberValidation} from "./Validations";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add"

//Outside React Component
import SearchSelect from 'react-select';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditional: "",
            exitPopup: false,
            nextSection: false,
            activeStep: 0,
            activeSection: "",
            form: "",
        };
    }

    componentWillMount() {
        let prevState = sessionStorage.getItem("form");
        let formType = this.props.match.params.type;
        let course = this.props.match.params.course;
        if(!prevState || formType !== prevState.form){
            if (this.props.registrationForm[formType]){
                this.setState((oldState)=>{
                    let formContents = JSON.parse(JSON.stringify(this.props.registrationForm[formType]));

                    let NewState = {...oldState,
                        activeSection:formContents.section_titles[0],
                        form: formType,
                    };

                    formContents.section_titles.forEach((title,i)=>{
                        // create blank fields based on form type
                        NewState[title] = {};

                        if(Array.isArray(formContents[title])){
                            formContents[title].forEach((field)=>{
                                NewState[title][field.field] = undefined;
                            });
                        }
                        // create validated state for each field
                        NewState[title + "_validated"] = {};
                        if(Array.isArray(formContents[title])){
                            formContents[title].forEach((field)=>{
                                NewState[title+"_validated"][field.field] = true;
                            });
                        }
                    });

                    // fill out any fields from course route
                    if(course){
                        NewState["Course Selection"]["Course Title"] = course.split("-").join(" ");
                    }

                    return NewState;
                })
            }
        } else if(prevState && formType === prevState.form){
            this.setState(()=>{return JSON.parse(prevState);})
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

    // return to main registration page, trigger exit popup
    backToggler(){
        // clear session storage
        sessionStorage.setItem("form","");
        this.setState({exitPopup:!this.state.exitPopup});
    }

    getStepContent(step, formType){
        return this.props.registrationForm[formType][step]
    }



    validateSection() {
        let formContents = this.getFormObject();
        let currSectionTitle = formContents.section_titles[this.state.activeStep];

        for(let [field_key] of Object.entries(this.state[currSectionTitle+"_validated"])){
            let fields = this.getActiveSection();
            let required = fields.filter(fieldObj => {
               return fieldObj.field === field_key;
            })[0].required;
            if(required && (this.state[currSectionTitle][field_key] === ""
                || this.state[currSectionTitle][field_key]===undefined)){
                return false
            }
        }
        return true;
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
        this.setState((oldState) => {
            if (this.validateSection()) {
                const conditionalField = this.getConditionalFieldFromCurrentSection();
                return {
                    activeStep: oldState.activeStep + 1,
                    activeSection: this.getFormObject().section_titles[oldState.activeStep + 1],
                    conditional: conditionalField ? conditionalField : oldState.conditional,
                    nextSection: true,
                };
            } else {
                return {};
            }
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
        });
    }

    handleReset(){
        this.setState({activeStep:0});
    }

    handleFieldUpdate(sectionTitle, field, fieldValue){
        this.setState((oldState)=>{
            oldState[sectionTitle][field.field] = fieldValue;
            return oldState;
        });
    }

    validateField(sectionTitle, field, fieldValue){
        let validatedInput = InputValidation(fieldValue,field.type);
        // if this is a empty required field
        if((fieldValue === 0 || fieldValue === "") && field.required){
            this.setState((oldState)=>{
               oldState[sectionTitle+"_validated"][field.field] = validatedInput;
               sessionStorage.setItem("form",JSON.stringify(oldState));
               return oldState;
            });
        } else if(validatedInput || ""){ // if valid input or an empty non-required field
            this.setState((oldState)=>{
                // parse if number
                if (NumberValidation(fieldValue)){
                    fieldValue = parseInt(fieldValue);
                    oldState[sectionTitle][field.field] = fieldValue;
                }
                oldState[sectionTitle+"_validated"][field.field] = true;
                if(this.validateSection()){
                    oldState["nextSection"] = true
                }
                sessionStorage.setItem("form",JSON.stringify(oldState));
                return oldState;
            });
        }
    }

    onSelectChange(value,label,fieldTitle){
        this.setState((OldState)=>{
            let NewState = OldState;
            NewState[label][fieldTitle] = value;
            return NewState;
        });
    }

    renderField(field, label){
        let fieldTitle = field.field;
        switch(field.type){
            case "select":
                return <FormControl className={"form-control"}>
                    <InputLabel htmlFor={fieldTitle}>{fieldTitle}</InputLabel>
                    <Select
                        value={this.state[label][fieldTitle]}
                        onChange={(e)=>{this.onSelectChange.bind(this)(e.target.value,label,fieldTitle)}}
                        inputProps={{
                            name: {fieldTitle},
                            id: {fieldTitle},
                        }}
                    >
                        {
                            field.options.map((option,i)=>{
                              return  <MenuItem value={option} key={i}>
                                  <em>{option}</em>
                              </MenuItem>
                            })
                        }
                    </Select>
                </FormControl>;
            case "course":
                let courseList = this.props.courses;
                courseList = courseList.map((course)=>{
                    return {
                        value: course.course_id.toString()+": "+course.course_title,
                        label: course.course_id.toString()+": "+course.course_title,
                    }
                });
                return <SearchSelect
                    onChange={(value)=>{ this.onSelectChange.bind(this)(value,label,fieldTitle)}}
                    options={courseList}
                    className={"search-options"}/>;
            case "teacher":
                let teacherList = this.props.teachers;
                teacherList = teacherList.map((teacher)=>{
                    return {
                        value: teacher.id.toString()+": "+teacher.name,
                        label: teacher.id.toString()+": "+teacher.name,
                    }
                });
                return <SearchSelect
                    onChange={(value)=>{ this.onSelectChange.bind(this)(value,label,fieldTitle)}}
                    options={teacherList}
                    className={"search-options"}/>;
            default:
                return <TextField
                    label={field.field}
                    multiline
                    // className={this.state[label+"_validated"][field.field] ? "": "error"}
                    margin="normal"
                    value={this.state[label][field.field]}
                    error={!this.state[label+"_validated"][field.field]}
                    helperText={!this.state[label+"_validated"][field.field] ? field.field + " invalid": ""}
                    type={field.type === "int" ? "Number": "text"}
                    required={field.required}
                    fullWidth={field.full}
                    onChange={(e)=>{
                        e.preventDefault();
                        this.handleFieldUpdate.bind(this)(label ,field, e.target.value);
                    }}
                    onBlur={(e)=>{
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
        // for some reason it isn't rerendering automatically
        this.forceUpdate();
    }

    renderForm() {
        const {activeSection, activeStep, conditional, nextSection} = this.state,
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
                                        const numSameTypeFields = section.reduce((count, otherField) => field.name === otherField.name ? count + 1 : count, 0);
                                        return (
                                            <div key={j} className="fields-wrapper">
                                                {this.renderField(field, label)}
                                                <br />
                                                {
                                                    numSameTypeFields < field.field_limit &&
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
                                        color={nextSection ? "primary" : "secondary"}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleNext();
                                        }}
                                        className="button">
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

    render() {
        return (
            <Grid container className="">
                <Grid item xs={12}>
                    <Paper className={"registration-form"}>
                        <div onClick={(e)=>{e.preventDefault(); this.backToggler.bind(this)()}}
                            className={"control"}>
                            <BackArrow className={"icon"}/> <div className={"label"}>Back</div>
                        </div>
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.exitPopup}
                            onClose={(e)=>{e.preventDefault(); this.backToggler.bind(this)()}}
                        >
                            <div className={"exit-popup"}>
                                <Typography variant="h6" id="modal-title">
                                    Do you want to save your changes?
                                </Typography>
                                <Button component={NavLink} to={"/registration"}
                                        color={"secondary"}
                                        className={"button secondary"}>
                                    No, discard changes
                                </Button>
                                <Button color={"secondary"} className={"button primary"}>
                                    Yes, save changes
                                </Button>
                            </div>
                        </Modal>
                        <Typography className={"heading"} align={"left"}>
                            {this.props.match.params.course ? this.props.match.params.course.split("-").join(" ") + " " : ""}
                            {this.props.match.params.type} Registration
                        </Typography>
                        {
                            this.props.registrationForm[this.state.form] ? this.renderForm.bind(this)() :
                                <Typography>
                                    Sorry! The form is unavailable.
                                </Typography>
                        }

                    </Paper>
                </Grid>
            </Grid>
        )
    }
}

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
        registrationForm: state.Registration["registration_form"],
        teachers: state.Registration["teacher_list"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);