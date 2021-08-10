import React, { useState } from 'react'
import { Grid } from '@material-ui/core';
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';
import StripeIcon from './StripeIcon'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import StripeResultPopup from './StripeResultPopup';
import { useLocation } from 'react-router-dom';
import Loading from 'components/OmouComponents/Loading';

const INITIATE_STRIPE_ONBOARDING = gql`
    mutation InitiateStripeOnboarding($refreshUrlParam: String!, $returnUrlParam: String!){
        stripeOnboarding(refreshUrlParam: $refreshUrlParam, returnUrlParam: $returnUrlParam) {
          onboardingUrl
        }
      }
`

const IS_INTEGRATED_WITH_STRIPE = gql`
  query stripeOnboardingStatus {
    stripeOnboardingStatus
  }
`


const StripeButton = ({style}) => {

    const { data, loading } = useQuery(IS_INTEGRATED_WITH_STRIPE);

    const location = useLocation();
    const pathname = location.pathname.substring(1)

    const [stripeOnboardingLoading, setStripeOnboardingLoading] = useState(false);
    
    const [InitiateStripeOnboarding] = useMutation(INITIATE_STRIPE_ONBOARDING, {
        variables: {
            refreshUrlParam: `${pathname}/?stripe-timeout=true`,
            returnUrlParam: `${pathname}/?stripe-timeout=false`
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

    if (loading) return <Loading />


    const isConnectedToStripe = data.stripeOnboardingStatus;

    if (isConnectedToStripe) {
        return <StripeResultPopup isConnectedToStripe={isConnectedToStripe} />
    }

    return (
    <>
    <ResponsiveButton 
                variant='outlined'
                styles={{
                    color: '#666666',
                    paddingLeft: '2px',
                    paddingRight: '5px',
                    ...style
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

    <StripeResultPopup isConnectedToStripe={isConnectedToStripe} />
    </>)
}

export default StripeButton;