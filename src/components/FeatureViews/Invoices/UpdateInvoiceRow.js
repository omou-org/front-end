import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import  {
    ListActions,
    ListContent,
    ListDetail,
    ListDetailLink,
    ListDetails,
    ListDivider,
    ListHeading,
    ListTitle,
    ListStatus
} from '../../OmouComponents/ListComponent/ListDetailedItem';
import { CourseAvailabilites } from '../../OmouComponents/CourseAvailabilities';
import { fullName } from 'utils';
import moment from 'moment';
import ListActionIcon from './ListActionIcon';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles({
    root: {
        borderTop: '1px solid #C4C4C4',
        padding: '24px 24px 24px 0px',
        height: '120px',
        position: 'relative'
    },
    disabledBox: {
        opacity: '80%',
        width: '100%',
        height: '100%',
        backgroundColor: '#EEEEEE',
        position: 'absolute',
        top: '0px'
    },
    cancelledSVG: {
        zIndex: 5,
        position: 'relative',
    },
    hide: {
        display: 'none'
    },
    row: {
        position: 'relative',
        paddingRight: '0px',
        backgroundColor: 'red'
    },
    lastRow: {
        borderBottom: '1px solid #C4C4C4'
    }
});


const UpdateInvoiceRow = ({registration, updateCancelledRegistrations, isLastItem}) => {

    const [isCancelled, setIsCancelled] = useState(registration.isCancelled);

    const classes = useStyles();

    const handleClick = () => {
        setIsCancelled(!isCancelled);
        updateCancelledRegistrations(registration.id, registration.enrollment.course.title)

    }

    const course = registration.enrollment.course

    const CancelledSVG = () => {
        return (
            <Grid className={classes.cancelledSVG}>
                <svg width="76" height="17" viewBox="0 0 76 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="74" height="15" rx="4" fill="#FF6766" stroke="#FF6766" stroke-width="2"/>
                    <path d="M14.5596 10.0699C14.4821 10.9403 14.1403 11.6194 13.5342 12.107C12.9326 12.5901 12.1374 12.8316 11.1484 12.8316C10.0729 12.8316 9.2207 12.4898 8.5918 11.8062C7.96289 11.1226 7.64844 10.1724 7.64844 8.95562V8.49078C7.64844 7.72059 7.79199 7.04611 8.0791 6.46734C8.36621 5.88401 8.77865 5.43511 9.31641 5.12066C9.85417 4.80621 10.4785 4.64898 11.1895 4.64898C12.1647 4.64898 12.9486 4.89735 13.541 5.3941C14.1335 5.89084 14.4753 6.58127 14.5664 7.46539H12.9053C12.8506 6.95497 12.6797 6.58127 12.3926 6.34429C12.11 6.10276 11.709 5.98199 11.1895 5.98199C9.9362 5.98199 9.30957 6.82509 9.30957 8.51128V9.00347C9.30957 9.84657 9.46224 10.4755 9.76758 10.8902C10.0729 11.3003 10.5332 11.5054 11.1484 11.5054C11.6953 11.5054 12.11 11.3938 12.3926 11.1705C12.6751 10.9472 12.846 10.5803 12.9053 10.0699H14.5596ZM20.9441 11.0201H17.6491L16.9997 12.7222H15.3249L18.5446 4.75835H20.0691L23.2751 12.7222H21.5935L20.9441 11.0201ZM18.1345 9.75542H20.4587L19.2966 6.73394L18.1345 9.75542ZM31.3276 12.7222H29.6733L26.0912 7.28765V12.7222H24.4301V4.75835H26.0912L29.6733 10.1998V4.75835H31.3276V12.7222ZM39.8722 10.0699C39.7948 10.9403 39.453 11.6194 38.8468 12.107C38.2453 12.5901 37.45 12.8316 36.4611 12.8316C35.3856 12.8316 34.5334 12.4898 33.9045 11.8062C33.2755 11.1226 32.9611 10.1724 32.9611 8.95562V8.49078C32.9611 7.72059 33.1046 7.04611 33.3918 6.46734C33.6789 5.88401 34.0913 5.43511 34.6291 5.12066C35.1668 4.80621 35.7912 4.64898 36.5021 4.64898C37.4774 4.64898 38.2612 4.89735 38.8537 5.3941C39.4461 5.89084 39.7879 6.58127 39.8791 7.46539H38.2179C38.1632 6.95497 37.9923 6.58127 37.7052 6.34429C37.4227 6.10276 37.0216 5.98199 36.5021 5.98199C35.2489 5.98199 34.6222 6.82509 34.6222 8.51128V9.00347C34.6222 9.84657 34.7749 10.4755 35.0802 10.8902C35.3856 11.3003 35.8459 11.5054 36.4611 11.5054C37.008 11.5054 37.4227 11.3938 37.7052 11.1705C37.9878 10.9472 38.1587 10.5803 38.2179 10.0699H39.8722ZM46.4755 9.27691H43.0438V11.396H47.0634V12.7222H41.3827V4.75835H47.0429V6.0982H43.0438V7.9439H46.4755V9.27691ZM50.1051 11.396H53.899V12.7222H48.4439V4.75835H50.1051V11.396ZM60.3382 9.27691H56.9066V11.396H60.9261V12.7222H55.2454V4.75835H60.9056V6.0982H56.9066V7.9439H60.3382V9.27691ZM62.3067 12.7222V4.75835H64.8975C65.6449 4.75835 66.3125 4.91558 66.9004 5.23003C67.4929 5.54449 67.9532 5.98882 68.2813 6.56304C68.6094 7.1327 68.778 7.77984 68.7871 8.50445V8.92144C68.7871 9.66428 68.6231 10.3251 68.295 10.9039C67.9714 11.4826 67.5088 11.9315 66.9073 12.2505C66.3103 12.565 65.6289 12.7222 64.8633 12.7222H62.3067ZM63.9678 6.0982V11.396H64.8565C66.3467 11.396 67.1055 10.6031 67.1329 9.01714V8.55914C67.1329 6.95497 66.4242 6.13466 65.0069 6.0982H63.9678Z" fill="white"/>
                </svg>
            </Grid>
        )
    }


    return (
        <Box className={`${classes.root} ${isLastItem && classes.lastRow}`}>
            <Grid container justify='space-between'>
                <ListContent>
                    <Grid container alignItems='center'>
                        <ListActionIcon type={isCancelled ? "add" : "cancel"} onClick={handleClick}/>
                        <Grid item> 
                            <ListHeading>
                                <ListTitle>
                                    {course.title}
                                </ListTitle>
                            </ListHeading>
                            <ListDetails>
                                <ListDetail>
                                    <Link
                                        to={`/accounts/instructor/${course.instructor.user.id}`}
                                    >
                                        <ListDetailLink>
                                            {fullName(
                                                course.instructor.user
                                            )}
                                        </ListDetailLink>
                                    </Link>
                                    
                                </ListDetail>
                                <ListDivider />
                                <ListDetail>
                                    {moment(course.startDate).format(
                                        'MMM D YYYY'
                                    )}{' '}
                                    -{' '}
                                    {moment(course.endDate).format(
                                        'MMM D YYYY'
                                    )}
                                </ListDetail>
                                <ListDivider />
                                <ListDetail>
                                    <CourseAvailabilites
                                        availabilityList={
                                            course.activeAvailabilityList
                                        }
                                    />
                                </ListDetail>
                            </ListDetails>
                        </Grid>
                    </Grid>
                </ListContent>
                <ListActions>
                    <ListStatus>
                        <Grid container
                            direction="column"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                {isCancelled && <CancelledSVG/>}
                            </Grid>
                            <Grid item container spacing={2}>
                                <Grid item>
                                    <Typography
                                        align='left'
                                        variant='h4'
                                    >
                                        {registration.numSessions} Sessions
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography
                                        align='left'
                                        variant='h4'
                                    >
                                        $
                                        {Math.round(
                                            course.hourlyTuition *
                                                registration.numSessions
                                        )}
                                    </Typography>
                                </Grid>
                                        
                            </Grid>
                            <Grid item>
                                <Link to={'/invoices'}>Edit Registration</Link>
                            </Grid>
                        </Grid>
                    </ListStatus>
                </ListActions>
                <div className={`${classes.disabledBox} ${isCancelled || classes.hide}`}></div>
            </Grid>
        </Box>
    )
}

UpdateInvoiceRow.propTypes = {
    registration: PropTypes.any,
    updateCancelledRegistrations: PropTypes.any,
    isLastItem: PropTypes.bool
}

export default UpdateInvoiceRow;