import React from 'react';
import { useSelector } from 'react-redux';
import googleClassroomLogo from '../GoogleClassroomIcon.png';

const GoogleClassroomIntegrationIcon = ({googleCode, style}) => {

    const { google_courses } = useSelector(({ auth }) => auth);

    let component = '';

    if (googleCode && google_courses) {
        let isIntegrated = google_courses.some((course) => course.enrollmentCode === googleCode);

        if (isIntegrated) {
            component = <img src={googleClassroomLogo} width='30' height='30' style={style}/>;
        }
    }

    return component;
}

export default GoogleClassroomIntegrationIcon;