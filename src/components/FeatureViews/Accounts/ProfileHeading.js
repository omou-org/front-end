import React, {useCallback, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import Button from "@material-ui/core/Button";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import CalendarIcon from "@material-ui/icons/CalendarToday";
import EditIcon from "@material-ui/icons/EditOutlined";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import Typography from "@material-ui/core/Typography";

import "./Accounts.scss";
import {addDashes} from "./accountUtils";
import {ReactComponent as BirthdayIcon} from "../../birthday.svg";
import {ReactComponent as GradeIcon} from "../../grade.svg";
import {ReactComponent as IDIcon} from "../../identifier.svg";
import InstructorAvailability from "./InstructorAvailability";
import OutOfOffice from "./OutOfOffice";
import { LabelBadge } from "theme/ThemedComponents/Badge/LabelBadge";
import {ReactComponent as SchoolIcon} from "../../school.svg";
import {USER_TYPES} from "utils";
import { capitalizeString } from "utils";



const ProfileHeading = ({ user }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const isAdmin =
		useSelector(({auth}) => auth.accountType) === USER_TYPES.admin;

	const handleOpen = useCallback(({currentTarget}) => {
		setAnchorEl(currentTarget);
	}, []);

	const handleClose = useCallback(() => {
		setAnchorEl(null);
	}, []);

	const renderEditandAwayButton = () => (
		<Grid container item xs={4}>
			{user.role === "instructor" && (
				<Grid align="left" className="schedule-button" item xs={12}>
					<ResponsiveButton
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleOpen}
						variant="outlined"
						startIcon={<CalendarIcon/>}
					>
						Schedule Options
					</ResponsiveButton>
					<Menu
						anchorEl={anchorEl}
						keepMounted
						onClose={handleClose}
						open={anchorEl !== null}
					>
						<InstructorAvailability
							button={false}
							instructorID={user.user_id}
						/>
						<OutOfOffice button={false} instructorID={user.user_id}/>
					</Menu>
				</Grid>
			)}
			{isAdmin && (
				<>
					<Grid component={Hidden} item mdDown xs={12}>
						<ResponsiveButton
							component={Link}
							to={`/form/${user.role}/${user.user_id}`}
							variant="outlined"
							startIcon={<EditIcon/>}
						>
							Edit Profile
						</ResponsiveButton>
					</Grid>
					<Grid component={Hidden} item lgUp xs={12}>
						<Button
							component={Link}
							to={`/form/${user.role}/${user.user_id}`}
							variant="outlined"
						>
							<EditIcon/>
						</Button>
					</Grid>
				</>
			)}
		</Grid>
	);

	const profileDetails = useMemo(() => {
		const IDRow = ({width = 6}) => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<IDIcon className="iconScaling"/>
				</Grid>
				<Grid className="rowPadding" item xs={width - 1}>
					<Typography variant="body1" className="rowText">
						#{user.summit_id || user.user_id}
					</Typography>
				</Grid>
			</>
		);

		const EmailRow = () => (
			<>
				<Grid className="emailPadding" item md={1}>
					<a href={`mailto:${user.email}`}>
						<EmailIcon/>
					</a>
				</Grid>
				<Grid className="emailPadding" item md={5}>
					<a href={`mailto:${user.email}`}>
						<Typography variant="body1" className="rowText">{user.email}</Typography>
					</a>
				</Grid>
			</>
		);

		const PhoneRow = ({width = 6}) => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<PhoneIcon className="iconScaling"/>
				</Grid>
				<Grid className="rowPadding" item xs={width - 1}>
					<Typography variant="body1" className="rowText">
						{addDashes(user.phone_number)}
					</Typography>
				</Grid>
			</>
		);

		const BirthdayRow = () => (
			<>
				<Grid className="rowPadding" item xs={1}>
					<BirthdayIcon className="iconScaling"/>
				</Grid>
				<Grid className="rowPadding" item xs={5}>
					<Typography variant="body1" className="rowText">{user.birthday}</Typography>
				</Grid>
			</>
		);

		switch (user.role) {
			case "student":
				return (
					<>
						<IDRow/>
						<BirthdayRow/>
						<Grid className="rowPadding" item xs={1}>
							<GradeIcon className="iconScaling"/>
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography variant="body1" className="rowText">Grade {user.grade}</Typography>
						</Grid>
						<PhoneRow/>
						<Grid className="rowPadding" item xs={1}>
							<SchoolIcon className="iconScaling"/>
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography variant="body1" className="rowText">{user.school}</Typography>
						</Grid>
						<EmailRow/>
					</>
				);
			case "instructor":
			case "receptionist":
				return (
					<>
						<IDRow width={12}/>
						<PhoneRow width={12}/>
						<EmailRow/>
					</>
				);
			case "parent":
				return (
					<>
						<IDRow/>
						<Grid className="rowPadding" item xs={1}>
							<MoneyIcon className="iconScaling"/>
						</Grid>
						<Grid className="rowPadding" item xs={5}>
							<Typography variant="body1" className="rowText">${user.balance}</Typography>
						</Grid>
						<PhoneRow width={12}/>
						<EmailRow/>
					</>
				);
			default:
				return null;
		}
	}, [user]);

	return (
		<Grid alignItems="center" container item xs={12}>
			<Grid align="left" alignItems="center" container item xs={8}>
				<Grid className="profile-name" item style={{paddingRight: 10}}>
					<Typography variant="h3">{user.name}</Typography>
				</Grid>
				<Grid item>
					<Hidden smDown>
						<LabelBadge label={capitalizeString(user.role)} variant="outline-gray"/>
					</Hidden>
				</Grid>
			</Grid>
			{renderEditandAwayButton()}
			<Grid
				container
				style={{
					margin: user.role === "instructor" ? "-10px 0" : "10px 0",
				}}
			>
				{profileDetails}
			</Grid>
		</Grid>
	);
};

ProfileHeading.propTypes = {
	user: PropTypes.shape({
		balance: PropTypes.string,
		birthday: PropTypes.string,
		email: PropTypes.string,
		grade: PropTypes.number,
		name: PropTypes.string,
		phone_number: PropTypes.string,
		role: PropTypes.oneOf(["instructor", "parent", "receptionist", "student"]),
		school: PropTypes.string,
		summit_id: PropTypes.string,
		user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	}).isRequired,
};

export default ProfileHeading;
