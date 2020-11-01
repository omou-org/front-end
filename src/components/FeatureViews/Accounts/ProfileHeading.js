import React, { useCallback, useMemo, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";
import CalendarIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/EditOutlined";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";
import Loading from "components/OmouComponents/Loading";
import "./Accounts.scss";
import { addDashes } from "./accountUtils";
import { ReactComponent as BirthdayIcon } from "../../birthday.svg";
import { ReactComponent as GradeIcon } from "../../grade.svg";
import { ReactComponent as IDIcon } from "../../identifier.svg";
import InstructorAvailability from "./InstructorAvailability";
import OutOfOffice from "./OutOfOffice";
import RoleChip from "./RoleChip";
import { ReactComponent as SchoolIcon } from "../../school.svg";
import { USER_TYPES } from "utils";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";


const GET_PROFILE_HEADING_QUERY = gql
`query ProfileHeadingQuery($ownerID: [ID]!) {
	userInfos(userIds: $ownerID) {
	  ... on AdminType {
		userUuid
		birthDate
		accountType
		adminType
		phoneNumber
		user {
		  lastName
		  firstName
		  email
		}
	  }
	  ... on InstructorType {
		birthDate
		phoneNumber
		accountType
		user {
		  firstName
		  lastName
		  email
		}
	  }
	  ... on ParentType {
		userUuid
		birthDate
		accountType
		balance
		user {
		  firstName
		  lastLogin
		  email
		}
	  }
	}
  }
  
  `



const ProfileHeading = ({ ownerID }) => {


	


	const [anchorEl, setAnchorEl] = useState(null);
	

	//1. check if account is admin 
	//2. need to query for userInfo 
	/**
	 * Admin : 
	 * accountType
	 * ID
	 * All Users:
	 * ID 
	 * fist & last name 
	 * Email
	 * phone #
	 * birthday
	 * Sutudent:
	 * grade 
	 * school
	 * Parent:
	 * balance
	 * 
	 */  	

	const {data,loading,error} = useQuery(GET_PROFILE_HEADING_QUERY,{
		variables: {ownerID},
		skip: !ownerID
	});

console.log({data}, {loading}, {error})
	
	if(loading) return <Loading/>;
	if (error ) return `Error: ${error}`
	


	const user = {user: 1}
	
	const {userInfo} = data
	
	const isAdmin = userInfo.accountType === USER_TYPES.admin;

	const renderEditandAwayButton = () => (
		<Grid container item xs={4}>
			{isAdmin && (
				<>
					<Grid component={Hidden} item mdDown xs={12}>
						<Button
							component={Link}
							to={`/form/${userInfo.accountType.role}/${userInfo.user.id}`}
							variant="outlined"
						>
							<EditIcon />
							Edit Profile
						</Button>
					</Grid>
					<Grid component={Hidden} item lgUp xs={12}>
						<Button
							component={Link}
							to={`/form/${userInfo.accountType.role}/${userInfo.user.id}`}
							variant="outlined"
						>
							<EditIcon />
						</Button>
					</Grid>
				</>
			)}
		</Grid>
	);



	const profileDetails = () => {
		const IDRow = ({ width = 6 }) => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<IDIcon className="iconScaling" />
				</Grid>
				<Grid className="rowPadding" item xs={width - 1}>
					<Typography className="rowText">
						#{user.summit_id || userInfo.user.id}
					</Typography>
				</Grid>
			</>
		);

		const EmailRow = () => (
			<>
				<Grid className="emailPadding" item md={1}>
					<a href={`mailto:${userInfo.user.email}`}>
						<EmailIcon />
					</a>
				</Grid>
				<Grid className="emailPadding" item md={5}>
					<a href={`mailto:${userInfo.user.email}`}>
						<Typography className="rowText">{userInfo.user.email}</Typography>
					</a>
				</Grid>
			</>
		);

		const PhoneRow = ({ width = 6 }) => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<PhoneIcon className="iconScaling" />
				</Grid>
				<Grid className="rowPadding" item xs={width - 1}>
					<Typography className="rowText">
						{addDashes(userInfo.phoneNumber)}
					</Typography>
				</Grid>
			</>
		);

		const BirthdayRow = () => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<BirthdayIcon className="iconScaling" />
				</Grid>
				<Grid className="rowPadding" item xs={5}>
					<Typography className="rowText">{user.birthday}</Typography>
				</Grid>
			</>
		);

		



		switch (userInfo.accountType) {
			// case "student":
			// 	return (
			// 		<>
			// 			<IDRow />
			// 			<BirthdayRow />
			// 			<Grid className="rowPadding" item xs={1}>
			// 				<GradeIcon className="iconScaling" />
			// 			</Grid>
			// 			<Grid className="rowPadding" item xs={5}>
			// 				<Typography className="rowText">Grade {user.grade}</Typography>
			// 			</Grid>
			// 			<PhoneRow />
			// 			<Grid className="rowPadding" item xs={1}>
			// 				<SchoolIcon className="iconScaling" />
			// 			</Grid>
			// 			<Grid className="rowPadding" item xs={5}>
			// 				<Typography className="rowText">{user.school}</Typography>
			// 			</Grid>
			// 			<EmailRow />
			// 		</>
			// 	);
			// case "INSTRUCTOR":
			// 	return (
			// 		<>
			// 			<IDRow width={12} />
			// 			<PhoneRow width={12} />
			// 			<EmailRow />
			// 		</>
			// 	);
			// case "PARENT":
			// 	return (
			// 		<>
			// 			<IDRow />
			// 			<Grid className="rowPadding" item xs={1}>
			// 				<MoneyIcon className="iconScaling" />
			// 			</Grid>
			// 			<Grid className="rowPadding" item xs={5}>
			// 				<Typography className="rowText">${userInfo.balance}</Typography>
			// 			</Grid>
			// 			<PhoneRow width={12} />
			// 			<EmailRow />
			// 		</>
			// 	);
			default:
				return (
					<>
						<IDRow width={12} />
						<PhoneRow width={12} />
						<EmailRow />
					</>
				);;
		}
	};




	return (
		<Grid alignItems="center" container item xs={12}>
			<Grid align="left" alignItems="center" container item xs={8}>
				<Grid className="profile-name" item style={{ paddingRight: 10 }}>
					<Typography variant="h4">{userInfo.user.firstName} {userInfo.user.lastName}</Typography>
				</Grid>
				<Grid item>
					<Hidden smDown>
						<RoleChip role={userInfo.accountType === "ADMIN" ? userInfo.adminType : userInfo.accountType} />
					</Hidden>
				</Grid>
			</Grid>
			{renderEditandAwayButton()}
			<Grid
				container
				style={{
					margin: "10px 0",
				}}
			>
				{profileDetails}
			</Grid>
		</Grid >
	);
};

ProfileHeading.propTypes = {
	// user: PropTypes.shape({
	// 	balance: PropTypes.string,
	// 	birthday: PropTypes.string,
	// 	email: PropTypes.string,
	// 	grade: PropTypes.number,
	// 	name: PropTypes.string,
	// 	phone_number: PropTypes.string,
	// 	// role: PropTypes.oneOf(["instructor", "parent", "receptionist", "student"]),
	// 	school: PropTypes.string,
	// 	summit_id: PropTypes.string,
	// 	user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	// }).isRequired,
};

export default ProfileHeading;
