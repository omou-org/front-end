import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

//Material UI Imports
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import BackArrow from "@material-ui/icons/ArrowBack";
import {Typography} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import {NavLink} from "react-router-dom";
import ListItem from "../../Navigation/Navigation";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";

// const handleChange = name => event => {
//     setValues({ ...values, [name]: event.target.value });
// };

class Form extends Component {
    constructor(){
        super();
        this.state = {
            exitPopup:false,
            activeStep: 0,
            form:"",
        }
    }

    componentWillMount() {
        // console.log(this.props.match.params.type);
        this.setState({
            form:this.props.match.params.type
        })
    }

    backToggler(){
        this.setState({exitPopup:!this.state.exitPopup});
    }

    getStepContent(step, formType){
        return this.props.registrationForm[formType][step]
    }

    // Progresses to next section in registration form
    handleNext(){
        this.setState((oldState)=>{
           return{
               activeStep: oldState.activeStep + 1,
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

    render(){
        console.log(this.props.registrationForm[this.state.form][this.state.activeStep]);
        let steps = this.props.registrationForm[this.state.form]["section_titles"];
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
                            New {this.props.match.params.type} Registration
                        </Typography>
                        <Stepper activeStep={this.state.activeStep} orientation={"vertical"} className={"form-section"}>
                            {
                                steps.map((label, i) => {
                                  return <Step key={i}>
                                      <StepLabel>{label}</StepLabel>
                                      <StepContent>
                                          {
                                              this.props.registrationForm[this.state.form][this.state.activeStep].map((field,i)=>{
                                                  return <div>
                                                      <TextField
                                                          key={i}
                                                          label={field.field}
                                                          multiline
                                                          // className={classes.textField}
                                                          margin="normal"
                                                      /> <br/>
                                                  </div>
                                              })
                                          }
                                          <div className={"controls"}>
                                              <Button
                                                  disabled={this.state.activeStep === 0}
                                                  // color={"secondary"}
                                                  onClick={(e)=>{e.preventDefault(); this.handleBack.bind(this)()}}
                                                  className={"button"}
                                              >
                                                  Back
                                              </Button>
                                              <Button
                                                  variant="contained"
                                                  color="primary"
                                                  onClick={(e)=>{e.preventDefault(); this.handleNext.bind(this)()}}
                                                  className={"button"}
                                              >
                                                  {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                              </Button>
                                          </div>
                                      </StepContent>
                                  </Step>
                                })
                            }
                        </Stepper>
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