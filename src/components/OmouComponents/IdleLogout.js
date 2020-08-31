import React, { useEffect, useState, useMemo, useCallback } from "react";

import { useDispatch }  from "react-redux";
import { logout } from "actions/authActions";
import { closeRegistrationCart } from "components/OmouComponents/RegistrationUtils";
import Navigation from "../Navigation/Navigation";
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {useIdleTimer} from 'react-idle-timer';
import { useHistory } from "react-router-dom";

function rand() {
    return Math.round(Math.random() * 20) - 10;
}


function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
	  top: `${top}%`,
	  left: `${left}%`,
	  transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const IdleLogout = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        console.log("logging out...")
        closeRegistrationCart();
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);

    let timeout = 10000; //1080000;
    const modalTimeout = 5000 //120000;
    const [remaining, setRemaining] = useState(timeout);
    const [elapsed, setElapsed] = useState(0);
    const elapseDiff = 5000;

    const [lastActive, setLastActive] = useState(+new Date());
    const [isIdle, setIsIdle] = useState(false);

    const handleOnActive = () => setIsIdle(false);
    const handleOnIdle = () => setIsIdle(true);

    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

   
    function logoutAfter2Minutes() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(logoutAndCloseModal());
            }, 5000);
        })
    };
    
    const logoutAndCloseModal = () => {
        handleClose();
        handleLogout();
    }

    async function handleOpen() {
        setOpen(true);
        handleReset();
        setRemaining(modalTimeout);
        await logoutAfter2Minutes();

    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const {
        reset,
        pause,
        resume,
        getRemainingTime,
        getLastActiveTime,
        getElapsedTime
    } = useIdleTimer({
        timeout,
        onActive: handleOnActive,
        onIdle: handleOnIdle
    });
    
    const handleReset = () => reset();
    const handlePause = () => pause();
    const handleResume = () => resume();

    useEffect(() => {
        setRemaining(getRemainingTime())
        setLastActive(getLastActiveTime())
        setElapsed(getElapsedTime())
    
        setInterval(() => {
            setRemaining(getRemainingTime())
            setLastActive(getLastActiveTime())
            setElapsed(getElapsedTime())
        }, 1000);
    }, []);
    const body = () => {
        return (
            <div style={modalStyle} className={classes.paper}>
                <p id="simple-modal-description">
                    {/* {
                (remaining < 100) && handleClose()
                // remaining <= 5000 ? handleLogout() : doNothing()
            } */}
            Are you still there?
                    <button onClick={handleClose}>Yes</button>
                </p>
            </div>
        )};
    return (
        <div>
            {
                (remaining === 0) && handleOpen()
                // remaining === 0 ? handleOpen() : doNothing()
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body()}
            </Modal>

        </div>
    )
}

export default IdleLogout;