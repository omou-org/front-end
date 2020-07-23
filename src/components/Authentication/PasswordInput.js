import React, { useCallback, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import TextField from "@material-ui/core/TextField";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import "./LoginPage.scss";

const PasswordInput = ({ label = "Password", ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState(null);

    const toggleVisibility = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);



    const handleTextInput = useCallback((setter) => ({ target }) => {
        setter(target.value);
    }, []);

    return (<TextField
        htmlFor="password"
        className="TextField"
        value={password}
        variant="outlined"
        fullWidth={"true"}
        id="password"
        type={showPassword ? "text" : "password"}
        onChange={handleTextInput(setPassword)}
        placeholder={showPassword ? "text" : "Password"}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility"
                        onClick={toggleVisibility}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            ),
            startAdornment: (
                <InputAdornment position="start">
                    <VpnKeyOutlinedIcon style={{ color: "grey" }} />
                </InputAdornment>
            ),
        }} 
        {...props}/>
    );
};

export default PasswordInput;
