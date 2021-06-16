import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import './Loading.scss';

const Loading = ({ small = false, loadingText = '', isLoading, children }) => {
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
        <>
            {isLoading === undefined ? (
                <div
                    style={{
                        height: '100vh',
                        color: '43B5D',
                        backgroundColor: 'white',
                    }}
                >
                    <h1>
                        <span>o</span>
                        <span>m</span>
                        <span>o</span>
                        <span>u</span>
                    </h1>
                    <Typography variant='h3'>{loadingText}</Typography>
                </div>
            ) : isLoading ? (
                <div className='small-load-wrap'>
                    <div className='load-wrap'>
                        <div className='loading'>
                            <div className='bounceball'> </div>
                            <div className='small-load-text'>{loadingText}</div>
                        </div>
                    </div>
                </div>
            ) : (
                children
            )}
        </>
    );
};

Loading.propTypes = {
    loadingText: PropTypes.string,
    small: PropTypes.bool,
    isLoading: PropTypes.bool,
    children: PropTypes.object,
};

export default Loading;
