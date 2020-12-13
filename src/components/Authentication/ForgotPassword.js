import React, {useCallback, useState} from "react";
import gql from "graphql-tag";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles";
import {useMutation} from "@apollo/react-hooks";
import {useSelector} from "react-redux";

import InputAdornment from "@material-ui/core/InputAdornment";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";

import {Link, Redirect, useHistory, useLocation} from "react-router-dom";

import Button from "@material-ui/core/Button";
import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import {ReactComponent as Ellipse1} from "./loginImages/ellipse1.svg";
import {ReactComponent as Ellipse2} from "./loginImages/ellipse2.svg";
import {ReactComponent as Picture1} from "./loginImages/picture1.svg";


const useStyles = makeStyles((theme) => ({
    "info": {
        "color": theme.colors.darkGray,
        "margin-top": "14px",
        "width": "75%",
        "margin": "auto",
    },
}));

const REQUEST_RESET = gql`
    mutation RequestReset($email: String!) {
        requestPasswordReset(email: $email) {
            status
        }
    }`;

const ForgotPassword = () => {
    const {state} = useLocation();
    const history = useHistory();
    const [email, setEmail] = useState(state?.email || "");
    const {token} = useSelector(({auth}) => auth);
    const [requested, setRequested] = useState(false);
    const [requestReset] = useMutation(REQUEST_RESET, {
        "ignoreResults": true,
    });

    const handleEmailInput = useCallback(({target}) => {
        setEmail(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        requestReset({"variables": {email}});
        setRequested(true);
    }, [email, requestReset]);

    const classes = {
        ...useAuthStyles(),
        ...useStyles(),
    };

    if (token) {
        if (history.length > 2) {
            history.goBack();
        } else {
            return <Redirect to="/" />;
        }
    }

    const SubmittedContent = (
        <ResponsiveButton 
            component={Link} 
            data-cy="return" 
            to={{
                "pathname": "/login",
                "state": {email},
            }} 
            variant="contained"
            >
            Back to login
        </ResponsiveButton>
    );

    const ResetForm = (
        <form onSubmit={handleSubmit}>
            <TextField
                InputProps={{
                    "startAdornment": (
                        <InputAdornment position="start">
                            <EmailOutlinedIcon style={{"color": "grey"}} />
                        </InputAdornment>
                    ),
                }} className="TextField"
                error={email === ""}
                fullWidth
                inputProps={{"data-cy": "emailField"}}
                label="E-Mail" margin="normal"
                onChange={handleEmailInput}
                value={email}
                variant="outlined" />
            <Grid className="buttonContainer" container item>
                <Grid item md={2} />
                <Grid item md={4} >
                    <ResponsiveButton 
                        data-cy="reset" 
                        type="submit"
                        variant="contained"
                    >
                        SEND RESET EMAIL
                    </ResponsiveButton>
                </Grid>
                <Grid item md={4}>
                    <ResponsiveButton 
                        component={Link} 
                        to={{
                        "pathname": "/login",
                        "state": {email},
                        }}
                        variant="outlined"
                    >
                        BACK TO LOGIN
                    </ResponsiveButton>
                </Grid>
                <Grid item md={2} />
            </Grid>
        </form>
    );

    return (
        <div>
            <Ellipse1 className="ellipse1" />
            <Ellipse2 className="ellipse2" />
            <Picture1 className="picture1" />
            <div className="logo">
                <Typography className="title">
                    omou
                </Typography>
            </div>
            <form className="Login">
                <Grid className="resetPassword" container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className="welcomeText">
                            {requested ? "Reset email sent!" : "Forgot your password?"}
                        </Typography>
                        <Typography align="left" className={classes.info}>
                            {requested ?
                                "Follow the instructions on the email to reset your password." :
                                "Enter the email for your account and we will send you an email link to reset your password:"}
                        </Typography>
                        {requested ? SubmittedContent : ResetForm}
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ForgotPassword;
