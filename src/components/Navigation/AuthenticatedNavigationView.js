import React, { useCallback, useState, useEffect } from 'react';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import AuthenticatedNavBar from './AuthenticatedNavBar';
import { makeStyles } from '@material-ui/core/styles';
import { AuthenticatedComponent } from './NavigationContainer';
import MomentUtils from '@date-io/moment';
import { RootRoutes } from '../Routes/RootRoutes';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import gql from 'graphql-tag';
import OnboardingRoutes from '../Routes/OnboardingRoutes';
import IdleTimerPrompt from '../OmouComponents/IdleTimerPrompt';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    navigationIconStyle: {
        height: '50px',
    },
    navigationLeftList: {
        width: '23%',
    },
});

const CHECK_BUSINESS_EXISTS = gql`
    query CheckBusiness {
        __typename
        business {
            id
        }
    }
`;

export default function AuthenticatedNavigationView({ UserNavigationOptions }) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const { accountType, email } =
        useSelector(({ auth }) => auth) || [];
    // const { data, loading, error } = useQuery(CHECK_BUSINESS_EXISTS, {
    //     skip: accountType !== 'ADMIN',
    // });

    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);

    // if (loading) return <Loading />;
    // if (error) return <div>There's been an error! {error.message}</div>;

    const isBusinessDataValid = true;

    return (
        <AuthenticatedComponent>
            {isBusinessDataValid ? (
                <div className='Navigation'>
                    <AuthenticatedNavBar toggleDrawer={handleDrawerToggle} />
                    <nav className='OmouDrawer'>
                        <Hidden implementation='css' smUp>
                            <Drawer
                                classes={{ paper: classes.navigationLeftList }}
                                onClose={handleDrawerToggle}
                                open={mobileOpen}
                                variant='temporary'
                            >
                                {UserNavigationOptions}
                            </Drawer>
                        </Hidden>
                        <Hidden implementation='css' mdDown>
                            <Drawer open variant='permanent'>
                                {UserNavigationOptions}
                            </Drawer>
                        </Hidden>
                    </nav>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <main className='OmouMain'>
                            <RootRoutes />
                        </main>
                    </MuiPickersUtilsProvider>
                </div>
            ) : (
                <OnboardingRoutes />
            )}
            <IdleTimerPrompt />
        </AuthenticatedComponent>
    );
}
