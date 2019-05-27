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

// const handleChange = name => event => {
//     setValues({ ...values, [name]: event.target.value });
// };

class Form extends Component {
    constructor(){
        super();
        this.state = {
            exitPopup:false,
            nextSection:false,
            activeStep: 0,
            form:"",
        }
    }

    componentWillMount() {
        let prevState = sessionStorage.getItem("form");

        if(!prevState){
            let formType = this.props.match.params.type;
            if (this.props.registrationForm[formType]){
                this.setState((oldState)=>{
                    let formContents = this.props.registrationForm[formType];

                    let NewState = {...oldState,
                        form: formType,
                    };

                    formContents.section_titles.forEach((title,i)=>{
                        // create blank fields based on form type
                        NewState[title] = {};
                        formContents[i].forEach((field)=>{
                            NewState[title][field.field] = undefined;
                        });

                        // create validated state for each field
                        NewState[title + "_validated"] = {};
                        formContents[i].forEach((field)=>{
                            NewState[title+"_validated"][field.field] = true;
                        });
                    });
                    return NewState;
                })
            }
        } else {
            this.setState(()=>{return JSON.parse(prevState);})
        }
    }

    componentWillUnmount() {
        // console.log('component unmounting');
        // sessionStorage.setItem()
    }

    backToggler(){
        this.setState({exitPopup:!this.state.exitPopup});
    }

    getStepContent(step, formType){
        return this.props.registrationForm[formType][step]
    }


    validateSection(){
        let formType = this.props.match.params.type;
        let formContents = this.props.registrationForm[formType];
        let currSectionTitle = formContents.section_titles[this.state.activeStep];
        for(let [field_key] of Object.entries(this.state[currSectionTitle+"_validated"])){
            let fields = this.props.registrationForm[this.state.form][this.state.activeStep];
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

    // Progresses to next section in registration form
    handleNext(){
        this.setState((oldState)=>{
            if(this.validateSection()){
                return{
                    activeStep: oldState.activeStep + 1,
                    nextSection: true,
                }
            }
        });
    }

    // Regresses to previous section in registration form
    handleBack(){
        this.setState((oldState)=>{
            return{
                activeStep: oldState.activeStep - 1,
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
        let steps = this.props.registrationForm[this.state.form]["section_titles"];
        return <Stepper activeStep={this.state.activeStep} orientation={"vertical"} className={"form-section"}>
            {
                steps.map((label, i) => {
                    return <Step key={i}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            {
                                this.props.registrationForm[this.state.form][this.state.activeStep].map((field,i)=>{
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
                                <Typography className={`${!this.state.nextSection ? "hide" : ""} label`}>
                                    Please complete this section
                                </Typography>
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
                        {/*<Chip*/}
                            {/*label={"New"}*/}
                            {/*color="primary"*/}
                            {/*className={"label"}/>*/}
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