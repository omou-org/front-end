import React from 'react';
import AuthenticatedRoute from './AuthenticatedRoute';
import { USER_TYPES } from '../../utils';
import Welcome from '../FeatureViews/Onboarding/Welcome';
import ImportFlow from '../FeatureViews/Onboarding/ImportFlow';
import { Switch } from 'react-router-dom';

export default function OnboardingRoutes() {
    return (
        <Switch>
            {/* Onboarding Routes */}
            <AuthenticatedRoute
                path='/onboarding/welcome'
                users={[USER_TYPES.admin]}
            >
                <Welcome />
            </AuthenticatedRoute>
            <AuthenticatedRoute
                path='/onboarding/import'
                users={[USER_TYPES.admin]}
            >
                <ImportFlow />
            </AuthenticatedRoute>
        </Switch>
    );
}
