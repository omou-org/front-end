import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import ReactSelect from 'react-select';
import AccountsCards from "../Search/cards/AccountsCards";
import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
import { connect } from "react-redux";
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
    student_list: [1, 2],
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
            "inputParent": { value: "", label: "" },
            "parentOptions": [],
        };
    }

    componentDidMount(){
        let pastParent = sessionStorage.getItem("CurrentParent");
        if (pastParent !== "none") {
            pastParent = JSON.parse(pastParent);
            this.props.registrationActions.setRegisteringParent(pastParent);
        }
    }

    handleClose = () => {
        // if there's something in the input
        if (this.state.inputParent.value !== "") {
            let idStartIndex = this.state.inputParent.value.indexOf("-") + 1;
            let parentID = Number(this.state.inputParent.value.substring(idStartIndex));
            let selectedParent = this.props.search.accounts.find((account)=>{ return parentID === account.user.id});
            console.log(selectedParent);
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
            selectedParent.student_list.forEach((studentID) => {
                this.props.userActions.fetchStudents(studentID);
            });
            sessionStorage.setItem("CurrentParent", JSON.stringify(selectedParent));
        }
        // close the dialogue
        this.props.onClose();
    };

    handleOnChange = () => (e) => {
        this.setState((oldState) => {
            // update field with what's being typed by the user
            oldState.inputParent = e;
            return oldState;
        });
    }

    handleExitParent = () => (e) => {
        e.preventDefault();

        this.setState((oldState) => {
            oldState.inputParent = { value: "", label: "" };
            this.props.registrationActions.setRegisteringParent("");
            return oldState
        }, ()=>{
            this.props.registrationActions.closeRegistration("");
            this.handleClose();
        });

    }

    ActiveParentDialog = () => {
        let allCoursesPerStudent = this.props.registration.registered_courses ? Object.values(this.props.registration.registered_courses) : [];
        let allCourses = 0;
        allCoursesPerStudent.forEach((studentCourses) => {
            allCourses += studentCourses.length;
        });

        return (
            <div className={"active-parent-dialog-content"}>
                        <div className="cardsPadding">
                        <AccountsCards user={this.props.registration.CurrentParent} />
                        </div>
                    {/*<h3>{this.props.registration.CurrentParent.user.name}</h3>*/}
                    <div className="buttons">
                    <div className="buttonLeft">
                        <Button color={"primary"} className={"button"}
                            onClick={this.handleExitParent()}>
                            Exit Parent
                        </Button>
                        </div>
                        <div className="buttonRight">
                        <Button component={NavLinkNoDup} to={"/registration/cart"}
                            color={"primary"} className={"button"}>Checkout {allCourses} Courses</Button>
                            </div>
                            </div>
            </div>
        )
    }

    handleSetParentButton = () => (e) => {
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

    SetParentDialog = () => {
        return (
            <>
                <ReactSelect classNamePrefix={"select-parent-search"}
                             value = {this.state.inputParent}
                             options = {this.state.parentOptions}
                             onChange = {this.handleOnChange()}
                             onInputChange = {this.handleOnInputChange()}
                             classname = "seect"
                             placeholder = "Select Existing Parent"
                />
                <div className="selectButton">
                <Button onClick={this.handleSetParentButton()}>Set Parent</Button>
                </div>
            </>
        )
    }



    render() {
        return (
            <Dialog
                className={"select-parent-dialog"}
                autoDetectWindowHeight={false}
                autoScrollBodyContent={false}
                onClose={this.handleClose}
                open={this.props.open}>
                <DialogTitle className="DialogTitle">
                    Currently helping...
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