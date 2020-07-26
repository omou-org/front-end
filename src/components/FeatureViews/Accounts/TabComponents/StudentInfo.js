import {Link, useParams} from "react-router-dom";
import React, {useMemo} from "react";
import gql from "graphql-tag";
import Grid from "@material-ui/core/Grid";
import Loading from "components/OmouComponents/Loading";
import LoadingError from "./LoadingCourseError";
import {makeStyles} from "@material-ui/core/styles";
import ProfileCard from "../ProfileCard";
import {useQuery} from "@apollo/react-hooks";

const useStyles = makeStyles({
    "center": {
        "margin": "auto",
        "padding": "17%",
    },
    "new": {
        "backgroundColor": "#f5f5f5",
        "border": "1.5px dashed #999999",
        "cursor": "pointer",
        "height": "50px",
        "position": "relative",
    },
});


const GET_STUDENTS = gql`
    query GetStudents($id: ID) {
        parent(userId: $id) {
            studentPrimaryParent {
                ...StudentInfo
            }
            studentSecondaryParent {
                ...StudentInfo
            }
        }
    }

    fragment StudentInfo on StudentType {
        phoneNumber
        user {
            id
            firstName
            lastName
            email
        }
    }`;

const StudentInfo = () => {
    const {accountID} = useParams();
    const {data, loading, error} = useQuery(GET_STUDENTS, {
        "variables": {"id": accountID},
    });

    const classes = useStyles();

    const studentList = useMemo(() => data?.parent.studentPrimaryParent
        .concat(data?.parent.studentSecondaryParent)
        .map(({user, phoneNumber}) => ({
            "email": user.email,
            "name": `${user.firstName} ${user.lastName}`,
            "phone_number": phoneNumber,
            "role": "student",
            "user_id": user.id,
        })), [data]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <LoadingError error="students" />;
    }

    return (
        <Grid alignItems="center" container direction="row" md={12} spacing={5}
            xs={10}>
            {studentList.map((student) => (
                <ProfileCard key={student.user_id}
                    route={`/accounts/student/${student.user_id}`}
                    user={student} />
            ))}
            <Grid className={classes.new} item sm={6} xs={12}>
                <Link to={{
                    "pathname": `/form/add_student/${accountID}`,
                }} className={classes.center}>
                    Add student
                </Link>
            </Grid>
        </Grid>
    );
};

StudentInfo.propTypes = {};

export default StudentInfo;
