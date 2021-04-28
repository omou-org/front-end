import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SessionEditForm from './SessionEditForm';
import SessionOptions from './SessionOptions';

import 'date-fns';

const SessionControls = () => {
    const { session_id, editType } = useParams();

    return(
        <>
        {editType
            ? <SessionEditForm />
            : <SessionOptions />
        }
        </>
    )
}

export default SessionControls;