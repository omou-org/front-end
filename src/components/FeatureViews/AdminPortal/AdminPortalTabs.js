import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';
import ManageCourseTopics from './ManageCourseTopics';

const useStyles = makeStyles({
    adminPortalTabsStyle: {
        marginTop: '2rem',
    },
});

const AdminPortalTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, currentTabIndex) => {
        setTabIndex(currentTabIndex);
    };

    const classes = useStyles();

    const adminPortalTabs = [
        { label: 'overview', tab_id: 0 },
        { label: 'course topics', tab_id: 1 },
        { label: 'tuition rates', tab_id: 2 },
        { label: 'access control', tab_id: 3 },
        { label: 'admin log', tab_id: 4 },
        { label: 'business details', tab_id: 5 },
    ];

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    const tabContent = {
        0: { content: 'overview content' },
        1: { content: <ManageCourseTopics /> },
        2: { content: 'tuition content' },
        3: { content: 'access control content' },
        4: { content: 'admin log content' },
        5: { content: <BusinessDetails /> },
    };

    return (
        <>
            <Tabs
                className={classes.adminPortalTabsStyle}
                value={tabIndex}
                onChange={handleTabChange}
            >
                {adminPortalTabs.map((currentTab) => (
                    <Tab key={currentTab.tab_id} label={currentTab.label}></Tab>
                ))}
            </Tabs>

            {tabContent[tabIndex].content}
        </>
    );
};

export default AdminPortalTabs;
