import "../Accounts.scss";
import * as hooks from "actions/hooks";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import ProfileCard from "../ProfileCard";
import PropTypes from "prop-types";
import React from "react";
import {useSelector} from "react-redux";
import LoadingError from "./LoadingCourseError"

const StudentInfo = ({user}) => {
    const studentList = useSelector(({Users}) => Users.StudentList);
    const fetchStatus = hooks.useStudent(user.student_ids);
    const loadedStudentIDs = user.student_ids
        .filter((studentID) => studentList[studentID]);

    if (loadedStudentIDs.length === 0) {
        if (hooks.isLoading(fetchStatus)) {
            return <Loading />;
        }
        if (hooks.isFail(fetchStatus)) {
            return <LoadingError error="students"/>;
        }
    }

    return (
        <Grid
            alignItems="center"
            container
            direction="row"
            spacing={40}
            md={12}
            xs={10}>
            {
                loadedStudentIDs.map((studentID) => (
                    <ProfileCard
                        key={studentID}
                        route={`/accounts/student/${studentID}`}
                        user={studentList[studentID]} />
                ))
            }
        </Grid>
    );
};

StudentInfo.propTypes = {
    "user": PropTypes.shape({
        "student_ids": PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ])).isRequired,
    }).isRequired,
};

export default StudentInfo;
