import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { logout } from 'actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import NavLinkNoDup from '../Routes/NavLinkNoDup';
import Search from 'components/FeatureViews/Search/Search';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
// Local Component Imports
import Avatar from '@material-ui/core/Avatar';
import { stringToColor } from '../FeatureViews/Accounts/accountUtils';
import Tooltip from '@material-ui/core/Tooltip';
import { fullName } from '../../utils';
import { closeRegistrationCart } from '../OmouComponents/RegistrationUtils';

import { useGoogleLogin } from 'react-google-login';
import {onFailure} from './AuthenticatedNavigationView.js';

const AuthenticatedNavBar = ({ toggleDrawer }) => {
    const onSuccess = (response) => {
        console.log('onSuccess runs');
    };

    // const { signIn, loaded } = useGoogleLogin({
    //     buttonText:'Login',
    //     clientId:'1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com',
    //     isSignedIn:true,
    //     onSuccess:{onSuccess},
    //     onFailure:{onFailure},
    //     cookiePolicy:'single_host_origin',
    //     prompt:'consent',
    //     access_type:'offline',
    //     scope : 'https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters ',
    // })

    const dispatch = useDispatch();
    const history = useHistory();
    const authUser = useSelector(({ auth }) => auth);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobileSearching, setMobileSearching] = useState(false);


    const handleDrawerToggle = useCallback(() => {
        toggleDrawer(!mobileOpen);
        setMobileOpen((open) => !open);
    }, [mobileOpen, toggleDrawer]);

    const handleLogout = useCallback(() => {
        closeRegistrationCart();
        dispatch(logout());
        history.push('/login');
    }, [dispatch, history]);

    const handleMobileSearch = useCallback((searchQuery) => {
        setMobileSearching(searchQuery);
    }, []);

    const name = fullName(authUser.user);

    return (
        <AppBar className='OmouBar' position='sticky'>
            <Toolbar>
                {!isMobileSearching && (
                    <>
                        <Hidden lgUp>
                            <IconButton
                                aria-label='Open Drawer'
                                style={{ color: 'white' }}
                                onClick={handleDrawerToggle}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography
                            className='title'
                            component={NavLinkNoDup}
                            to='/'
                        >
                            omou
                        </Typography>
                        <div style={{ flex: 1 }} />
                    </>
                )}
                <Search onMobileType={handleMobileSearch} />
                <Tooltip title={`${name}'s Profile`}>
                    <Avatar
                        className='avatar'
                        alt={name}
                        style={{
                            backgroundColor: stringToColor(name),
                            fontSize: '.9em',
                            height: '40px',
                            width: '40px',
                            textDecoration: 'none',
                            border: '2px solid white',
                            marginRight: '2rem',
                        }}
                        component={NavLinkNoDup}
                        to={`/accounts/${authUser.accountType.toLowerCase()}/${
                            authUser.user.id
                        }`}
                    >
                        {name.match(/\b\w/gu).join('')}
                    </Avatar>
                </Tooltip>
                {name === 'NeLSoN' && (
                    <Typography
                        className='catsButton'
                        style={{ marginLeft: '-2rem' }}
                        component={NavLinkNoDup}
                        to='/cats'
                    >
                        CATS
                    </Typography>
                )}
                {!isMobileSearching && (
                    <LogoutIcon
                        className='logout-icon'
                        onClick={handleLogout}
                    />
                )}
            </Toolbar>
        </AppBar>
    );
};

AuthenticatedNavBar.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
};

export default AuthenticatedNavBar;
