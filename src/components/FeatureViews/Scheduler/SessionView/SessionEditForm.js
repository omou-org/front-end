import React from 'react';
import { useParams } from 'react-router-dom';
import SingleSessionEdit from './SingleSessionEdit';
import AllSessionsEdit from './AllSessionsEdit';

import 'date-fns';

const SessionEditForm = () => {
    const { editType } = useParams();

    return (
        <>
            {editType === 'single-session-edit' ? (
                <SingleSessionEdit />
            ) : (
                <AllSessionsEdit />
            )}
        </>
    );
};

export default SessionEditForm;
