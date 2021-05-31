import React, { useState } from 'react'
import { Grid } from '@material-ui/core';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import StripeIcon from './StripeIcon'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const INITIATE_STRIPE_ONBOARDING = gql`
    mutation InitiateStripeOnboarding {
        stripeOnboarding {
          onboardingUrl
        }
      }
`

const StripeButton = () => {

    const [stripeOnboardingLoading, setStripeOnboardingLoading] = useState(false);

    const [InitiateStripeOnboarding] = useMutation(INITIATE_STRIPE_ONBOARDING, {
        onCompleted: ( {stripeOnboarding: { onboardingUrl }} ) => {
            setStripeOnboardingLoading(false);
            window.open(onboardingUrl, '_blank');
        },
        onError: () => {
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
    </>)
}

export default StripeButton;