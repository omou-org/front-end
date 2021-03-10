import React, {useCallback, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

import {makeStyles} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {ResponsiveButton} from "../../../theme/ThemedComponents/Button/ResponsiveButton";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ChatOutlinedIcon from "@material-ui/icons/ChatOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {fullName, USER_TYPES} from "../../../utils";
import {highlightColor, omouBlue} from "../../../theme/muiTheme";
import IconButton from "@material-ui/core/IconButton";
import MobileMenu from "@material-ui/icons/MoreVert";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/es/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccessControlComponent from "../../OmouComponents/AccessControlComponent";
import StudentEnrollmentBackground from "./ClassEnrollmentBackground";

const useStyles = makeStyles((theme) => ({
    "table": {
        "minWidth": 1460,
        [theme.breakpoints.between("md", "lg")]: {
            "minWidth": 910,
        },
        [theme.breakpoints.between("sm", "md")]: {
            "minWidth": 677,
        },
    },
    "menuSelected": {
        "&:hover": {"backgroundColor": highlightColor,
            "color": "#28ABD5"},
        "&:focus": {"backgroundColor": highlightColor},
    },
    "center": {
        "position": "relative",
        "top": "-15px",
    },
    "dropdown": {
        "border": "1px solid #43B5D9",
        "borderRadius": "5px",
    },
    "noBorderBottom": {
        "borderBottom": "none",
    },
    "accordionNotes": {
        "textAlign": "left",
        "display": "inline-block",
        "marginTop": "10px",
    },
    "accordionNotesBorder": {
        "border": "1px #E0E0E0 solid",
        "borderRadius": "25px",
        "margin": "0px 24px 25px 24px",
        "paddingTop": "0px",
    },
    "studentRenderAccordionSpacing": {
        "width": "202px",
    },
    "parentRenderAccordionSpacing": {
        "width": "200px",
    },
    "actionsRenderAccordionSpacing": {
        "width": "200px",
    },
    "iconRenderAccordionSpacing": {
        "position": "relative",
        "left": "6.5em",
    },
    "studentInfoSpacing": {
        "margin": "15px",
    },
}));

const ClassEnrollmentRow = ({
    fullStudentName,
    accountType,
    studentId,
    studentInfo,
    parentAccountType,
    parentId,
    concatFullParentName,
    phoneNumber,
    handleOpenModal,
    enrollmentList,
    enrollmentID,
    courseTitle,
}) => {
    const {location} = useHistory();
    const paramsID = useParams();
    const dispatch = useDispatch();

    const courseID = paramsID.id ? paramsID.id : paramsID.courseID;

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const [studentMenuAnchorEl, setStudentMenuAnchorEl] = useState(null);
    const [unenroll, setUnenroll] = useState({
        "enrollment": null,
        "open": false,
    });

    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleOpen = (e) => {
        e.preventDefault();
        const currentValue = e.currentTarget.value;
        const dataType = e.currentTarget.dataset.type;
        handleOpenModal(currentValue, dataType);
        setAnchorEl(null);
    };

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const handleClickStudentMenu = useCallback(({currentTarget}) => {
        setStudentMenuAnchorEl(currentTarget);
    }, []);

    const handleCloseStudentMenu = useCallback(() => {
        setStudentMenuAnchorEl(null);
    }, []);

    const handleUnenroll = useCallback(
        (enrollment) => () => {
            setUnenroll({
                enrollment,
                "open": true,
            });
        },
        [],
    );

    const closeUnenrollDialog = useCallback(
        (toUnenroll) => () => {
            if (toUnenroll) {
                // TODO: implement graphQL enrollment deletion
            }
            setUnenroll({
                "enrollment": null,
                "open": false,
            });
            setStudentMenuAnchorEl(null);
        },
        [dispatch, unenroll.enrollment],
    );

    return (
        <>
            <Accordion
                classes={{"root": classes.MuiAccordionroot}}
                expanded={expanded}>
                <AccordionSummary
                    aria-controls={`studentinfo-${ studentId }-content`}
                    eventKey={`studentinfo-${ studentId }-details`}
                    expandIcon={
                        <ExpandMoreIcon
                            fontSize="large"
                            onClick={handleChange}
                            style={{"color": omouBlue}} />
                    }
                    id={`studentinfo-${ studentId }-details`}>
                    <TableRow
                        className={
                            location.pathname !==
                                `/coursemanagement/class/${courseID}` &&
                            classes.center
                        }
                        key={fullStudentName}
                        style={{"wordBreak": "break-word"}}>
                        <TableCell
                            className={`${classes.studentRenderAccordionSpacing} ${classes.noBorderBottom}`}
                            component="th"
                            component={Link}
                            scope="row"
                            style={{"textDecoration": "none",
                                "fontWeight": 700}}
                            to={`/accounts/${accountType.toLowerCase()}/${studentId}`}>
                            {fullStudentName}
                        </TableCell>

                        <TableCell
                            className={`${classes.parentRenderAccordionSpacing} ${classes.noBorderBottom}`}
                            component={Link}
                            style={{"textDecoration": "none"}}
                            to={`/accounts/${parentAccountType.toLowerCase()}/${parentId}`}>
                            {concatFullParentName}
                        </TableCell>

                        <TableCell
                            className={`${classes.actionsRenderAccordionSpacing} ${classes.noBorderBottom}`}>
                            {phoneNumber}
                        </TableCell>

                        <TableCell
                            align="right"
                            className={classes.noBorderBottom}
                            padding="none"
                            size="small">
                            <ResponsiveButton
                                aria-controls="simple-menu"
                                aria-haspopup="true"
                                className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}
                                onClick={handleClick}>
                                <MailOutlineIcon
                                    style={{"color": "rgb(112,105,110)"}} />
                            </ResponsiveButton>

                            <AccessControlComponent
                                permittedAccountTypes={[
                                    USER_TYPES.admin,
                                    USER_TYPES.instructor,
                                    USER_TYPES.receptionist,
                                ]}>
                                <Menu
                                    anchorEl={anchorEl}
                                    classes={{"list": classes.dropdown}}
                                    id="simple-menu"
                                    keepMounted
                                    onClose={handleClose}
                                    open={Boolean(anchorEl)}>
                                    <MenuItem
                                        className={classes.menuSelected}
                                        data-type={accountType}
                                        onClick={handleOpen}
                                        value={studentId}>
                                        Email Student
                                    </MenuItem>

                                    <MenuItem
                                        className={classes.menuSelected}
                                        data-type={parentAccountType}
                                        onClick={handleOpen}
                                        value={parentId}>
                                        Email Parent
                                    </MenuItem>
                                </Menu>
                            </AccessControlComponent>
                        </TableCell>

                        {location.pathname ===
                        `/coursemanagement/class/${courseID}` ? (
                            <TableCell
                                    align="right"
                                    className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}
                                    padding="none"
                                    size="small">
                                    <ResponsiveButton
                                    disabled
                                    style={{"border": "none"}}>
                                    <ChatOutlinedIcon
                                            style={{"color": "rgb(112,105,110)"}} />
                                </ResponsiveButton>
                                </TableCell>
                            ) : (
                                <TableCell
                                    className={`${classes.iconRenderAccordionSpacing} ${classes.noBorderBottom}`}>
                                    <IconButton
                                        aria-controls="simple-menu"
                                        aria-haspopup="true"
                                        onClick={handleClickStudentMenu}>
                                        <MobileMenu />
                                    </IconButton>

                                    <Menu
                                        anchorEl={studentMenuAnchorEl}
                                        id="simple-menu"
                                        keepMounted
                                        onClose={handleCloseStudentMenu}
                                        open={studentMenuAnchorEl !== null}>
                                        <MenuItem
                                            component={Link}
                                            onClick={handleCloseStudentMenu}
                                            to={`/accounts/student/${studentId}/${courseID}`}>
                                            View Enrollment
                                        </MenuItem>

                                        <MenuItem
                                            onClick={handleUnenroll(enrollmentID)}>
                                            Unenroll
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            )}

                        <TableCell
                            align="right"
                            className={classes.noBorderBottom}
                            padding="none"
                            size="small" />
                    </TableRow>
                </AccordionSummary>

                <StudentEnrollmentBackground studentInfo={studentInfo} />
            </Accordion>

            <Dialog
                aria-describedby="unenroll-dialog-description"
                aria-labelledby="unenroll-dialog-title"
                className="session-view-modal"
                fullWidth
                maxWidth="xs"
                onClose={closeUnenrollDialog(false)}
                open={unenroll.open}>
                <DialogTitle id="unenroll-dialog-title">
                    Unenroll in {courseTitle}
                </DialogTitle>

                <Divider />

                <DialogContent>
                    <DialogContentText>
                        You are about to unenroll in <b>{courseTitle}</b> for{" "}

                        <b>
                            {unenroll.enrollment &&
                                fullName(
                                    enrollmentList.find(
                                        ({id}) => id == unenroll.enrollment,
                                    ).student.user,
                                )}
                        </b>
                        . Performing this action will credit the remaining
                        enrollment balance back to the parent's account balance.
                        Are you sure you want to unenroll?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <ResponsiveButton
                        color="secondary"
                        onClick={closeUnenrollDialog(true)}
                        variant="outlined">
                        Yes, unenroll
                    </ResponsiveButton>

                    <ResponsiveButton
                        color="primary"
                        onClick={closeUnenrollDialog(false)}
                        variant="outlined">
                        Cancel
                    </ResponsiveButton>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ClassEnrollmentRow;
