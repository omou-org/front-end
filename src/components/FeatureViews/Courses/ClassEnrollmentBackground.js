import React from 'react';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    accordionNotes: {
        textAlign: 'left',
        display: 'inline-block',
        marginTop: '10px',
    },
    accordionNotesBorder: {
        border: '1px #E0E0E0 solid',
        borderRadius: '25px',
        margin: '0px 24px 25px 24px',
        paddingTop: '0px',
    },

    studentInfoSpacing: {
        margin: '15px',
    },
}));

const StudentEnrollmentBackground = ({ studentInfo }) => {
    const classes = useStyles();

    return (
        <AccordionDetails className={classes.accordionNotesBorder}>
            <Typography className={classes.accordionNotes} variant='body'>
                <Typography className={classes.studentInfoSpacing}>
                    <b>School:</b> {studentInfo.name ? studentInfo.name : 'N/A'}
                </Typography>
                <Typography className={classes.studentInfoSpacing}>
                    <b>School Teacher:</b>{' '}
                    {studentInfo.teacher ? studentInfo.teacher : 'N/A'}
                </Typography>
                <Typography className={classes.studentInfoSpacing}>
                    <b>Textbook used:</b>{' '}
                    {studentInfo.textbook ? studentInfo.textbook : 'N/A'}
                </Typography>
            </Typography>
        </AccordionDetails>
    );
};

StudentEnrollmentBackground.propTypes = {
    studentInfo: PropTypes.shape({
        name: PropTypes.string,
        teacher: PropTypes.string,
        textbook: PropTypes.string,
    }).isRequired,
};

export default StudentEnrollmentBackground;
