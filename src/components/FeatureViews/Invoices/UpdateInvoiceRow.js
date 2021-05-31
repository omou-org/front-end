import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListDetailedItem, {
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
import CourseAvailabilites from '../../OmouComponents/CourseAvailabilities';
import { fullName } from 'utils';
import moment from 'moment';
import ListActionIcon from './ListActionIcon';
import { Grid, Typography } from '@material-ui/core';


const UpdateInvoiceRow = ({registration, handleRowClick, state}) => {

    const course = registration.enrollment.course;
    console.log("row")
    console.log(state)

    return (
        <ListDetailedItem key={course.id} >
            <ListContent>
                <Grid container alignItems='center'>
                    <Grid item>
                        <ListActionIcon type={registration.isCancelled ? 'add' : 'cancel'} onClick={handleRowClick} registrationId={registration.id}/>

                    </Grid>
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
        </ListDetailedItem>
    )
}

UpdateInvoiceRow.propTypes = {
    registration: PropTypes.any,
    handleRowClick: PropTypes.any,
    state: PropTypes.any
}

export default UpdateInvoiceRow;