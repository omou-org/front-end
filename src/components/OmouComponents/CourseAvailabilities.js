import React from 'react';
import { Typography } from '@material-ui/core';
import { DayAbbreviation, sessionsAtSameTimeInMultiDayCourse } from 'utils';
import moment from 'moment';

const CourseAvailabilites = ({ availabilityList, variant, style, rest }) => {
    const renderCourseAvailabilitiesString = (availabilityList) => {
        if (sessionsAtSameTimeInMultiDayCourse(availabilityList)) {
            const days = availabilityList.reduce(
                (allDays, { dayOfWeek }, index) => {
                    return (
                        allDays +
                        DayAbbreviation[dayOfWeek.toLowerCase()] +
                        (index !== availabilityList.length - 1 ? ' / ' : ', ')
                    );
                },
                ''
            );

            const startTime = moment(availabilityList[0].startTime, [
                'HH:mm:ss',
            ]).format('h:mma');
            const endTime = moment(availabilityList[0].endTime, [
                'HH:mm:ss',
            ]).format('h:mma');

            return `${days}${startTime} - ${endTime}`;
        } else {
            return availabilityList.reduce(
                (allAvailabilites, availability, i) => {
                    const day =
                        DayAbbreviation[availability.dayOfWeek.toLowerCase()];
                    const startTime = moment(availability.startTime, [
                        'HH:mm:ss',
                    ]).format('h:mma');
                    const endTime = moment(availability.endTime, [
                        'HH:mm:ss',
                    ]).format('h:mma');

                    return (
                        allAvailabilites +
                        `${day}, ${startTime} - ${endTime}${
                            i !== availabilityList.length - 1 ? ' / ' : ''
                        }`
                    );
                },
                ''
            );
        }
    };

    return (
        <Typography
            align='left'
            {...rest}
            style={{ ...style }}
            variant={variant}
        >
            {renderCourseAvailabilitiesString(availabilityList)}
        </Typography>
    );
};

export default CourseAvailabilites;
