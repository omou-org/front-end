import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PasswordInput from './../PasswordInput';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';

import { ReactComponent as Ellipse1 } from './../loginImages/ellipse1.svg';
import { ReactComponent as Ellipse2 } from './../loginImages/ellipse2.svg';
import { ReactComponent as Picture1 } from './../loginImages/picture1.svg';
import { ReactComponent as Ellipse3 } from './../loginImages/ellipse3.svg';
import { ReactComponent as Ellipse4 } from './../loginImages/ellipse4.svg';
import { ReactComponent as Picture2 } from './../loginImages/picture2.svg';
import { ReactComponent as Picture3 } from './../loginImages/picture3.svg';
import { ReactComponent as Picture4 } from './../loginImages/picture4.svg';
import './../LoginPage.scss';

const ParentLogin = (props) => {
    const handleTextInput = (event) => {
        props.handleTextInput(event);
    };

    const toggleSavePassword = (event) => {
        props.toggleSavePassword(event);
    };

    return (
        <div>
            <Ellipse3 className='ellipse var3' />
            <Ellipse4 className='ellipse var4' />
            <Picture2 className='picture1' />
            <div className='logo'>
                <Typography className='title var2'>omou</Typography>
            </div>
            <form className='Login' onSubmit={props.handleLogin}>
                <Grid container>
                    <Grid item md={6} />
                    <Grid item md={6}>
                        <Typography className='welcomeText'>
                            Hello Summit Parent
                        </Typography>
                        <TextField
                            error={props.hasError || props.email === ''}
                            fullWidth
                            inputProps={{ 'data-cy': 'emailField' }}
                            margin='normal'
                            onChange={handleTextInput(props.setEmail)}
                            value={props.email}
                            placeholder='E-Mail'
                            variant='outlined'
                            className='TextField'
                            fullWidth='true'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <EmailOutlinedIcon
                                            style={{ color: 'grey' }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <PasswordInput
                            autoComplete='current-password'
                            error={props.hasError || props.password === ''}
                            className='TextField'
                            inputProps={{ 'data-cy': 'passwordField' }}
                            label='Password'
                            onChange={handleTextInput()}
                            value={props.password}
                        />
                        <Grid container item className='optionsContainer'>
                            <Grid item md={2} />
                            <Grid item md={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={props.shouldSave}
                                            inputProps={{
                                                'data-cy': 'rememberMe',
                                            }}
                                            onChange={toggleSavePassword}
                                        />
                                    }
                                    label='Remember Me'
                                />
                            </Grid>
                            <Grid item md={4} style={{ paddingTop: 10 }}>
                                <Link
                                    className='forgotPassword'
                                    data-cy='forgotPassword'
                                    to={{
                                        pathname: '/forgotpassword',
                                        state: props.email,
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Grid>
                            <Grid item md={2} />
                            <Grid item md={4} />
                            <Grid item md={4} className='buttonSpacing'>
                                <Button
                                    className='signInButton'
                                    data-cy='signInButton'
                                    type='submit'
                                    variant='contained'
                                >
                                    SIGN IN
                                </Button>
                            </Grid>
                            <Grid item md={4} />
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default ParentLogin;
