import React from "react";
import PropTypes from "prop-types";

import LinearProgress from "@material-ui/core/LinearProgress";
import Loading from "components/OmouComponents/Loading";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import "theme/theme.scss";
import "./registration.scss";
import gql from "graphql-tag";
import {useMutation, useQuery} from "@apollo/react-hooks";
import CourseEnrollmentRow from "./CourseEnrollmentRow";
import {GET_COURSES} from "./RegistrationLanding";

export const DELETE_ENROLLMENT = gql`mutation DeleteEnrollment($enrollmentId:ID) {
  __typename
  deleteEnrollment(id: $enrollmentId) {
    id
    deleted
    parent
    parentBalance
  }
}`


export const GET_ENROLLMENT_DETAILS = gql`
	query EnrollmentDetails($courseId: ID!){
		enrollments(courseId: $courseId) {
            student {
              primaryParent {
                user {
                  firstName
                  lastName
                  email
                  id
                }
                phoneNumber
              }
              user {
                firstName
                lastName
                email
                id
              }
              school {
                name
              }
            }
            id
            course {
                id
                title
              }
         }
	}
	`;

const TableToolbar = (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Upcoming Status", ""].map((heading) => (
                <TableCell align="left" key={heading} padding="default">
                    {heading}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const RegistrationCourseEnrollments = ({courseID, maxCapacity}) => {
    const {data, loading, error} = useQuery(GET_ENROLLMENT_DETAILS, {
        variables: {courseId: courseID}
    });
    

    const [deleteEnrollment] = useMutation(DELETE_ENROLLMENT, {
        update: (cache, {data}) => {
            const cachedEnrollments = cache.readQuery({
                query: GET_ENROLLMENT_DETAILS,
                variables: {courseId: courseID}
            }).enrollments;
            const indexOfDeletedEnrollment = cachedEnrollments
                .findIndex(enrollment => enrollment.id === data.deleteEnrollment.id);

            cachedEnrollments.splice(indexOfDeletedEnrollment, 1);

            cache.writeQuery({
                query: GET_ENROLLMENT_DETAILS,
                variables: {courseId: courseID},
                data: {
                    __typename: "EnrollmentType",
                    enrollments: cachedEnrollments
                },
            });

            let cachedCourses = cache.readQuery({
                query: GET_COURSES,
            }).courses;

            const updatedCourseIndex = cachedCourses.findIndex(course => course.id === courseID);
            const enrollmentToDeleteIndex = cachedCourses[updatedCourseIndex].enrollmentSet
                .findIndex(enrollment => enrollment.id === data.deleteEnrollment.id);

            cachedCourses[updatedCourseIndex].enrollmentSet.splice(enrollmentToDeleteIndex, 1);

            cache.writeQuery({
                query: GET_COURSES,
                data: {courses: cachedCourses}
            });
        }
    });

    if (loading) return <Loading/>;
    if (error) return <Typography>
        There's been an error! Error: {error.message}
    </Typography>;

    const {enrollments} = data;

    return (
        <>
            <div className="course-status">
                <div className="status">
                    <div className="text">
                        {enrollments.length} / {maxCapacity} Spaces Taken
                    </div>
                </div>
                <LinearProgress color="primary"
                    value={(enrollments.length / maxCapacity) * 100}
                    valueBuffer={100}
                    variant="buffer" />
            </div>
            <Table>
                {TableToolbar}
                <TableBody data-cy="enrollment-list">
                    {
                        enrollments.map((enrollment, index) =>
                            <CourseEnrollmentRow
                                testingIndex={index}
                                key={enrollment.id}
                                enrollment={enrollment}
                                deleteEnrollment={deleteEnrollment}
                            />)
                    }
                </TableBody>
            </Table>
        </>
    );
};

RegistrationCourseEnrollments.propTypes = {
    "courseID": PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
};

export default RegistrationCourseEnrollments;
