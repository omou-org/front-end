import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PropTypes from "prop-types";

import AsyncSelect from "react-select/async";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";

import {closeRegistration, setRegisteringParent,} from "actions/registrationActions";
import AccountsCards from "../Search/cards/AccountsCards";
import {fetchStudents} from "actions/userActions";
import {GET_ACCOUNT_SEARCH_QUERY_SUCCESS} from "actions/actionTypes";
import {instance} from "actions/apiActions";
import {isFail} from "actions/hooks";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";

const defaultMessage = () => "Keep searching for a parent!";

const SelectParentDialog = ({onClose, open}) => {
    const dispatch = useDispatch();
    const [parentID, setParentID] = useState(null);
    const [inputString, setInputString] = useState("");
    const [searching, setSearching] = useState(false);
    const parents = useSelector(({Users}) => Users.ParentList);
    const currentParent = useSelector(
        ({Registration}) => Registration.CurrentParent
    );
    const registeredCourses = useSelector(
        ({Registration}) => Registration.registered_courses
    );

    useEffect(() => {
        if (!currentParent) {
            dispatch(
                setRegisteringParent(
                    JSON.parse(sessionStorage.getItem("CurrentParent"))
                )
            );
        }
    }, [currentParent, dispatch]);

    const handleClose = useCallback(() => {
        // if there's something in the input
        if (parentID) {
            const parent = parents[parentID];
            if (parent) {
                const registeringParent = {
                    account_type: "PARENT",
                    balance: parent.balance,
                    birth_date: parent.birthday,
                    gender: parent.gender,
                    student_list: parent.student_ids,
                    user: {
                        email: parent.email,
                        first_name: parent.first_name,
                        id: parent.user_id,
                        last_name: parent.last_name,
                        name: parent.name,
                    },
                    user_uuid: parent.user_id,
                };

                dispatch(setRegisteringParent(registeringParent));
                // Add students to redux once the registered parent has been set
                registeringParent.student_list.forEach((studentID) => {
                    fetchStudents(studentID)(dispatch);
                });
                sessionStorage.setItem(
                    "CurrentParent",
                    JSON.stringify(registeringParent)
                );
            }
        }
        // close the dialogue
        onClose();
    }, [parentID, parents, dispatch, onClose]);

    const handleOnChange = useCallback((event) => {
        setParentID(event.value);
        setInputString(event);
        setSearching(false);
    }, []);

    const handleExitParent = useCallback(
        (event) => {
            event.preventDefault();
            setParentID(null);
            dispatch(setRegisteringParent(null));
            dispatch(closeRegistration());
            handleClose();
        },
        [dispatch, handleClose]
    );

    const handleOnInputChange = useCallback((input) => {
        if (input) {
            setSearching(true);
            setInputString(input);
        }
    }, []);

    const loadOptions = useCallback(
        async (input) => {
            const response = await instance.get("/search/account/", {
                params: {
                    page: 1,
                    profile: "parent",
                    query: input,
                },
            });
            if (isFail(response.status)) {
                return [];
            }
            dispatch({
                payload: {
                    noChangeSearch: true,
                    response,
                },
                type: GET_ACCOUNT_SEARCH_QUERY_SUCCESS,
            });
            return response.data.results.map(
                ({user: {id, first_name, last_name}}) => ({
                    label: `${first_name} ${last_name}`,
                    value: id,
                })
            );
        },
        [dispatch]
    );

    const numToCheckout = Object.values(registeredCourses || {}).reduce(
        (count, studentCourses) => count + studentCourses.length,
        0
    );

    return (
        <Dialog
            aria-labelledby="simple-dialog-title"
            className="select-parent-dialog"
            onClose={handleClose}
            open={open}
        >
            <DialogTitle id="simple-dialog-title">Currently helping...</DialogTitle>
            <DialogContent>
                {currentParent ? (
                    <div className="active-parent-dialog-content">
                        <Grid container direction="row" justify="center">
                            <Grid item>
                                <AccountsCards user={currentParent}/>
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <div
                        className={`select-parent-search-wrapper ${searching && "active"}`}
                    >
                        <AsyncSelect
                            classNamePrefix="select-parent-search"
                            loadOptions={loadOptions}
                            noOptionsMessage={defaultMessage}
                            onChange={handleOnChange}
                            onInputChange={handleOnInputChange}
                            value={inputString}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {currentParent ? (
                    <>
                        <Button data-cy="exit-parent-btn" onClick={handleExitParent}>Exit Parent</Button>
                        <span>
              <Button
                  component={NavLinkNoDup}
                  disabled={numToCheckout === 0}
                  to="/registration/cart"
              >
                Checkout {numToCheckout} Courses
              </Button>
            </span>
                    </>
                ) : (
                    <Button data-cy="set-parent-btn" onClick={handleClose}>Set Parent</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

SelectParentDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default SelectParentDialog;
