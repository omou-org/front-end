import React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';
import TuitionRule from './TutitionRules';
import EditTuitionRule from './EditTuitionRules';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    adminPortalTabsStyle: {
        marginTop: '2rem',
    },
});

const AdminPortalTabs = ({ selectedTabIndex, handleTabSelect }) => {
    const classes = useStyles();

    const adminPortalTabs = [
        { label: 'overview', route: 'overview' },
        { label: 'course tags', route: 'topics' },
        { label: 'tuition rules', route: 'tuition-rules' },
        { label: 'access control', route: 'access-control' },
        { label: 'admin log', route: 'admin-log' },
        { label: 'business details', route: 'business-details' },
    ];

    return (
        <>
            <Tabs
                className={classes.adminPortalTabsStyle}
                value={selectedTabIndex}
                indicatorColor='primary'
                onChange={handleTabSelect}
            >
                {adminPortalTabs.map((currentTab, i) => (
                    <Tab
                        key={i}
                        label={currentTab.label}
                        component={Link}
                        to={`/adminportal/${currentTab.route}/`}
                    />
                ))}
            </Tabs>

            {selectedTabIndex === 0 && (
                <div>
                    <h1>Overview</h1>
                </div>
            )}
            {selectedTabIndex === 1 && (
                <div>
                    <h1>Topics</h1>
                </div>
            )}
            {selectedTabIndex === 2 && (
                <Router>
                    <Switch>
                        <Route
                            exact
                            path='/adminportal/tuition-rules/'
                            render={(props) => <TuitionRule {...props} />}
                        />

                        <Route exact path='/adminportal/tuition-rules/:id'>
                            <EditTuitionRule />
                        </Route>
                    </Switch>
                </Router>
            )}
            {selectedTabIndex === 3 && (
                <div>
                    <h1>Access control</h1>
                </div>
            )}
            {selectedTabIndex === 4 && (
                <div>
                    <h1>Admin log</h1>
                </div>
            )}
            {selectedTabIndex === 5 && <BusinessDetails />}
        </>
    );
};

export default AdminPortalTabs;

AdminPortalTabs.propTypes = {
    selectedTabIndex: PropTypes.number,
    handleTabSelect: PropTypes.func,
};
