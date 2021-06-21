import React from 'react';

const onboardingContext = {};

export const initalState = {
    UPLOAD_RESPONSE: null,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'UPLOAD_RESPONSE':
            return { ...state, UPLOAD_RESPONSE: action.payload };

        default:
            return new Error();
    }
};

export const OnboardingContext = React.createContext(onboardingContext);
