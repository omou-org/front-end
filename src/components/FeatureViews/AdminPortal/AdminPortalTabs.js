import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const AdminPortalTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, currentTabIndex) => {
        setTabIndex(currentTabIndex);
    };

    const useStyles = makeStyles({
        adminPortalTabsStyle: {
            marginTop: '2rem',
        },
    });

    const classes = useStyles();

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    const adminPortalTabs = [
        { label: 'overview', tab_id: 0, tabContent: 'overview content'},
        { label: 'course tags', tab_id: 1, tabContent: 'course tags content' },
        { label: 'tuition rates', tab_id: 2, tabContent: 'tuition rates content' },
        { label: 'access control', tab_id: 3, tabContent: 'access control content' },
        { label: 'admin log', tab_id: 4, tabContent: 'admin log content' },
        { label: 'settings', tab_id: 5, tabContent: 'settings content' },
    ];

    const TabContent = (props) => {
        const { children, value, index, ...rest } = props;

        return (
            <div>{value === index && <Typography>{children}</Typography>}</div>
        );
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

            {adminPortalTabs.map((currentTab) => (
                <TabContent value={tabIndex} index={currentTab.tab_id}>
                    {currentTab.tabContent}
                </TabContent>
            ))}
        </>
    );
};

export default AdminPortalTabs;
