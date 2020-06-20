import React, {useCallback, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles({
    "root": {
        "width": "100%",
    },
});

const PasswordInput = ({label = "Password", ...props}) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = useCallback(() => {
        setShowPassword((show) => !show);
    }, []);

    const classes = useStyles();

    return (
        <FormControl className={classes.root}>
            <InputLabel htmlFor="password">{label}</InputLabel>
            <Input
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility"
                            onClick={toggleVisibility}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                id="password"
                type={showPassword ? "text" : "password"}
                {...props} />
        </FormControl>
    );
};

export default PasswordInput;
