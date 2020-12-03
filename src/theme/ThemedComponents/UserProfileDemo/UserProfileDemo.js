import UserProfileInfo from "components/FeatureViews/Accounts/UserProfileInfo";
import React from "react";
const UserProfileDemo = () => {

    const users = {
        student: {
            birthday: "Mon-Day-Year",
            email: "student@gmail.com",
            grade: "12",
            name: "Student Name",
            phone_number: "1231234567",
            role: "student",
            school: "School name",
            user_id: "Number"
        }, 
        instructor: {
            birthday: "Mon-Day-Year",
            email: "instructor@gmail.com",
            name: "Instructor Name",
            phone_number: "1231234567",
            role: "instructor",
            user_id: 5
        },
        parent: {
            balance: "100",
            email: "parent@gmail.com",
            name: "Parent Name",
            phone_number: "1231234567",
            role: "parent",
            user_id: "Number",
        },
        receptionist: {
            birthday: "Mon-Day-Year",
            email: "receptionist@gmail.com",
            name: "Receptionist Name",
            phone_number: "1231234567",
            role: "receptionist",
            user_id: "5"
        }
    }

    return (
        <>
            <UserProfileInfo user={users.student}/>
            <UserProfileInfo user={users.parent}/>
            <UserProfileInfo user={users.receptionist}/>
        </>       
    )
}

export default UserProfileDemo;