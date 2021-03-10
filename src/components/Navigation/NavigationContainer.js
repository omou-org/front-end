import React from 'react';
import { useSelector } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import NavLinkNoDup from '../Routes/NavLinkNoDup';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import './Navigation.scss';
import OmouTheme from '../../theme/muiTheme';
import { NavList } from './NavigationAccessList';
import Loading from '../OmouComponents/Loading';
import AuthenticatedNavigationView from './AuthenticatedNavigationView';
import LoginPage from '../Authentication/LoginPage';

const useStyles = makeStyles({
    navigationIconStyle: {
        height: '50px',
    },
    navigationLeftList: {
        width: '23%',
    },
});

export const AuthenticatedComponent = ({ children }) => {
    // AUTH selector
    const { token } = useSelector(({ auth }) => auth);
    if (token) {
        return children;
    } else {
        return <div />;
    }
};

const NavigationContainer = () => {
    const classes = useStyles();
    // AUTH selector
    const { token } = useSelector(({ auth }) => auth);

    const ACCOUNT_TYPE = useSelector(({ auth }) => auth.accountType);
    const NavigationList = NavList[ACCOUNT_TYPE];

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

    if ((!NavigationList || !ACCOUNT_TYPE) && token) {
        return <Loading />;
    }

    const UserNavigationOptions = (
        <div className='DrawerList'>
            <List className='list'>
                {NavigationList &&
                    NavigationList.map((NavItem) => (
                        <ListItem
                            button
                            className={`listItem ${classes.navigationIconStyle}`}
                            component={NavLinkNoDup}
                            isActive={(match, location) => {
                                return (
                                    match?.url ||
                                    isAccountFormActive(location, NavItem) ||
                                    isCourseFormActive(location, NavItem) ||
                                    (NavItem.name === 'Dashboard' &&
                                        location.pathname === '/')
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
