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
import { makeStyles } from "@material-ui/core";

import "./Accounts.scss";
import {addDashes} from "./accountUtils";
import {ReactComponent as GradeIcon} from "../../grade.svg";
import {ReactComponent as IDIcon} from "../../identifier.svg";
import InstructorAvailability from "./InstructorAvailability";
import OutOfOffice from "./OutOfOffice";
import { LabelBadge } from "theme/ThemedComponents/Badge/LabelBadge";
import {ReactComponent as SchoolIcon} from "../../school.svg";
import CakeOutlinedIcon from '@material-ui/icons/CakeOutlined';
import {USER_TYPES} from "utils";
import { capitalizeString } from "utils";
import { darkGrey } from "theme/muiTheme";


const useStyles = makeStyles({
    icon: {
		fill: darkGrey,
	},
	text: {
		color: darkGrey,
	},
	link: {
		textDecoration: 'none',
	},
	iconContainer: {
		paddingTop:"3px"
	}

});

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

	const classes = useStyles();

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

		const InfoRow = ({ variant, width = 6}) => {

			const type = {
				"ID": {
					icon: <IDIcon className={classes.icon}/>,
					text: `#${user.summit_id || user.user_id}`
				},
				"Phone": {
					icon: <PhoneIcon className={classes.icon}/>,
					text: addDashes(user.phone_number),
				},
				"Birthday": {
					icon: <CakeOutlinedIcon className={classes.icon}/>,
					text: user.birthday,
				},
				"Grade": {
					icon: <GradeIcon className={classes.icon}/>,
					text: `Grade ${user.grade}`,
				},
				"School": {
					icon: <SchoolIcon className={classes.icon}/>,
					text: user.school,
				},
				"Balance": {
					icon: <MoneyIcon className={classes.icon}/>,
					text: `$${user.balance}`
				},
				"Email": {
					icon: <EmailIcon className={classes.icon}/>,
					text: user.email,
				}
			}

			if (variant === "Email" && user.email !== "") {
				return (
					<>
						<Grid item md={1} className={classes.iconContainer}>
							<a href={`mailto:${user.email}`}>
								<EmailIcon className={classes.icon}/>
							</a>
						</Grid>
						<Grid item md={width - 1}>
							<a className={classes.link} href={`mailto:${user.email}`}>
								<Typography variant="body1" className={classes.text}>{user.email}</Typography>
							</a>
						</Grid>
					</>
				)
			} else {
				return (
					<>
						<Grid item xs={1} className={classes.iconContainer}>
							{type[variant].icon}
						</Grid>
						<Grid item xs={width - 1}>
							<Typography variant="body1" className={classes.text}>{type[variant].text}</Typography>
						</Grid>
					</> 
				)
			}
		}

		switch (user.role) {
			case "student":
				return (
					<>
						<InfoRow variant="ID"/>
						<InfoRow variant="Grade"/>
						<InfoRow variant="Phone"/>
						<InfoRow variant="School"/>
						<InfoRow variant="Email"/>
						<InfoRow variant="Birthday"/>
					</>
				);
			case "instructor":
			case "receptionist":
				return (
					<>
						<InfoRow variant="ID"/>
						<InfoRow variant="Email"/>
						<InfoRow variant="Phone"/>
						<InfoRow variant="Birthday"/>
					</>
				);
			case "parent":
				return (
					<>
						<InfoRow variant="ID"/>
						<InfoRow variant="Email"/>
						<InfoRow variant="Phone"/>
						<InfoRow variant="Balance"/>
					</>
				);
			default:
				return null;
		}
	}, [user]);

	return (
		<Grid alignItems="center" container item xs={12} style={{margin: user.role === "instructor" ? "-20px 0" : "0",}}>
			<Grid align="left" alignItems="center" container item xs={8}>
				<Grid className="profile-name" item style={{marginRight: 20}}>
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
				align="left"
				alignItems="center"
				style={{
					width: "430px",
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
