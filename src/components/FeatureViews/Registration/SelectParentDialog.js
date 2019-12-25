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

class SelectParentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "inputParent": { value: "", label:""},
            "parentOptions": [],
        };
    }

    componentDidMount(){
        let pastParent = sessionStorage.getItem("CurrentParent");
        if(pastParent !== "none"){
            pastParent = JSON.parse(pastParent);
            this.props.registrationActions.setRegisteringParent(pastParent);
        }
    }

    handleClose = () => {
        // if there's something in the input
        if(this.state.inputParent.value !== ""){
            let idStartIndex = this.state.inputParent.value.indexOf("-")+1;
            let parentID = Number(this.state.inputParent.value.substring(idStartIndex));
            let selectedParent = this.props.search.accounts.find((account)=>{ return parentID === account.user.id});
            if(selectedParent){
                selectedParent = {
                    user: {
                        id: selectedParent.user.id,
                        email: selectedParent.user.email,
                        first_name: selectedParent.user.first_name,
                        last_name: selectedParent.user.last_name,
                        name: selectedParent.user.first_name + " " + selectedParent.user.last_name,
                    },
                    user_uuid: selectedParent.user.id,
                    gender: selectedParent.gender,
                    birth_date: selectedParent.birth_day,
                    student_list: selectedParent.student_list,
                    account_type: "PARENT",
                };

                this.props.registrationActions.setRegisteringParent(selectedParent);
                // Add students to redux once the registered parent has been set
                selectedParent.student_list.forEach((studentID)=>{
                    this.props.userActions.fetchStudents(studentID);
                });
                sessionStorage.setItem("CurrentParent", JSON.stringify(selectedParent));
            }
        }
        // close the dialogue
        this.props.onClose();
    };

    handleOnChange = ()=>(e) => {
        this.setState((oldState)=>{
            // update field with what's being typed by the user
            oldState.inputParent = e;
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
            this.props.registrationActions.closeRegistration("");
            this.handleClose();
        });

    }

    ActiveParentDialog = () =>{
        let allCoursesPerStudent =  this.props.registration.registered_courses ? Object.values(this.props.registration.registered_courses):[];
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
        if(this.props.search){
            return Object.values(this.props.search.accounts).map((parent)=>{
                return {
                    value: parent.user.first_name+ " " + parent.user.last_name + " - " + parent.user.id.toString(),
                    label: parent.user.first_name+ " " + parent.user.last_name,
                };
            });
        } else {
            return [];
        }

    };

    handleOnInputChange = () => (e) => {
        let input;
        if(e!==""){
            input = {
                value: e,
                label: e
            };
            this.setState({inputParent: input},()=>{
                if(e!==""){
                    const requestConfig = { params: { query: this.state.inputParent.label, page: 1, profile: "parent" },
                        headers: {"Authorization": `Token ${this.props.auth.token}`,} };
                    this.props.searchActions.fetchSearchAccountQuery(requestConfig);
                    this.setState({
                        parentOptions: this.renderParentSuggestionList()
                    },)
                }
            });
        }
    }

    SetParentDialog = () =>{
        return (
            <>
                <ReactSelect classNamePrefix={"select-parent-search"}
                             value = {this.state.inputParent}
                             options = {this.state.parentOptions}
                             onChange = {this.handleOnChange()}
                             onInputChange = {this.handleOnInputChange()}
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
                    this.props.registration.CurrentParent &&
                    this.props.registration.CurrentParent !== "none" ?
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
    "search": state.Search,
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
