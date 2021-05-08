import React from 'react'
import { Grid } from '@material-ui/core';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import StripeIcon from './StripeIcon'


const StripeButton = () => {
    return (
    <>
    <ResponsiveButton 
                variant='outlined'
                styles={{
                    color: '#666666',
                    paddingLeft: '2px',
                    paddingRight: '5px'
                }}
                startIcon={StripeIcon}
    >
        <Grid container justify='flex-start' alignItems='center'>
            <Grid item >
                <StripeIcon/> 
            </Grid>
            <Grid item>
                <p>CONNECT STRIPE</p>
            </Grid>
        </Grid>
        </ResponsiveButton>
    </>)
}

export default StripeButton;