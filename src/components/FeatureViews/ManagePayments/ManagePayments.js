import React, { useCallback, useState } from 'react';
import MyPaymentsRoutes from '../../Routes/MyPaymentsRoutes';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import ActiveInvoices from './ActiveInvoices';
import { makeStyles } from '@material-ui/core/styles';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default function ManagePayments() {
    const [value, setValue] = useState(0);
    const history = useHistory();

    const handleChange = useCallback(
        (_, newTab) => {
            setValue(newTab);
            if (newTab === 0) history.push('/my-payments');
            if (newTab === 1) history.push('/my-payments/history');
        },
        [setValue]
    );

    const useStyles = makeStyles({
        MuiIndicator: {
            height: '1px',
        },
    });

    const classes = useStyles();

    return (
        <div>
            <Typography variant='h3' align='left'>
                My Payments
            </Typography>
            <Tabs
                classes={{ indicator: classes.MuiIndicator }}
                value={value}
                onChange={handleChange}
                aria-label='simple tabs example'
            >
                <Tab label='Outstanding Invoice' />
                <Tab label='Payment History' />
            </Tabs>
            <TabPanel value={value} index={0}>
                <ActiveInvoices />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <MyPaymentsRoutes />
            </TabPanel>
        </div>
    );
}
