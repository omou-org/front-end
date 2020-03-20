import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";

import AsyncSelect from "react-select/async";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import * as registrationActions from "actions/registrationActions";
import * as userActions from "actions/userActions";
import AccountsCards from "../Search/cards/AccountsCards";
import {GET_ACCOUNT_SEARCH_QUERY_SUCCESS} from "actions/actionTypes";
import {instance} from "actions/apiActions";
import {isFail} from "actions/hooks";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";

const defaultMessage = () => "Keep searching for a parent!";

const SelectParentDialog = ({onClose, open}) => {
    const dispatch = useDispatch();
    const actions = useMemo(
        () => ({
            ...bindActionCreators(registrationActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
        }),
        [dispatch]
    );
    const [parentID, setParentID] = useState(null);
    const [inputString, setInputString] = useState("");
    const [searching, setSearching] = useState(false);
    const parents = useSelector(({Users}) => Users.ParentList);
    const currentParent = useSelector(({Registration}) => Registration.CurrentParent);
    const registeredCourses = useSelector(({Registration}) => Registration.registered_courses);

    useEffect(() => {
        let pastParent = sessionStorage.getItem("CurrentParent");
        const reduxPastParent = currentParent;
        if (pastParent !== "none" && !reduxPastParent) {
            pastParent = JSON.parse(pastParent);
            actions.setRegisteringParent(pastParent);
        }
    }, [currentParent, actions]);

    const handleClose = useCallback(() => {
        // if there's something in the input
        if (parentID) {
            const parent = parents[parentID];
            if (parent) {
                const registeringParent = {
                    "account_type": "PARENT",
                    "balance": parent.balance,
                    "birth_date": parent.birthday,
                    "gender": parent.gender,
                    "student_list": parent.student_ids,
                    "user": {
                        "email": parent.email,
                        "first_name": parent.first_name,
                        "id": parent.user_id,
                        "last_name": parent.last_name,
                        "name": parent.name,
                    },
                    "user_uuid": parent.user_id,
                };

                actions.setRegisteringParent(registeringParent);
                // Add students to redux once the registered parent has been set
                registeringParent.student_list.forEach((studentID) => {
                    actions.fetchStudents(studentID);
                });
                sessionStorage.setItem("CurrentParent", JSON.stringify(registeringParent));
            }
        }
        // close the dialogue
        onClose();
    }, [parentID, parents, actions, onClose]);

    const handleOnChange = useCallback((event) => {
        setParentID(event.value);
        setInputString(event);
        setSearching(false);
    }, []);

    const handleExitParent = useCallback((event) => {
        event.preventDefault();
        setParentID(null);
        actions.setRegisteringParent("");
        actions.closeRegistration("");
        handleClose();
    }, [actions, handleClose]);

    const handleOnInputChange = useCallback((input) => {
        setSearching(true);
        if (input) {
            setInputString(input);
        }
    }, []);

    const loadOptions = useCallback(async (input) => {
        const response = await instance.get("/search/account/", {
            "params": {
                "page": 1,
                "profile": "parent",
                "query": input,
            },
        });
        if (isFail(response.status)) {
            return [];
        }
        dispatch({
            "payload": {
                "noChangeSearch": true,
                response,
            },
            "type": GET_ACCOUNT_SEARCH_QUERY_SUCCESS,
        });
        return response.data.results
            .map(({"user": {id, first_name, last_name}}) => ({
                "label": `${first_name} ${last_name}`,
                "value": id,
            }));
    }, [dispatch]);

    const numToCheckout = Object.values(registeredCourses || {})
        .reduce((count, studentCourses) => count + studentCourses.length, 0);

    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            className="select-parent-dialog"
            onClose={handleClose}
            open={open}>
            <DialogTitle id="simple-dialog-title">
                <h3>Currently helping...</h3>
            </DialogTitle>
            <DialogContent>
                {
                    currentParent && currentParent !== "none"
                        ? <div className="active-parent-dialog-content">
                            <Grid
                                container
                                direction="row"
                                justify="center">
                                <Grid item>
                                    <AccountsCards user={currentParent} />
                                </Grid>
                            </Grid>
                        </div>
                        : <div className={`select-parent-search-wrapper ${searching && "active"}`}>
                            <AsyncSelect
                                classNamePrefix="select-parent-search"
                                loadOptions={loadOptions}
                                noOptionsMessage={defaultMessage}
                                onChange={handleOnChange}
                                onInputChange={handleOnInputChange}
                                value={inputString} />
                          </div>

                }
            </DialogContent>
            <DialogActions>
                {
                    currentParent && currentParent !== "none"
                        ? <>
                            <Button onClick={handleExitParent}>
                                    Exit Parent
                            </Button>
                            <span>
                                <Button
                                    component={NavLinkNoDup}
                                    disabled={numToCheckout === 0}
                                    to="/registration/cart">
                                        Checkout {numToCheckout} Courses
                                </Button>
                            </span>
                          </>
                        : <Button onClick={handleClose}>
                                Set Parent
                          </Button>
                }
            </DialogActions>
        </Dialog>
    );
};

SelectParentDialog.propTypes = {
    "onClose": PropTypes.func.isRequired,
    "open": PropTypes.bool.isRequired,
};

export default SelectParentDialog;
