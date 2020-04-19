// React Imports
import {connect, useSelector} from "react-redux";
import {useLocation, withRouter} from "react-router-dom";
import React, {useCallback, useState} from "react";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
// Material UI Imports
import AccountsIcon from "@material-ui/icons/Contacts";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
<<<<<<< HEAD
import DashboardIcon from "@material-ui/icons/Dashboard";
import AdminIcon from "@material-ui/icons/Face"
=======
import AdminIcon from "@material-ui/icons/Face";
>>>>>>> development
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles, ThemeProvider as MuiThemeProvider,} from "@material-ui/core/styles";
import EventIcon from "@material-ui/icons/Event";
// Local Component Imports
import "./Navigation.scss";
import CustomTheme from "../../theme/muiTheme";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";
import DateFnsUtils from "@date-io/date-fns";
import {MuiPickersUtilsProvider} from "material-ui-pickers";
import NavBarRoutes from "../Routes/NavBarRoutes";
import LoginPage from "../Authentication/LoginPage";
import {RootRoutes} from "../Routes/RootRoutes";

const useStyles = makeStyles({
	navigationIconStyle: {
		height: "50px",
	},
	navigationLeftList: {
		width: "23%",
	},
});

const Navigation = (props) => {
	const classes = useStyles();
	const {pathname} = useLocation();
	const {token, isAdmin} = useSelector(({auth}) => auth);

<<<<<<< HEAD
    const NavList = isAdmin ? [
            {
                "name": "Dashboard",
                "link": "/",
                "icon": <DashboardIcon />,
            },
            {
                "name": "Scheduler",
                "link": "/scheduler",
                "icon": <EventIcon />,
            },
            {
                "name": "Accounts",
                "link": "/accounts",
                "icon": <AccountsIcon />,
            },
                {
                    "name": "Registration",
                    "link": "/registration",
                    "icon": <AssignmentIcon />,
                },
                {
                    "name": "Admin",
                    "link": "/adminportal",
                    "icon": <AdminIcon/>,
                }
            ] :
        [
            {
                "name": "Dashboard",
                "link": "/",
                "icon": <DashboardIcon />,
            },
            {
                "name": "Scheduler",
                "link": "/scheduler",
                "icon": <EventIcon />,
            },
            {
            "name": "Accounts",
            "link": "/accounts",
            "icon": <AccountsIcon />,
        },
            {
                "name": "Registration",
                "link": "/registration",
                "icon": <AssignmentIcon />,
            },
        ];

    const [mobileOpen, setMobileOpen] = useState(false);

    const drawer = (
        <div className="DrawerList">
            <List className="list">
                {NavList.map((NavItem) => (
                    <ListItem
                        button
                        className={`listItem ${classes.navigationIconStyle}`} 
                        component={NavLinkNoDup}
                        isActive={(match, location) => match
                            || (NavItem.name === "Dashboard" && location.pathname === "/")
                        }
                        key={NavItem.name}
                        to={NavItem.link}>
                        <ListItemIcon className="icon">{NavItem.icon}</ListItemIcon>
                        <ListItemText
                            className="text"
                            primary={NavItem.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );


    const handleDrawerToggle = useCallback(() => {
        setMobileOpen((open) => !open);
    }, []);
=======
	const NavList = isAdmin
		? [
			// {
			//     "name": "Dashboard",
			//     "link": "/",
			//     "icon": <DashboardIcon />,
			// },
			{
				name: "Scheduler",
				link: "/scheduler",
				icon: <EventIcon/>,
			},
			{
				name: "Accounts",
				link: "/accounts",
				icon: <AccountsIcon/>,
			},
			{
				name: "Registration",
				link: "/registration",
				icon: <AssignmentIcon/>,
			},
			{
				name: "Admin",
				link: "/adminportal",
				icon: <AdminIcon/>,
			},
		]
		: [
			{
				name: "Scheduler",
				link: "/scheduler",
				icon: <EventIcon/>,
			},
			{
				name: "Accounts",
				link: "/accounts",
				icon: <AccountsIcon/>,
        },
			{
				name: "Registration",
				link: "/registration",
				icon: <AssignmentIcon/>,
			},
		];
>>>>>>> development

	const [mobileOpen, setMobileOpen] = useState(false);

	const drawer = (
		<div className="DrawerList">
			<List className="list">
				{NavList.map((NavItem) => (
					<ListItem
						button
						className={`listItem ${classes.navigationIconStyle}`}
						component={NavLinkNoDup}
						isActive={(match, location) =>
							match ||
							(NavItem.name === "Scheduler" && location.pathname === "/")
						}
						key={NavItem.name}
						to={NavItem.link}
					>
						<ListItemIcon className="icon">{NavItem.icon}</ListItemIcon>
						<ListItemText className="text" primary={NavItem.name}/>
					</ListItem>
				))}
			</List>
		</div>
	);

	const handleDrawerToggle = useCallback(() => {
		setMobileOpen((open) => !open);
	}, []);

	return (
		<MuiThemeProvider theme={CustomTheme}>
			<div className="Navigation">
				<NavBarRoutes toggleDrawer={handleDrawerToggle}/>
				{
					<nav className="OmouDrawer">
						{token ? (
							<>
								<Hidden implementation="css" smUp>
									<Drawer
										onClose={handleDrawerToggle}
										open={mobileOpen}
										variant="temporary"
										classes={{paper: classes.navigationLeftList}}
									>
										{drawer}
									</Drawer>
								</Hidden>
								<Hidden implementation="css" mdDown>
									<Drawer open variant="permanent">
										{drawer}
									</Drawer>
								</Hidden>
							</>
						) : (
							""
						)}
					</nav>
				}
				{token ? (
					<main className="OmouMain">
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<RootRoutes/>
						</MuiPickersUtilsProvider>
					</main>
				) : (
					<LoginPage/>
				)}
			</div>
		</MuiThemeProvider>
	);
};
const mapStateToProps = (state) => ({
	isAdmin: state.auth.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
	registrationActions: bindActionCreators(registrationActions, dispatch),
});

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
