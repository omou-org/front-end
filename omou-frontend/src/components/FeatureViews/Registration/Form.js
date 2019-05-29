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

class Form extends Component {
    constructor(props){
        super(props);
        this.state = {
            exitPopup:false,
            nextSection:false,
            activeStep: 0,
            activeSection: "",
            form:"",
            formObject: {},
        }
    }

    componentWillMount() {
        let prevState = sessionStorage.getItem("form");
        let formType = this.props.match.params.type;
        if(!prevState || formType !== prevState.form){
            if (this.props.registrationForm[formType]){
                this.setState((oldState)=>{
                    let formContents = JSON.parse(JSON.stringify(this.props.registrationForm[formType]));

                    let NewState = {...oldState,
                        activeSection:formContents.section_titles[0],
                        form: formType,
                        formObject: formContents,
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
                    return NewState;
                })
            }
        } else if(prevState && formType === prevState.form){
            this.setState(()=>{return JSON.parse(prevState);})
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


    validateSection(){
        let formContents = this.state.formObject;
        let currSectionTitle = formContents.section_titles[this.state.activeStep];

        for(let [field_key] of Object.entries(this.state[currSectionTitle+"_validated"])){
            let fields = this.state.formObject[this.state.activeSection];
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

    getConditionalFieldFromCurrentSection(){
        let nextSectionInput = false;
        let currSectionTitle = this.state.activeSection;
        // Get input from the conditional field
        if(Array.isArray(this.state.formObject[currSectionTitle])){
            this.state.formObject[currSectionTitle].some((field)=>{
                if(field.conditional){
                    nextSectionInput = this.state[currSectionTitle][field.field];
                    return field.conditional;
                }
            });
        }
        return nextSectionInput;
    }

    setNextConditionalSection(nextSectionInput){
        let formContents = this.state.formObject;

        // set the next conditional section
        this.setState((oldState)=>{
            let NewState = oldState;

            // if there was a selection for the next type of section
            if(nextSectionInput){
                // set-up fields for the next section
                oldState.formObject.section_titles.forEach((title,i)=>{
                    // for conditional sections,
                    if(formContents[title] instanceof Object && nextSectionInput in formContents[title]){
                        formContents[title][nextSectionInput].forEach((field)=>{
                            NewState[title][field.field] = undefined;
                        });

                        // create validated state for each field
                        NewState[title + "_validated"] = {};

                        formContents[title][nextSectionInput].forEach((field)=>{
                            NewState[title+"_validated"][field.field] = true;
                        });

                        // set conditional section to the user selected section
                        NewState.formObject[title] = formContents[title][nextSectionInput];
                    }
                });
            }
            return NewState;
        });
    }

    // Progresses to next section in registration form
    handleNext(){
        this.setState((oldState)=>{
            if(this.validateSection()){
                let conditionalField = this.getConditionalFieldFromCurrentSection();
                if(conditionalField){
                    this.setNextConditionalSection(conditionalField);
                }
                return{
                    activeStep: oldState.activeStep + 1,
                    activeSection: oldState.formObject.section_titles[oldState.activeStep + 1],
                    nextSection: true,
                }
            }
        });
    }

    // Regresses to previous section in registration form
    handleBack(){
        this.setState((oldState)=>{
            if(oldState.activeStep !== 0 && oldState.activeSection){
                let NewState = oldState;
                let SectionTitles = oldState.formObject.section_titles;
                let ConditionalSectionTitle;

                // Reset the conditional section
                SectionTitles.some((title,stepIndex)=>{
                    if(Array.isArray(oldState.formObject[title])){
                        return oldState.formObject[title].some((field)=>{
                            // check if a conditional field is the previous section
                            if(field.conditional && oldState.activeStep - 1 === stepIndex){
                                ConditionalSectionTitle = SectionTitles[oldState.activeStep];
                                NewState.formObject[ConditionalSectionTitle] = this.props.registrationForm[oldState.form][ConditionalSectionTitle];
                                return true;
                            }
                        });
                    }
                });
                NewState.activeStep = oldState.activeStep - 1;
                NewState.activeSection = oldState.formObject.section_titles[NewState.activeStep];

                return NewState;
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
    // http://localhost:3000/registration/form/student
    renderForm(){
        // console.log(this.props.match.params);
        // console.log(this.state.formObject);
        let steps = this.props.registrationForm[this.state.form]["section_titles"];
        return <Stepper activeStep={this.state.activeStep} orientation={"vertical"} className={"form-section"}>
            {
                steps.map((label, i) => {
                    return <Step key={i}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {
                                this.state.formObject[this.state.activeSection].map((field,i)=>{
                                    return <div key={i}>
                                        <TextField
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
                                        /> <br/>
                                    </div>
                                })
                            }
                            <div className={"controls"}>
                                <Button
                                    disabled={this.state.activeStep === 0}
                                    color={"secondary"}
                                    onClick={(e)=>{e.preventDefault(); this.handleBack.bind(this)()}}
                                    className={`button ${this.state.activeStep === 0 ? 'hide' : ''}`}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color={this.state.nextSection ? "primary" : "secondary"}
                                    onClick={(e)=>{e.preventDefault(); this.handleNext.bind(this)()}}
                                    className={`button`}
                                >
                                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                })
            }
        </Stepper>
    }

    render(){
        // console.log(this.state);
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
                        <Typography className={"heading"}>
                            {this.props.match.params.type.split("-").join(" ")} Registration
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

Form.propTypes = {
    stuffActions: PropTypes.object,
    FormForms: PropTypes.array
};

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
        registrationForm: state.Registration["registration_form"]
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