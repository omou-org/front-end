/* eslint-disable no-unused-vars */
import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';
import TuitionRules from './TuitionRules/TutitionRules';
import ManageTopicTuition from './TuitionRules/ManageTopicTuition';
import ManageTuitionRule from './TuitionRules/ManageTuitionRule';
import ManageInstructorRule from './TuitionRules/ManageInstructorRule';
import ManageInstructorTuition from './TuitionRules/ManageInstructorTuition';

import Discounts from './Discounts/Discounts';
import DiscountView from './Discounts/DiscountView';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
} from 'react-router-dom';
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
        { label: 'discounts', route: 'discounts' },
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
                            render={(props) => (
                                <ManageTopicTuition {...props} />
                            )}
                        />

                        <Route exact path='/adminportal/tuition-rules/:id/edit'>
                            <ManageTuitionRule />
                        </Route>

                        <Route
                            exact
                            path='/adminportal/tuition-rules/:id/edit-instructor'
                            render={(props) => (
                                <ManageInstructorRule {...props} />
                            )}
                        />

                        <Route
                            exact
                            path='/adminportal/tuition-rules/:id/edit-instructor-tuition'
                            render={(props) => (
                                <ManageInstructorTuition {...props} />
                            )}
                        />

                    </Switch>
                </Router>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={3}>
                <div>
                    <h1>Access control</h1>
                </div>
            </TabPanel>
            <TabPanel value={selectedTabIndex} index={4}>
                <Router>
                    <Switch>
                        <Route
                            exact
                            path='/adminportal/discounts'
                            render={(props) => <Discounts {...props} />}
                        />
                        <Route
                            exact
                            path='/adminportal/discounts/:id'
                            render={(props) => (
                                <DiscountView {...props} />
                            )}
                        />
                    </Switch>
                </Router>
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
