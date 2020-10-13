import React, { useEffect, useState, useMemo, useCallback } from "react";

import { useDispatch }  from "react-redux";
import { logout } from "actions/authActions";
import { closeRegistrationCart } from "components/OmouComponents/RegistrationUtils";
import Navigation from "../Navigation/Navigation";
import { Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {useIdleTimer} from 'react-idle-timer';
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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

const IdleLogout = () => {

    const history = useHistory();
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        console.log("logging out...")
        closeRegistrationCart();
        dispatch(logout());
        history.push("/login");
    }, [dispatch, history]);

    let timeout = 1080000;
    const modalTimeout = 300000;
    const [remaining, setRemaining] = useState(timeout);


    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

   
    function logoutAfter2Minutes() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(logoutAndCloseModal());
            }, modalTimeout);
        });
    }
    
    const logoutAndCloseModal = () => {
        handleClose();
        handleLogout();
    };

    async function handleOpen() {
        setOpen(true);
        handleReset();
        setRemaining(modalTimeout);
        await logoutAfter2Minutes();
    }
    
    const handleClose = () => setOpen(false);

    const {
        reset,
        getRemainingTime,
    } = useIdleTimer({
        timeout
    });
    
    const handleReset = () => reset();

    useEffect(() => {
        setRemaining(getRemainingTime());
    
        setInterval(() => {
            setRemaining(getRemainingTime());
        }, 1000);
    }, []);

    const body = () => {
        return (
            <div style={modalStyle} 
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
            { (remaining === 0) && handleOpen() }
        
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