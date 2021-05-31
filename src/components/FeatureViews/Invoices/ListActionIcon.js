import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';


const ListActionIcon = ({type, onClick, registrationId}) => {
    const icons = {
        cancel: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM15 13.59L13.59 15L10 11.41L6.41 15L5 13.59L8.59 10L5 6.41L6.41 5L10 8.59L13.59 5L15 6.41L11.41 10L15 13.59Z" fill="#FF6766"/>
        </svg>
        ,
        add: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM15 11H11V15H9V11H5V9H9V5H11V9H15V11Z" fill="#43B5D9"/>
        </svg>
         
        }
        
        console.log(icons.cancel)
    return (
        <Grid item onClick={() => onClick(registrationId)}>
            {icons[type]}
        </Grid>);
}


ListActionIcon.propTypes = {
    type: PropTypes.oneOf(['cancel', 'add']),
    onClick: PropTypes.any,
    registrationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
}

export default ListActionIcon;