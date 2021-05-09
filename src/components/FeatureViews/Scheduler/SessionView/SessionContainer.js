import React from 'react';

import SessionDetails from './SessionDetails';

import 'date-fns';

import SessionControls from './SessionControls';

const SessionContainer = () => {

    return(
        <>
        <SessionDetails />
        <SessionControls />
        </>
    );

};

export default SessionContainer;
