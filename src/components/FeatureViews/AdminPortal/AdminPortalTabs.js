/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';
import TuitionRule from './TutitionRules';
import EditTuitionRule from './EditTuitionRules';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useHistory,
    useRouteMatch,
} from 'react-router-dom';
import AdminViewsRoutes from 'components/Routes/AdminViewsRoutes';
const useStyles = makeStyles({
    adminPortalTabsStyle: {
        marginTop: '2rem',
    },
});

const AdminPortalTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const history = useHistory();

    const { path, url } = useRouteMatch();

    const handleTabChange = (event, currentTabIndex) => {
        setTabIndex(currentTabIndex);
    };
    let { pathname } = useLocation();

    useEffect(() => {
        let path = window.location.pathname;

        if (path === `${pathname}` && tabIndex === 0) setTabIndex(0);
        else if (path === `${pathname}/topics` && tabIndex === 1)
            setTabIndex(1);
        else if (path === `${pathname}/tuition-rules` && tabIndex === 2)
            setTabIndex(2);
    }, [tabIndex]);

    const classes = useStyles();

    const adminPortalTabs = [
        { label: 'overview', route: 'overview' },
        { label: 'course tags', route: 'topics' },
        { label: 'tuition rules', route: 'tuition-rules' },
        { label: 'access control', route: 'access-control' },
        { label: 'admin log', route: 'admin-log' },
        { label: 'business details', route: 'business-details' },
    ];

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    // const tabContent = {
    //     0: { content: 'overview content' },
    //     1: { content: 'course tags content' },
    //     2: { content: <TuitionRule /> },
    //     3: { content: 'access control content' },
    //     4: { content: 'admin log content' },
    //     5: { content: <BusinessDetails /> },
    // };

    return (
        <>
            <Router>
                <Tabs
                    className={classes.adminPortalTabsStyle}
                    value={tabIndex}
                    indicatorColor='primary'
                    onChange={handleTabChange}
                >
                    {adminPortalTabs.map((currentTab, i) => (
                        <Tab
                            key={i}
                            label={currentTab.label}
                            component={Link}
                            to={`${pathname}/${currentTab.route}`}
                        />
                    ))}
                </Tabs>

                <Switch>
                    <Route exact path={`${pathname}/overview`}>
                        <div>
                            <h1>Overview</h1>
                        </div>
                    </Route>
                    <Route
                        exact
                        path={`${pathname}/tuition-rules`}
                        component={TuitionRule}
                    />

                    <Route exact path={`${pathname}/tuition-rules/:id`}>
                        <EditTuitionRule />
                    </Route>
                    <Route
                        path={`${pathname}/business-details`}
                        component={BusinessDetails}
                    />
                </Switch>
            </Router>
        </>
    );
};

export default AdminPortalTabs;
