import React, { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SingleSessionEdit from './SingleSessionEdit'
import AllSessionsEdit from './AllSessionsEdit'

import 'date-fns';

const SessionEditForm = () => {
    const { session_id, editType } = useParams();

    return(
        <>
        {editType === 'single-session-edit'
            ? <SingleSessionEdit />
            : <AllSessionsEdit />
        }
        </>
    )
}

export default SessionEditForm;