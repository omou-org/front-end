import React, { useState } from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import RequestTable from './RequestTable';
import { LabelBadge } from 'theme/ThemedComponents/Badge/LabelBadge'

const useStyles = makeStyles({
    adminPortalTabsStyle: {
        marginTop: '2rem',
    },
    requestStatusNum: {
        fontSize: '16px',
    }
});

const RequestTabs = ({requests}) => {
    const [tabIndex, setTabIndex] = useState(0);
    const handleTabChange = (event, currentTabIndex) => {
        setTabIndex(currentTabIndex);
    };

    const classes = useStyles();

    const requestNumIcon = (numRequests) => {
        if (numRequests === 0) {
            return '';
        }

        return (
            <span>
                {'  '}
                <LabelBadge variant='round-count' className={classes.requestStatusNum}>
                    {numRequests}
                </LabelBadge>
            </span>
        )
    }

    const adminPortalTabs = [
        { label: 'Request Status' },
        { label: 'Request History' },
    ];

    // *** Components for each tab to be created and placed in respective tabContent property in adminPortalTabs array ***

    const tabContent = {
        0: { content: <RequestTable requests={requests}/> },
        1: { content: 'Request History In Progress' },
    };

    return (
        <>
            <Tabs
                className={classes.adminPortalTabsStyle}
                value={tabIndex}
                onChange={handleTabChange}
            >
                {adminPortalTabs.map((currentTab, i) => (
                    <Tab key={i} label={<span>{currentTab.label}{ (i === 0) ? requestNumIcon(requests.length) : ''}</span>}></Tab>
                ))}
            </Tabs>

            {tabContent[tabIndex].content}
        </>
    );
};

export default RequestTabs;
