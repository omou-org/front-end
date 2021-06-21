import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import BusinessDetails from './BusinessDetails';

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
        { label: 'overview' },
        { label: 'course tags' },
        { label: 'tuition rates' },
        { label: 'access control' },
        { label: 'admin log' },
        { label: 'business details' },
    ];

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    const tabContent = {
        0: { content: 'overview content' },
        1: { content: 'course tags content' },
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
                {adminPortalTabs.map((currentTab, i) => (
                    <Tab key={i} label={currentTab.label}></Tab>
                ))}
            </Tabs>

            {tabContent[tabIndex].content}
        </>
    );
};

export default AdminPortalTabs;
