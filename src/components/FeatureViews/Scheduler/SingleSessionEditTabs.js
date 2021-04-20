import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    singleSessionEditTabsStyle: {
        marginTop: '2rem',
    },
});

const SingleSessionEditTabs = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, currentTabIndex) => {
        setTabIndex(currentTabIndex);
    };

    const classes = useStyles();

    const singleSessionEditTabs = [
        { label: 'overview', tab_id: 0 },
        { label: 'course tags', tab_id: 1 },
    ];

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    const tabContent = {
        0: { content: 'overview content' },
        1: { content: 'course tags content' },
    };

    return (
        <>
            <Tabs
                className={classes.singleSessionEditTabsStyle}
                value={tabIndex}
                onChange={handleTabChange}
            >
                {singleSessionEditTabs.map((currentTab) => (
                    <Tab key={currentTab.tab_id} label={currentTab.label}></Tab>
                ))}
            </Tabs>

            {tabContent[tabIndex].content}
        </>
    );
};

export default SingleSessionEditTabs;
