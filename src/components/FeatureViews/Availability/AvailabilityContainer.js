import React, { useCallback, useState } from 'react';
import BackgroundPaper from '../../OmouComponents/BackgroundPaper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TimeAvailabilityContainer from './TimeAvailabilityContainer';
import RequestOutOfOfficeContainer from './RequestOutOfOfficeContainer';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ width: '100%' }}
            {...other}
        >
            {value === index && <Box p={2}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.any,
    value: PropTypes.any,
    index: PropTypes.any,
};

export default function AvailabilityContainer() {
    const [tab, setTab] = useState(0);

    const handleChangeTab = useCallback(
        (_, newValue) => {
            setTab(newValue);
        },
        [setTab]
    );

    const useStyles = makeStyles({
        MuiIndicator: {
            height: '1px',
        },
    });

    const classes = useStyles();

    return (
        <BackgroundPaper>
            <Grid container direction='row' spacing={4}>
                <Grid item>
                    <Typography variant='h5' align='left'>
                        Summit Tutoring Business Hours
                    </Typography>
                    <Typography align='left'>
                        Monday - Friday: 2:00 PM - 9:00 PM
                    </Typography>
                    <Typography align='left'>
                        Saturday: 9:00 AM - 4:00 PM
                    </Typography>
                    <Typography align='left'>Sunday: CLOSED</Typography>
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={12}>
                        <Tabs
                            classes={{ indicator: classes.MuiIndicator }}
                            value={tab}
                            onChange={handleChangeTab}
                            aria-label='Instructor availability tabs'
                        >
                            <Tab label='Time Availability' />
                            <Tab label='Course Availability' disabled />
                            <Tab
                                label='Request Out of Office'
                                data-cy='request-OOO-tab'
                            />
                        </Tabs>
                    </Grid>
                    <Grid item container xs={12}>
                        <TabPanel value={tab} index={0}>
                            <TimeAvailabilityContainer />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            TBD
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            <RequestOutOfOfficeContainer />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Grid>
        </BackgroundPaper>
    );
}
