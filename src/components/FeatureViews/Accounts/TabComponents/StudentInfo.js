import "../Accounts.scss";
import ProfileCard from "../ProfileCard";
import PropTypes from "prop-types";
import React from "react";
import {REQUEST_STARTED} from "actions/apiActions";
import {useSelector} from "react-redux";
import {useStudent} from "actions/hooks";

import Grid from "@material-ui/core/Grid";

const StudentInfo = ({user}) => {
    const studentList = useSelector(({Users}) => Users.StudentList);
    const fetchStatus = useStudent(user.student_ids);
    if (fetchStatus === REQUEST_STARTED) {
        return "Loading...";
    } else if (fetchStatus < 200 || fetchStatus >= 300) {
        return "Error loading students!";
    }
    return (
        <Grid
            alignItems="center"
            container
            direction="row"
            item
            spacing={40}
            xs={10}>
            {
                user.student_ids.map((studentID) => (
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
        "student_ids": PropTypes.arrayOf(PropTypes.oneOfType(
            PropTypes.string,
            PropTypes.number
        )),
    }).isRequired,
};

export default StudentInfo;
