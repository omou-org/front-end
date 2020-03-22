import React, {useMemo} from "react";
import PropTypes from "prop-types";

import Grid from "@material-ui/core/Grid";

import Bio from "./TabComponents/Bio";
import InstructorCourses from "./TabComponents/InstructorCourses";
import InstructorSchedule from "./TabComponents/InstructorSchedule";
import Notes from "../Notes/Notes";
import ParentContact from "./TabComponents/ParentContact";
import PayCourses from "./TabComponents/PayCourses";
import PaymentHistory from "./TabComponents/PaymentHistory";
import StudentCourseViewer from "./TabComponents/StudentCourseViewer";
import StudentInfo from "./TabComponents/StudentInfo";

const ComponentViewer = ({inView, user}) => {
    const component = useMemo(() => {
        switch (inView) {
            case 0:
                return <InstructorSchedule instructorID={user.user_id} />;
            case 1:
                return <InstructorCourses instructorID={user.user_id} />;
            case 2:
                return <Bio background={user.background} />;
            case 3:
                return (
                    <StudentCourseViewer
                        current
                        studentID={user.user_id} />
                );
            case 4:
                return (
                    <StudentCourseViewer
                        current={false}
                        studentID={user.user_id} />
                );
            case 5:
                return <PaymentHistory user_id={user.user_id} />;
            case 6:
                return <ParentContact parent_id={user.parent_id} />;
            case 7:
                return (
                    <Notes
                        ownerID={user.user_id}
                        ownerType={user.role} />
                );
            case 8:
                return <StudentInfo user={user} />;
            case 9:
                return <PayCourses user={user} />;
            default:
                return null;
        }
    }, [inView, user]);

    return (
        <Grid className="profile-component-container">
            {component}
        </Grid>
    );
};

ComponentViewer.propTypes = {
    "inView": PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).isRequired,
    "user": PropTypes.shape({
        "background": PropTypes.object,
        "parent_id": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "role": PropTypes.oneOf([
            "instructor",
            "parent",
            "receptionist",
            "student",
        ]).isRequired,
        "user_id": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
    }).isRequired,
};

export default ComponentViewer;
