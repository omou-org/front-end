import React,{useState} from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography'
import theme from "../../theme/muiTheme";

const ReadMoreText = (props) => {

    const [isReadMoreClosed, setReadMoreClosed] = useState(true);
    const handleReadMoreClick = () => setReadMoreClosed(!isReadMoreClosed);
    const bodyText = props.children;
    const isOverTextLimit = (props.children.length > props.textLimit);


    if(isOverTextLimit){
        return (
            <Typography variant="body1" align="left" style={{ wordBreak: "break-word" }}>
                {isReadMoreClosed ? bodyText.substring(0,props.textLimit) + "..." : bodyText}
                <a onClick={handleReadMoreClick}>
                    <span style={{ paddingRight: theme.spacing(1) }}>
                        { isReadMoreClosed ? "Read More" : " Read Less" }
                    </span>
                </a>
            </Typography>
        );
    }
    else {
        return (
            <Typography variant="body1" align="left" style={{ wordBreak: "break-word" }}>
                {bodyText}
            </Typography>
        )
    }
    
}

ReadMoreText.propTypes = {
    children : PropTypes.string,
    textLimit : PropTypes.string,
};

export default ReadMoreText;

