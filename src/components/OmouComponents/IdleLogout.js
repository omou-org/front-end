/*
    1. Refreshes the authentication token every 15 minutes while the user is loggeed in. This
        ensures a logged in user always has a (relatively) fresh token
    2. Logs a user out if idle for too long (20 mins), prompting them before finally logging them out (after 18 mins)
        To be clear, after 18 minutes of idleness (no activity), the user will get a prompt asking "Are you still there?"
        The user may click yes to stay logged in. If the user does not click the button after 2 minutes, they will be logged
        out
*/

import React, { useEffect, useState, useCallback, useRef } from "react";

import { useDispatch }  from "react-redux";
import { logout } from "actions/authActions";
import { closeRegistrationCart } from "components/OmouComponents/RegistrationUtils";
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {useIdleTimer} from 'react-idle-timer';
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import rootReducer from "../../reducers/rootReducer.js";
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {setToken} from "actions/authActions";

import gql from "graphql-tag";

import { useMutation} from "@apollo/react-hooks";


const useStyles = makeStyles((theme) => ({
    Idle: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    IdleFont: {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        textAlign: "center"

    },
    YesButton: {
        width: '80%',
        background: '#43b5d9',
        border: '1px solid #43b5d9',
        boxSizing: 'border-box',
        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.25)',
        borderRadius: '50px',
        padding: '8px 0 8px 0',
        color: 'white',
        marginTop: '20px',
        textAlign: 'center'
    }
}));

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk)),
);

const IdleLogout = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        closeRegistrationCart();
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);

    // Time(ms) before modal pops up
    const idleTimeout = 1080000;

    // Time(ms) user has to click that they're still here before they're logged out
    const modalTimeout = 180000;


    // State variable being updated by the react-idle-timer (which tracks how long it's been
    // since a user was active) When this variable reaches 0 the modal will display
    const [remainingMsUntilPrompt, setRemainingMsUntilPrompt] = useState(idleTimeout);


    const classes = useStyles();
    const [openModal, setOpenModal] = useState(false);

    // used as the modal timer.
    const sessionTimeoutRef = useRef(null);

    const TOKEN_REFRESH = gql`
        mutation refreshToken($token:String) {
            refreshToken(token:$token){
            token
            refreshExpiresIn
            }
        }
    `;

    const [refreshToken, newToken] = useMutation(TOKEN_REFRESH,
        {
            onCompleted: (data) => {
                (async () => {
                    store.dispatch(await setToken(data["refreshToken"]["token"], true));
                })();
            }
        });


    // Reset the token in the store with the new token (result from the query)
    const resetToken = () => {
        const token = localStorage.getItem("token");
        refreshToken({
            "variables" : {
                "token": token
            }
        })
    };

    // Ensures active users always have a 'fresh' token
    // (refreshed within the last 15 minutes)
    const refreshTokenAfter15Minutes = () => {
        return new Promise(resolve => {
            setInterval(() => {
                resolve(() => {
                    const token = localStorage.getItem("token");
                    refreshToken({
                        "variables": {
                            "token": token
                        }
                    });
                });
            }, 900000);
        });
    };


    const logoutAndCloseModal = () => {
        handleClose();
        handleLogout();
    };

    // Opens the modal, resets the modal timeout ref
    async function handleOpen() {
        setOpenModal(true);
        sessionTimeoutRef.current = setTimeout(logoutAndCloseModal, modalTimeout);
    }

    // handles all 'closing' functionality - ensuring the token and timers are reset
    // and the modal is hidden
    const handleClose = () => {
        clearInterval(sessionTimeoutRef.current);
        setOpenModal(false);
        resetToken();
    };

    const {
        getRemainingTime,
    } = useIdleTimer({
        "timeout": idleTimeout
    });

    // Sets the intervals for how often we update the state variable of the timer
    // as per the react-idle-timer docs it should be 1 second for general use.
    useEffect(() => {
        (async () => {
            await refreshTokenAfter15Minutes();
        })();
        // Only tracks intervals every second (1000ms) in order to not block thread... change with caution
        setInterval(() => {
            setRemainingMsUntilPrompt(getRemainingTime());
        }, 1000);
    }, []);

    const ModalBody = () => {
        return (
            <div
                className={classes.Idle}
                data-cy="activityCheckModal">
                <p id="simple-modal-description">
                    <Typography variant="h5" className={classes.IdleFont}>Are you still there?</Typography>
                    <div style={{"text-align": "center"}}>
                        <Button 
                            onClick={handleClose}
                            className={classes.YesButton}
                            data-cy="activityModalSubmit"
                        >Yes</Button>
                    </div>
                </p>
            </div>
        )};
    return (
        <div>
            { (remainingMsUntilPrompt === 0) && handleOpen() }
        
            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <ModalBody />
            </Modal>

        </div>
    )
}

export default IdleLogout;