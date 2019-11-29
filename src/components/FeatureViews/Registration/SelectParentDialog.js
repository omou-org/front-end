import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';
import ReactSelect from 'react-select';
import AccountsCards from "../Search/cards/AccountsCards";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";

const parents = [
    {
        value: "Eileen Hong-123",
        label: "Eileen Hong"
    },
    {
        value: "Eileen Wang-125",
        label: "Eileen Wang"
    },
    {
        value: "Eileen Harrison-133",
        label: "Eileen Harrison"
    },
    {
        value: "Eileen Grant-123",
        label: "Eileen Grant"
    },
];

const testParent = {
    user: {
        id: 123,
        email: "parent@school.com",
        first_name: "Eileen",
        last_name: "Hong",
        name: "Eileen Hong",
    },
    user_uuid: 12,
    gender: "F",
    birth_date: "12/12/1963",
    student_list: [ 1, 2 ],
    account_type: "PARENT",
};

const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class SelectParentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "inputParent": { value: "", label:""},
        };

    }

    componentWillMount() {
        let pastParent = JSON.parse(sessionStorage.getItem("CurrentParent"));
        if(pastParent){
            this.props.registrationActions.setRegisteringParent(pastParent);
        }
    }

    handleClose = () => {
        if(this.state.inputParent.value !== ""){
            let idStartIndex = this.state.inputParent.value.indexOf("-")+1;
            let parentID = this.state.inputParent.value.substring(idStartIndex);
            // TODO: get parent by parent ID
            this.props.registrationActions.setRegisteringParent(testParent);
            sessionStorage.setItem("CurrentParent", JSON.stringify(testParent));
        }
        this.props.onClose();
    };

    handleOnChange = ()=>(e) => {
        this.setState((oldState)=>{
            oldState.inputParent = e;
            return oldState;
        });
    }

    handleExitParent = () => (e) =>{
        e.preventDefault();
        this.props.registrationActions.setRegisteringParent(null);
        this.handleClose();
    }

    ActiveParentDialog = () =>{
        let numCourses = 0;
        let allCoursesPerStudent = Object.values(this.props.registration.registered_courses);
        let allCourses = 0;
        allCoursesPerStudent.forEach((studentCourses) => {
            allCourses += studentCourses.length;
        });

        return (
            <div className={"active-parent-dialog-content"}>
                <Grid container>
                    <Grid item xs={10}
                          sm={12}
                    >
                        <AccountsCards user={this.props.registration.CurrentParent}/>
                    </Grid>
                    {/*<h3>{this.props.registration.CurrentParent.user.name}</h3>*/}
                    <Grid item xs={5}>
                        <Button color={"primary"} className={"button"}
                                onClick={this.handleExitParent()}>
                            Exit Parent
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Button component={NavLinkNoDup} to={"/registration/cart"}
                                color={"primary"} className={"button"}>Checkout {allCourses} Courses</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }

    handleSetParentButton = ()=>(e)=>{
        e.preventDefault();
        this.handleClose();
    }

    SetParentDialog = () =>{
        return (
            <>
                <ReactSelect classNamePrefix={"select-parent-search"}
                             value = {this.state.inputParent}
                             options={parents}
                             onChange={this.handleOnChange()}
                />
                <Button onClick={this.handleSetParentButton()}>Set Parent</Button>
            </>
        )
    }

    render() {
        return (
            <Dialog className={"select-parent-dialog"}
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title" open={this.props.open}>
                <DialogTitle id="simple-dialog-title">
                    <h3>Currently helping...</h3>
                </DialogTitle>
                {
                    this.props.registration.CurrentParent ?
                        this.ActiveParentDialog() :
                        this.SetParentDialog()
                }
            </Dialog>
        );
    }
}

SelectParentDialog.propTypes = {
    onClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
    "registration": state.Registration,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectParentDialog);