import React, {useEffect, useMemo, useState} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";

import Grid from "@material-ui/core/Grid";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NewInstructor from "@material-ui/icons/PersonAdd";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

import "./AdminPortal.scss";
import {initializeRegistration} from "actions/registrationActions";

import {withStyles} from "@material-ui/core";



const StyledMenu = withStyles({
	paper: {
		border: "1px solid #d3d4d5",
	},
})((props) => (
	<Menu
		anchorOrigin={{
			horizontal: "center",
			vertical: "bottom",
		}}
		elevation={0}
		getContentAnchorEl={null}
		transformOrigin={{
			horizontal: "center",
			vertical: "top",
		}}
		{...props}
	/>
));

const handleClick = (setter) => ({ currentTarget }) => {
	setter(currentTarget);
};

const handleClose = (setter) => () => {
	setter(null);
};

const AdminActionCenter = () => {
	const dispatch = useDispatch();
	const { pathname } = useLocation();

	const [userAnchor, setUserAnchor] = useState(null);
	const [courseAnchor, setCourseAnchor] = useState(null);
	const [tuitionAnchor, setTuitionAnchor] = useState(null);
	const [discountAnchor, setDiscountAnchor] = useState(null);
	const tabState = useMemo(
		() => ({
			course: pathname.includes("course"),
			discount: pathname.includes("discount"),
			tuition: pathname.includes("tuition") || pathname.includes("pricing"),
			user: pathname.includes("user"),
		}),
		[pathname]
	);

	useEffect(() => {
		setCourseAnchor(null);
		setTuitionAnchor(null);
	}, [pathname]);

	useEffect(() => {
		dispatch(initializeRegistration());
	}, [dispatch]);

	return (
		<Grid className="admin-actions-wrapper" container spacing={2}>
			<Grid item>
				<ResponsiveButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					className={`button ${tabState.user && "active"}`}
					onClick={handleClick(setUserAnchor)}
					variant='outlined'
				>
					Add Users
				</ResponsiveButton>
			</Grid>
			<Grid item>
				<ResponsiveButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					className={`button ${tabState.course && "active"}`}
					onClick={handleClick(setCourseAnchor)}
					variant='outlined'
				>					
					Manage Course
				</ResponsiveButton>
			</Grid>
			<Grid item>
				<ResponsiveButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					className={`button ${tabState.course && "active"}`}
					component={NavLink} 
					to="/adminportal/actionlog"
					variant='outlined'
				>
					Action Log
				</ResponsiveButton>
			</Grid>
			{/*<Grid item>*/}
			{/*	<Button*/}
			{/*		aria-controls="simple-menu"*/}
			{/*		aria-haspopup="true"*/}
			{/*		className={`button ${tabState.tuition && "active"}`}*/}
			{/*		onClick={handleClick(setTuitionAnchor)}*/}
			{/*	>*/}
			{/*		<TuitionIcon className="admin-action-icon"/>*/}
			{/*		Manage Tuition*/}
			{/*	</Button>*/}
			{/*</Grid>*/}
			{/*<Grid item>*/}
			{/*	<Button*/}
			{/*		aria-controls="simple-menu"*/}
			{/*		aria-haspopup="true"*/}
			{/*		className={`button ${tabState.discount && "active"}`}*/}
			{/*		onClick={handleClick(setDiscountAnchor)}*/}
			{/*	>*/}
			{/*		<DiscountIcon className="admin-action-icon"/>*/}
			{/*		Manage Discounts*/}
			{/*	</Button>*/}
			{/*</Grid>*/}
			<StyledMenu
				anchorEl={userAnchor}
				keepMounted
				onClose={handleClose(setUserAnchor)}
				open={Boolean(userAnchor)}
			>
				<MenuItem component={NavLink} to="/form/instructor">
					<ListItemText primary="ADD INSTRUCTOR"/>
				</MenuItem>
				<MenuItem component={NavLink} to="/form/admin">
					<ListItemText primary="ADD ADMIN" />
				</MenuItem>
			</StyledMenu>
			<StyledMenu
				anchorEl={courseAnchor}
				keepMounted
				onClose={handleClose(setCourseAnchor)}
				open={Boolean(courseAnchor)}
			>
				<MenuItem component={NavLink} to="/form/course_details">
					<ListItemText primary="NEW COURSE" />
				</MenuItem>
				<MenuItem
					component={NavLink}
					to="/adminportal/management"
				>
					<ListItemText primary="MANAGE BUSINESS"/>
				</MenuItem>
			</StyledMenu>
			{/*<StyledMenu*/}
			{/*	anchorEl={tuitionAnchor}*/}
			{/*	keepMounted*/}
			{/*	onClose={handleClose(setTuitionAnchor)}*/}
			{/*	open={Boolean(tuitionAnchor)}*/}
			{/*>*/}
			{/*	<MenuItem component={NavLink} to="/adminportal/form/pricing">*/}
			{/*		<ListItemText primary="SET TUITION RULES"/>*/}
			{/*	</MenuItem>*/}
			{/*	<MenuItem component={NavLink} to="/adminportal/tuition-rules">*/}
			{/*		<ListItemText primary="TUITION RULES"/>*/}
			{/*	</MenuItem>*/}
			{/*</StyledMenu>*/}
			{/*<StyledMenu*/}
			{/*	anchorEl={discountAnchor}*/}
			{/*	keepMounted*/}
			{/*	onClose={handleClose(setDiscountAnchor)}*/}
			{/*	open={Boolean(discountAnchor)}*/}
			{/*>*/}
			{/*	<MenuItem component={NavLink} to="/adminportal/form/discount">*/}
			{/*		<ListItemText primary="SET DISCOUNTS"/>*/}
			{/*	</MenuItem>*/}
			{/*	<MenuItem component={NavLink} to="/adminportal/manage-discounts">*/}
			{/*		<ListItemText primary="DISCOUNTS"/>*/}
			{/*	</MenuItem>*/}
			{/*</StyledMenu>*/}
		</Grid>
	);
};

AdminActionCenter.propTypes = {};

export default AdminActionCenter;
