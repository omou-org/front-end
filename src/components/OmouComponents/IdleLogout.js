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


function getModalPosition() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    Idle: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
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
        console.log("logging out...");
        closeRegistrationCart();
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);
    
    // Time(ms) before modal pops up
    const idleTimeout = 1080000; 

    // Time(ms) user has to click that they're still here before they're logged out
    const modalTimeout = 180000;

    const [remainingMsUntilPrompt, setRemainingMsUntilPrompt] = useState(idleTimeout);


    const classes = useStyles();
    const [modalPosition] = useState(getModalPosition);
    const [openModal, setOpenModal] = useState(false);
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

    const resetToken = () => {
        const token = localStorage.getItem("token");
        refreshToken({
            "variables" : {
                "token": token
            }
        })
    };
    
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

    useEffect(() => {
        (async () => {
            await refreshTokenAfter15Minutes();
        })();

    });
    
    const logoutAndCloseModal = () => {
        handleClose();
        handleLogout();
    };

    async function handleOpen() {
        setOpenModal(true);
        handleReset();
        setRemainingMsUntilPrompt(modalTimeout);

        sessionTimeoutRef.current = setTimeout(logoutAndCloseModal, 5 * 1000);
    }
    
    const handleClose = () => {
        clearInterval(sessionTimeoutRef.current);
        setOpenModal(false);
        resetToken();
    };

    const {
        reset,
        getRemainingTime,
    } = useIdleTimer({
        "timeout": idleTimeout
    });
    
    const handleReset = () => reset();
    
    useEffect(() => {
        setRemainingMsUntilPrompt(getRemainingTime());
        
        // Only tracks intervals every second (1000ms) in order to not block thread... change with caution
        setInterval(() => {
            setRemainingMsUntilPrompt(getRemainingTime());
        }, 1000);
    }, []);

    const ModalBody = () => {
        return (
            <div style={modalPosition} 
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