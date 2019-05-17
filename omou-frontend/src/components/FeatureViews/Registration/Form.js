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

class Form extends Component {
    constructor(){
        super();
        this.state = {
            exitPopup:false,
        }
    }

    backToggler(){
        this.setState({exitPopup:!this.state.exitPopup});
    }

    render(){
        console.log(this.props.match);
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