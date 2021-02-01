import React, {useCallback, useState} from "react";
import gql from "graphql-tag";
import {makeStyles} from "@material-ui/core/styles";
import useAuthStyles from "./styles";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {useSelector} from "react-redux";
import {useSearchParams} from "actions/hooks";

import {Link, Redirect, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {PasswordInput} from "../Form/Field Components/Fields";
import Typography from "@material-ui/core/Typography";

import Loading from "components/OmouComponents/Loading";

import {ReactComponent as Ellipse1} from "./loginImages/ellipse1.svg";
import {ReactComponent as Ellipse2} from "./loginImages/ellipse2.svg";
import {ReactComponent as Picture1} from "./loginImages/picture1.svg";

const useStyles = makeStyles((theme) => ({
    "email": {},
    "info": {
        "color": theme.colors.black,
        "margin-bottom": "10px",
        "margin-top": "34px",
    },
    "requirements": {
        "color": theme.colors.darkGray,
        "margin-bottom": "30px",
        "margin-top": "20px",
    },
}));

const GET_EMAIL = gql`
    query GetEmail($token:String) {
        emailFromToken(token: $token)
    }`;

const RESET_PASSWORD = gql`
    mutation ResetPassword($password: String!, $token: String!, $isStudent: Boolean, $isInstructor: Boolean) {
        resetPassword(newPassword: $password, token: $token, setInstructor: $isInstructor, setStudent: $isStudent) {
            status
        }
    }`;

const ResetPassword = ({isSet}) => {
    const params = useSearchParams();
    const resetToken = params.get("token"); 
    const isStudent = Boolean(params.get("student"));
    const isInstructor = Boolean(params.get("instructor"));
    const history = useHistory();
    const [password, setPassword] = useState("");
    const emailStatus = useQuery(GET_EMAIL, {"variables": {"token": resetToken}});
    const email = emailStatus.data?.emailFromToken;
    const [resetPassword, resetStatus] = useMutation(RESET_PASSWORD);
    const {token} = useSelector(({auth}) => auth);

    const label = isSet ? "Set" : "Reset";

    const handlePasswordInput = useCallback(({target}) => {
        setPassword(target.value);
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        resetPassword({
            "variables": {
                isInstructor,
                isStudent,
                password,
                "token": resetToken,
            },
        });
    }, [password, resetPassword, resetToken, isStudent, isInstructor]);

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

    if (emailStatus.loading) {
        return <Loading />;
    }

    const success = resetStatus.data?.resetPassword.status === "success";
    const error = resetStatus.data?.resetPassword.status === "failed";

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
            <div className="Login">
                <Grid className="resetPassword" container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className="welcomeText">
                            {success ? `${label} successful!` : `${label} password`}
                        </Typography>
                        {emailStatus?.error ?
                            <Typography className={classes.info}>
                                Invalid token.
                            </Typography> :
                            <>
                                <Typography className={classes.info}>
                                    {success ?
                                        "You can now log in with your new password." :
                                        <>{label} password for <span className={email}>{email}</span></>}
                                </Typography>
                                {success ?
                                    <Button className={classes.primaryButton} color="primary"
                                        component={Link} data-cy="return" to={{
                                            "pathname": "/login",
                                            "state": {email},
                                        }} variant="contained">
                                        Back to login
                                    </Button> :
                                    <form onSubmit={handleSubmit}>
                                        <PasswordInput autoComplete="current-password"
                                            className="TextField"
                                            error={error}
                                            inputProps={{"data-cy": "passwordField"}}
                                            isField={false} label="Password"
                                            onChange={handlePasswordInput}
                                            value={password} />
                                        <Grid className="buttonContainer" container item>
                                            <Grid item md={2} />
                                            <Grid item md={4} >
                                                <Button className="createAccountButton" data-cy="reset" type="submit">
                                                    {label.toUpperCase()} PASSWORD
                                                </Button>
                                            </Grid>
                                            <Grid item md={4}>
                                                <Button className="signInButton" component={Link} to={{
                                                    "pathname": "/login",
                                                    "state": {email},
                                                }}>
                                                    BACK TO LOGIN
                                                </Button>
                                            </Grid>
                                            <Grid item md={2} />
                                        </Grid>
                                    </form>}
                            </>}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default ResetPassword;
