/* eslint-disable no-unused-vars */
import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';
import TuitionRules from './TuitionRules/TutitionRules';
import SetTuitionRules from './TuitionRules/ManageTopicTuition';
import MainTuitionRulePage from './TuitionRules/ManageTuitionRule';
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
    adminPortalTabsStyle: {
        marginTop: '2rem',
    },
});
/**
 * @description per material-ui TabPanel is an the component used to render tab content
 * @param {node} props
 * @returns JSX of selected tab
 */
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`omou-tabpanel-${index}`}
            aria-labelledby={`omou-tab-${index}`}
            {...other}
        >
            {value === index && <div>{children} </div>}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const AdminPortalTabs = ({ selectedTabIndex, handleTabSelect }) => {
    const classes = useStyles();

    const location = useLocation();

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
            <TabPanel value={selectedTabIndex} index={0}>
                <div>
                    <h1>Overview</h1>
                </div>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={1}>
                <div>
                    <h1>Topics</h1>
                </div>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={2}>
                <Router>
                    <Switch>
                        <Route
                            exact
                            path='/adminportal/tuition-rules/'
                            render={(props) => <TuitionRules {...props} />}
                        />

                        <Route 
                            exact 
                            path='/adminportal/tuition-rules/:id'
                            render={(props) => <SetTuitionRules {...props} />} 
                        />

                        <Route exact path='/adminportal/tuition-rules/:id/edit'>
                            <MainTuitionRulePage />
                        </Route>

                    </Switch>
                </Router>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={3}>
                <div>
                    <h1>Access control</h1>
                </div>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={4}>
                <div>
                    <h1>Admin log</h1>
                </div>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={5}>
                <BusinessDetails />
            </TabPanel>
        </>
    );
};

export default AdminPortalTabs;

AdminPortalTabs.propTypes = {
    selectedTabIndex: PropTypes.number,
    handleTabSelect: PropTypes.func,
};
