import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import './Loading.scss';

const Loading = ({ small = false, loadingText = '' }) => {
    if (small) {
        return (
            <div className='small-load-wrap'>
                <div className='load-wrap'>
                    <div className='loading'>
                        <div className='bounceball'> </div>
                        <div className='small-load-text'>{loadingText}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div style={{height: '100vh', color: '43B5D', backgroundColor: 'white'}}>
            <h1>
                <span>o</span>
                <span>m</span>
                <span>o</span>
                <span>u</span>
            </h1>
            <Typography variant='h3'>{loadingText}</Typography>
        </div>
    );
};

Loading.propTypes = {
    loadingText: PropTypes.string,
    small: PropTypes.bool,
};

export default Loading;
