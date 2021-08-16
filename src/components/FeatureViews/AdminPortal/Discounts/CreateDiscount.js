import React from 'react';
import { withRouter } from 'react-router-dom';

import PropTypes from 'prop-types';

const CreateDiscount = ({ location }) => {
    console.log(location);

    return <div>create discount</div>;
};

CreateDiscount.propTypes = {
    location: PropTypes.object,
};

export default withRouter(CreateDiscount);
