import React, { useState } from 'react'
import { Grid } from '@material-ui/core';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import StripeIcon from './StripeIcon'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import StripeResultPopup from './StripeResultPopup';
import { useLocation } from 'react-router-dom';

const INITIATE_STRIPE_ONBOARDING = gql`
    mutation InitiateStripeOnboarding($refreshUrlParam: String!, $returnUrlParam: String!){
        stripeOnboarding(refreshUrlParam: $refreshUrlParam, returnUrlParam: $returnUrlParam) {
          onboardingUrl
        }
      }
`

const StripeButton = () => {

    const location = useLocation();
    const pathname = location.pathname.substring(1)

    // Check if successful using query that Jerry will make

    const [stripeOnboardingLoading, setStripeOnboardingLoading] = useState(false);
    // useLocation instead of hard coding adminportal
    const [InitiateStripeOnboarding] = useMutation(INITIATE_STRIPE_ONBOARDING, {
        variables: {
            refreshUrlParam: `${pathname}/?refresh=true`,
            returnUrlParam: `${pathname}/?refresh=false`
        },
        onCompleted: ( {stripeOnboarding: { onboardingUrl }} ) => {
            setStripeOnboardingLoading(false);
            window.open(onboardingUrl, "_self");
        },
        onError: () => {
            setStripeOnboardingLoading(false);
            console.log('OOps, there has been an error connecting to stripe')
        },
    });

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
                onClick={() => {
                    setStripeOnboardingLoading(true);
                    InitiateStripeOnboarding();
                }}
                disabled={stripeOnboardingLoading}
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

    <StripeResultPopup />
    </>)
}

export default StripeButton;