import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListDetailedItem, {
    ListActions,
    ListButton,
    ListContent,
    ListDetail,
    ListDetailLink,
    ListDetails,
    ListDivider,
    ListHeading,
    ListStatus,
    ListTitle,
} from '../../OmouComponents/ListComponent/ListDetailedItem';
import CourseAvailabilites from '../../OmouComponents/CourseAvailabilities';
import { fullName } from 'utils';
import moment from 'moment';
import ListActionIcon from './ListActionIcon';

const UpdateInvoiceRow = ({registration, handleRowClick, state}) => {

    const course = registration.enrollment.course;
    console.log("row")
    console.log(state)

    return (
        <ListDetailedItem key={course.id}>
            <ListActionIcon type={registration.isCancelled ? 'add' : 'cancel'} onClick={handleRowClick} registrationId={registration.id}/>
            <ListContent>
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
            </ListContent>
            <ListActions>
                {/* <ListStatus>
                    {course.enrollmentSet.length} /{' '}
                    {course.maxCapacity}
                </ListStatus> */}
                {/* <ListButton>
                    {toDisplayRegistrationButton &&
                        (toDisplayRegisterButtonWhenRegistering ? (
                            <ResponsiveButton
                                disabled={shouldDisableQuickRegister(
                                    {
                                        course,
                                        enrolledCourseIds,
                                        registrations,
                                        studentIdList,
                                    }
                                )}
                                variant='contained'
                                onClick={handleStartQuickRegister(
                                    course.id
                                )}
                                data-cy='quick-register-class'
                                startIcon={<AddIcon />}
                            >
                                register
                            </ResponsiveButton>
                        ) : (
                            <ParentCourseInterestBtn
                                courseID={course.id}
                                isCourseOnParentInterestList={
                                    isCourseOnParentInterestList
                                }
                                handleInterestRegister={
                                    handleInterestRegister
                                }
                            />
                        ))}
                </ListButton> */}
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