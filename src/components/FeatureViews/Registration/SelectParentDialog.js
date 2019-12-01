import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import ReactSelect from 'react-select';
import AccountsCards from "../Search/cards/AccountsCards";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
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
            "parentOptions": [],
        };
    }

    componentWillMount() {
        let pastParent = sessionStorage.getItem("CurrentParent");
        if(pastParent !== "none"){
            pastParent = JSON.parse(pastParent);
            this.props.registrationActions.setRegisteringParent(pastParent);
        }
        // this.props.userActions.fetchParents();
    }

    handleClose = () => {
        // if there's something in the input
        if(this.state.inputParent.value !== ""){
            let idStartIndex = this.state.inputParent.value.indexOf("-")+1;
            let parentID = Number(this.state.inputParent.value.substring(idStartIndex));
            let selectedParent = this.props.users.ParentList[parentID];

            selectedParent = {
                user: {
                    id: selectedParent.user_id,
                    email: selectedParent.email,
                    first_name: selectedParent.first_name,
                    last_name: selectedParent.last_name,
                    name: selectedParent.name,
                },
                user_uuid: selectedParent.user_id,
                gender: selectedParent.gender,
                birth_date: selectedParent.birthday,
                student_list: selectedParent.student_ids,
                account_type: "PARENT",
            };
            console.log(selectedParent);

            this.props.registrationActions.setRegisteringParent(selectedParent);
            // Add students to redux once the registered parent has been set
            selectedParent.student_list.forEach((studentID)=>{
               this.props.userActions.fetchStudents(studentID);
            });
            sessionStorage.setItem("CurrentParent", JSON.stringify(selectedParent));
        }
        // close the dialogue
        this.props.onClose();
    };

    handleOnChange = ()=>(e) => {
        this.setState((oldState)=>{
            // update field with what's being typed by the user
            oldState.inputParent = e;

            // make search parent api call
            // let requestConfig = { params: { query: this.state.inputParent, page: 1, profileFilter: "parent" },
            //     headers: {"Authorization": `Token ${this.props.auth.token}`,} };
            // this.props.searchActions.fetchSearchAccountQuery()
            return oldState;
        });
    }

    handleExitParent = () => (e) =>{
        e.preventDefault();

        this.setState((oldState)=>{
            oldState.inputParent = { value: "", label:""};
            this.props.registrationActions.setRegisteringParent("");
            return oldState
        }, ()=>{
            sessionStorage.setItem("CurrentParent", "none");
            sessionStorage.setItem("registered_courses",JSON.stringify({}));
            this.handleClose();
        });

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

    handleSetParentButton = () => (e)=>{
        e.preventDefault();
        this.handleClose();
    }

    renderParentSuggestionList = ()=>{
        return Object.values(this.props.users.ParentList).map((parent)=>{
            return {
                value: parent.name + " - " + parent.user_id.toString(),
                label: parent.name,
            }
        });
    }

    SetParentDialog = () =>{
        return (
            <>
                <ReactSelect classNamePrefix={"select-parent-search"}
                             value = {this.state.inputParent}
                             options={this.renderParentSuggestionList()}
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
    "users": state.Users,
    "auth": state.auth,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
    "searchActions": bindActionCreators(searchActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectParentDialog);