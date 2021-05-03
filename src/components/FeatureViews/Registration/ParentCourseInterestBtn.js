import React from 'react';
import {buttonBlue, gloom, white} from 'theme/muiTheme';
import {ResponsiveButton} from 'theme/ThemedComponents/Button/ResponsiveButton';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import PropTypes from "prop-types";

const ParentCourseInterestBtn = ({
                                     courseID,
                                     isCourseOnParentInterestList,
                                     handleInterestRegister,
                                 }) => {
    return isCourseOnParentInterestList(courseID) ? (
        <ResponsiveButton
            disabled={true}
            variant='outlined'
            data-cy='add-interest-button'
            style={{ color: buttonBlue, border: 'none', background: white }}
            startIcon={<CheckIcon />}
        >
            interested
        </ResponsiveButton>
    ) : (
        <ResponsiveButton
            variant='outlined'
            onClick={handleInterestRegister(courseID)}
            data-cy='add-interest-button'
            style={{color: gloom}}
            startIcon={<AddIcon/>}
        >
            interest
        </ResponsiveButton>
    );
};

ParentCourseInterestBtn.propTypes = {
    courseID: PropTypes.any,
    isCourseOnParentInterestList: PropTypes.bool,
    handleInterestRegister: PropTypes.func,
};

export default ParentCourseInterestBtn;
