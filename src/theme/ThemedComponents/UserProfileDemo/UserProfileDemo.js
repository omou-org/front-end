import { Grid, Hidden } from "@material-ui/core";
import ProfileHeading from "components/FeatureViews/Accounts/ProfileHeading";
import UserAvatar from "components/FeatureViews/Accounts/UserAvatar";
import React from "react";
import { h2, white} from "theme/muiTheme";

const UserProfileDemo = () => {

    const UserProfileInfo = ({ user, isDemo}) => (
        <Grid className="padding" container layout="row">
			<Grid item md={2} style={{maxWidth: "200px"}}>
				<Hidden smDown>
					<UserAvatar
						fontSize="3.5vw"
						margin="0"
						name={user.name}
                        size="136px"
                        style={{...h2, color: white}}
					/>
				</Hidden>
			</Grid>
			<Grid className="headingPadding" item md={10} xs={12}>
				<ProfileHeading user={user} isDemo={isDemo}/>
			</Grid>
		</Grid>
    )

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
            user_id: "5"
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
            <UserProfileInfo user={users.instructor} isDemo={true}/>
            <UserProfileInfo user={users.receptionist}/>
        </>       
    )
}

export default UserProfileDemo;