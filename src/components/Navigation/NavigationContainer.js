import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NavLinkNoDup from '../Routes/NavLinkNoDup';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import './Navigation.scss';
import OmouTheme from '../../theme/muiTheme';
import {NavList} from './NavigationAccessList';
import Loading from '../OmouComponents/Loading';
import AuthenticatedNavigationView from './AuthenticatedNavigationView';
import LoginPage from '../Authentication/LoginPage';
import {setToken} from '../../actions/authActions';

const { useEffect } = require('react');

const useStyles = makeStyles({
    navigationIconStyle: {
        height: '50px',
    },
    navigationLeftList: {
        width: '23%',
    },
});

export const AuthenticatedComponent = ({ children }) => {
    const { token } = useSelector(({ auth }) => auth);
    if (token) {
        return children;
    } else {
        return <div />;
    }
};

const NavigationContainer = () => {
    const dispatch = useDispatch();
    const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
        (async () => {
            dispatch(await setToken(token));
        })();
    }

    const classes = useStyles();

    const ACCOUNT_TYPE = useSelector(({auth}) => auth.accountType);
    const NavigationList = NavList[ACCOUNT_TYPE];

    if ((!NavigationList || !ACCOUNT_TYPE) && token) {
        return <Loading/>;
    }

    const isAccountFormActive = (location, NavItem) => {
        let active = false;
        if (location) {
            ['student', 'admin', 'instructor', 'parent'].forEach(
                (accountType) => {
                    if (
                        location.pathname.includes(accountType) &&
                        !location.pathname.includes('adminportal') &&
                        NavItem.name === 'Accounts'
                    ) {
                        active = true;
                    }
                }
            );
        }
        return active;
    };

    const isCourseFormActive = (location, NavItem) => {
        let active = false;
        if (location) {
            if (
                location.pathname.includes('course_details') &&
                NavItem.name === 'Courses'
            ) {
                active = true;
            }
        }
        return active;
    };

    const isAccountLandingView = (accountType, NavItemName, location) => {
        const isDashboardLanding =
            NavItemName === 'Dashboard' && location.pathname === '/';
        const isSchedulerLanding =
            NavItemName === 'Schedule' && location.pathname === '/';
        const isInstructorOrParentLanding =
            (accountType === 'INSTRUCTOR' || accountType === 'PARENT') &&
            isSchedulerLanding;
        const isReceptionistOrAdminLanding =
            (accountType === 'RECEPTIONIST' || accountType === 'ADMIN') &&
            isDashboardLanding;
        return isReceptionistOrAdminLanding || isInstructorOrParentLanding;
    };

    if ((!NavigationList || !ACCOUNT_TYPE) && token) {
        return <Loading />;
    }

    const UserNavigationOptions = (
        <div className='DrawerList'>
            <List className='list'>
                {NavigationList &&
                    NavigationList.map((NavItem) => (
                        <ListItem
                            className={`listItem ${classes.navigationIconStyle}`}
                            component={NavLinkNoDup}
                            isActive={(match, location) => {
                                return (
                                    match?.url ||
                                    isAccountFormActive(location, NavItem) ||
                                    isCourseFormActive(location, NavItem) ||
                                    isAccountLandingView(
                                        ACCOUNT_TYPE,
                                        NavItem.name,
                                        location
                                    )
                                );
                            }}
                            key={NavItem.name}
                            to={NavItem.link}
                        >
                            <ListItemIcon className='icon'>
                                {NavItem.icon}
                            </ListItemIcon>
                            <ListItemText
                                className='text'
                                primary={NavItem.name}
                            />
                        </ListItem>
                    ))}
            </List>
        </div>
    );

    return (
        <ThemeProvider theme={OmouTheme}>
            {token ? (
                <AuthenticatedNavigationView
                    UserNavigationOptions={UserNavigationOptions}
                />
            ) : (
                <LoginPage />
            )}
        </ThemeProvider>
    );
};

export default NavigationContainer;
