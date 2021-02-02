import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import theme from '../../theme/muiTheme';

const ReadMoreText = ({ children, textLimit, handleDisplay = null }) => {
    const [isReadMoreClosed, setReadMore] = useState(true);
    const handleReadMoreClick = () => {
        console.log(handleDisplay);
        if (handleDisplay !== null) {
            handleDisplay();
        } else {
            setReadMore(!isReadMoreClosed);
        }
    };
    const bodyText = children;
    const isOverTextLimit = children.length > textLimit;

    if (isOverTextLimit) {
        return (
            <Typography
                variant='body1'
                align='left'
                style={{ wordBreak: 'break-word' }}
            >
                {isReadMoreClosed
                    ? bodyText.substring(0, textLimit) + '...\n'
                    : bodyText + '\n'}
                <a onClick={handleReadMoreClick}>
                    <span style={{paddingRight: theme.spacing(1), cursor: "pointer"}}>
                        {isReadMoreClosed ? 'Read More' : ' Read Less'}
                    </span>
                </a>
            </Typography>
        );
    } else {
        return (
            <Typography
                variant='body1'
                align='left'
                style={{ wordBreak: 'break-word' }}
            >
                {bodyText}
            </Typography>
        );
    }
};

ReadMoreText.propTypes = {
    children: PropTypes.string.isRequired,
    textLimit: PropTypes.number.isRequired,
    handleDisplay: PropTypes.func,
};

export default ReadMoreText;
