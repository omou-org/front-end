import React,{useState} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography'
import theme from "../../theme/muiTheme";

const ReadMore = (props) => {

    const [readMore, setReadMore] = useState(false);
    const handleReadMoreClick = () => setReadMore(!readMore);

    return (
        <Typography variant="body1" align="left" style={{ wordBreak: "break-word" }}>
            {
                !readMore && props.body.length > 110 ? props.body.substring(0,60) + "..." : props.body
            }
            {props.body.length > 110 && (
            <a onClick={handleReadMoreClick}>
                <span style={{ paddingRight: theme.spacing(1) }}>
                    { !readMore ? "Read More" : " Read Less" }
                </span>
            </a>)}
        </Typography>
    );
}

ReadMore.propTypes = {
    body: PropTypes.string,
};

export default ReadMore;

