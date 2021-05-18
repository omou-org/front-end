import React from 'react';
import { useParams } from 'react-router-dom';
import SessionEditForm from './SessionEditForm';
import SessionOptions from './SessionOptions';

import 'date-fns';

const SessionControls = () => {
    const { editType } = useParams();

    return <>{editType ? <SessionEditForm /> : <SessionOptions />}</>;
};

export default SessionControls;
