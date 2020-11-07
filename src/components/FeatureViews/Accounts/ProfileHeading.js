import React, { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {Link, useParams} from "react-router-dom";
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

import { useSelector } from "react-redux";

const GET_PROFILE_HEADING_QUERY = {
	"admin" : gql`
	query getAdmimUserInfo($userID: ID!) {
		userInfo(userId: $userID) {
		  ... on AdminType {
			birthDate
			accountType
			adminType
			user {
			  firstName
			  lastLogin
			  email
			  id
			}
		  }
		}
	  }
	  `,
	  "instructor": gql`
	  query getInstructorUserInfo($userID: ID!) {
		userInfo(userId: $userID) {
		  ... on InstructorType {
			birthDate
			accountType
			phoneNumber
			user {
			  firstName
			  lastName
			  email
			  id
			}
		  }
		}
	  }`,
	  "parent" : gql`query getParentUserInfo($userID: ID!) {
		userInfo(userId: $userID) {
		  ... on ParentType {
			birthDate
			accountType
			balance
			user {
			  firstName
			  lastName
			  email
			  id
			}
		  }
		}
	  }`,
	  "student" : gql`
	  query getStudentUserInfo($userID: ID!) {
		userInfo(userId: $userID) {
		  ... on StudentType {
			birthDate
			accountType
			grade
			school {
			  name
			  id
			}
			user {
			  firstName
			  lastName
			  email
			  id
			}
		  }
		}
	  }
	  
	  
	 
	  `

}


const ProfileHeading = ({ ownerID }) => {
	const { accountType } = useParams();

	const loggedInUserID = useSelector(({auth}) => auth.user.id)
	

	 const {data, loading, error } = useQuery(GET_PROFILE_HEADING_QUERY[accountType],{
		variables: {userID: ownerID}
	})
	 
	 
	if(loading) return <Loading/>;
	
	if (error) return `Error: ${error}`
	const {userInfo} = data;
	
	const isAdmin = userInfo.accountType === USER_TYPES.admin;
	const isAuthUser = userInfo.user.id === loggedInUserID
	
	
// if logged in user is admin 

	const renderEditandAwayButton = () => (
		<Grid container item xs={4}>
			{isAdmin && isAuthUser && (
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
						#{userInfo.summit_id || userInfo.user.id}
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
					<Typography className="rowText">{userInfo?.birthday}</Typography>
				</Grid>
			</>
		);

		
		
			

		switch (accountType) {
			case "student":
				return (
					<>
						<IDRow />
						<BirthdayRow />
						<Grid className="rowPadding" item xs={1}>
							<GradeIcon className="iconScaling" />
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography className="rowText">Grade {userInfo.grade}</Typography>
						</Grid>
						<PhoneRow />
						<Grid className="rowPadding" item xs={1}>
							<SchoolIcon className="iconScaling" />
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography className="rowText">{userInfo.school?.name}</Typography>
						</Grid>
						<EmailRow />
					</>
				);
			case "INSTRUCTOR":
				return (
					<>
						<IDRow width={12} />
						<PhoneRow width={12} />
						<EmailRow />
					</>
				);
			case "PARENT":
				return (
					<>
						<IDRow />
						<Grid className="rowPadding" item xs={1}>
							<MoneyIcon className="iconScaling" />
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography className="rowText">${userInfo.balance}</Typography>
						</Grid>
						<PhoneRow width={12} />
						<EmailRow />
					</>
				);
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
				{profileDetails()}
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
