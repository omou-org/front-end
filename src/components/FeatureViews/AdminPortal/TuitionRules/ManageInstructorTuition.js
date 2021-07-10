import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const ManageInstructorTuition = ({ location }) => {
    console.log(location);
    return <div>hello</div>;
};

ManageInstructorTuition.propTypes = {
    location: PropTypes.object,
};

export default withRouter(ManageInstructorTuition);
