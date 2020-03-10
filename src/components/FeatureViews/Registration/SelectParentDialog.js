import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import ReactSelect from 'react-select';
import AccountsCards from "../Search/cards/AccountsCards";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as searchActions from "../../../actions/searchActions";
import * as userActions from "../../../actions/userActions";
import {connect} from "react-redux";
import Grid from "@material-ui/core/Grid";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import {DialogActions, DialogContent} from "@material-ui/core";

class SelectParentDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "inputParent": { value: "", label: "" },
            "parentOptions": [],
            "searchingParent": false,
        };
    }

    componentDidMount() {
        let pastParent = sessionStorage.getItem("CurrentParent");
        let reduxPastParent = this.props.registration.CurrentParent;
        if (pastParent !== "none" && !reduxPastParent) {
            pastParent = JSON.parse(pastParent);
            this.props.registrationActions.setRegisteringParent(pastParent);
        }
    }

    handleClose = () => {
        // if there's something in the input
        if (this.state.inputParent.value !== "") {
            let idStartIndex = this.state.inputParent.value.indexOf("-") + 1;
            let parentID = Number(this.state.inputParent.value.substring(idStartIndex));
            let selectedParent = this.state.parentList.find((account) => parentID == account.user.id);

            if (selectedParent) {
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
                    balance: selectedParent.balance,
                };

                this.props.registrationActions.setRegisteringParent(selectedParent);
                // Add students to redux once the registered parent has been set
                selectedParent.student_list.forEach((studentID) => {
                    this.props.userActions.fetchStudents(studentID);
                });
                sessionStorage.setItem("CurrentParent", JSON.stringify(selectedParent));
            }
        }
        // close the dialogue
        this.props.onClose();
    };

    handleOnChange = () => (e) => {
        this.setState((oldState) => {
            // update field with what's being typed by the user
            oldState.inputParent = e;
            oldState.searchingParent = false;
            return oldState;
        });
    };

    handleExitParent = () => (e) => {
        e.preventDefault();

        this.setState((oldState) => {
            oldState.inputParent = { value: "", label: "" };
            this.props.registrationActions.setRegisteringParent("");
            return oldState;
        }, () => {
            this.props.registrationActions.closeRegistration("");
            this.handleClose();
        });

    };

    ActiveParentDialog = () => {
        return (
            <div className={"active-parent-dialog-content"}>
                <Grid
                    container
                    direction="row"
                    justify="center"
                >
                    <Grid item>
                        <AccountsCards user={this.props.registration.CurrentParent} />
                    </Grid>
                </Grid>
            </div>
        )
    };

    handleSetParentButton = (e) => {
        e.preventDefault();
        this.handleClose();
    };

    renderParentSuggestionList = () => {
        if (this.props.search) {
            this.setState({
                parentList: this.props.search.accounts,
            });
            return Object.values(this.props.search.accounts).map((parent) => {
                return {
                    value: parent.user.first_name + " " + parent.user.last_name + " - " + parent.user.id.toString(),
                    label: parent.user.first_name + " " + parent.user.last_name,
                };
            });
        } else {
            return [];
        }

    };

    handleOnInputChange = () => (e) => {
        let input;
        if (e !== "") {
            input = {
                value: e,
                label: e
            };
            this.setState({ inputParent: input, searchingParent: true, },
                () => {
                    if (e !== "") {
                        const requestConfig = { params: { query: this.state.inputParent.label, page: 1, profile: "parent" }, };
                        this.props.searchActions.fetchSearchAccountQuery(requestConfig);
                        this.setState({
                            searchingParent: true,
                            parentOptions: this.renderParentSuggestionList()
                        });
                    }
                });
        }
    };

    SetParentDialog = () => {
        return (
            <div
                className={`select-parent-search-wrapper ${this.state.searchingParent ? "active" : ""}`}>
                <ReactSelect
                    noOptionsMessage={() => "Keep searching for a parent!"}
                    classNamePrefix={"select-parent-search"}
                    value={this.state.inputParent}
                    options={this.state.parentOptions}
                    onChange={this.handleOnChange()}
                    onInputChange={this.handleOnInputChange()}
                />
            </div>
        )
    };



    render() {
        let allCoursesPerStudent = this.props.registration.registered_courses ? Object.values(this.props.registration.registered_courses) : [];
        let allCourses = 0;
        allCoursesPerStudent.forEach((studentCourses) => {
            allCourses += studentCourses.length;
        });
        return (
            <Dialog className={"select-parent-dialog"}
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title" open={this.props.open}>
                <DialogTitle id="simple-dialog-title">
                    <h3>Currently helping...</h3>
                </DialogTitle>
                <DialogContent>
                    {
                        this.props.registration.CurrentParent &&
                            this.props.registration.CurrentParent !== "none" ?
                            this.ActiveParentDialog() :
                            this.SetParentDialog()
                    }
                </DialogContent>
                <DialogActions>
                    {
                        this.props.registration.CurrentParent &&
                            this.props.registration.CurrentParent !== "none" ?
                            <>
                                <Button onClick={this.handleExitParent()}>
                                    Exit Parent
                                </Button>
                                <span>
                                    <Button
                                        component={NavLinkNoDup}
                                        to={"/registration/cart"}
                                        disabled={allCourses === 0}
                                    >
                                        Checkout {allCourses} Courses
                                    </Button>
                                </span>
                            </> :
                            <Button
                                onClick={this.handleSetParentButton}>
                                Set Parent
                            </Button>
                    }
                </DialogActions>
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
