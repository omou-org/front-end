import React, { useCallback, useEffect, useMemo, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import Moment from "react-moment";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Pagination from '@material-ui/lab/Pagination';
import Checkbox from "@material-ui/core/Checkbox";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import SwapVertIcon from '@material-ui/icons/SwapVert';
import gql from "graphql-tag";
import moment from "moment";
import Loading from "../../OmouComponents/Loading";
import { useQuery } from "@apollo/react-hooks";
import { DateRange } from "react-date-range";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import { fullName } from "../../../utils";

const GET_LOGS = gql`
    query GetLogs ($action: String,
        $adminType: String,
        $page: Int,
        $pageSize: Int,
        $sort: String,
        $objectType: String,
        $userId: ID!,
        $startDateTime: String,
        $endDateTime: String){
        logs(action:$action,
            adminType:
            $adminType,
            page: $page,
            pageSize: $pageSize,
            sort: $sort,
            objectType: $objectType,
            userId: $userId,
            startDateTime: $startDateTime,
            endDateTime: $endDateTime){
            results {
                date
                userId
                adminType
                action
                objectType
                objectRepr
            }
            total
        }
            admins {
                user {
                id
                firstName
                email
                lastName
            }
        }
    }
`

const useStyles = makeStyles({
    root: {
        display: "block",
        margin: "auto",
        padding: 5,
        width: 115,
        verticalAlign: 'middle'
    },
    MuiInputBase: {
        padding: 0
    }
});

const ActionLog = () => {
    const classes = useStyles();
    const [userType, setUserType] = useState(null);
    const [adminType, setAdminType] = useState("");
    const [actionType, setActionType] = useState("");
    const [objectType, setObjectType] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [state, setState] = useState([
        {
            startDate: moment().toDate(),
            endDate: moment().toDate(),
            key: 'selection'
        }
    ]);
    const [currentSort, setCurrentSort] = useState({
        "sort": "",
        "clicked": false,
    });
    const { data, loading, error } = useQuery(GET_LOGS, {
        variables:
        {
            action: actionType.toLowerCase(),
            adminType: adminType.toLowerCase(),
            endDateTime: endDate,
            page: currentPage,
            pageSize: pageSize,
            startDateTime: startDate,
            sort: currentSort.sort,
            objectType: objectType.toLowerCase(),
            userId: currentId,
        }
    });
    const adminOptions = ["Owner", "Receptionist", "Assistant"];
    const actionOptions = ["Add", "Edit", "Delete"]
    const objectOptions = ["Student", "Admin", "Parent", "Instructor", "Payment", "Registration", "Tutoring", "Course", "Discount", "Price Rules"]

    if (loading) return <Loading />;
    // if (error) return <div>error</div>;

    const renderChip = (action) => ({
        "Edit": <Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#FFDD59" }} label="Edit" />,
        "Add": <Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#78E08F" }} label="Add" />,
        "Delete": <Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#FF7675" }} label="Delete" />,
    }[action]);

    const handleSelection = (setValue) => (event) => {
        const value = event.target.value;
        setValue(value);
    }

    const handleUserSelection = (event) => {
        setUserType(event.target.value);
        setCurrentId(data.admins.filter(user => (user.user.id === event.target.value))[0].user.id);
    }

    const resetFilters = () => {
        setAdminType("");
        setActionType("");
        setObjectType("");
        setUserType("");
        setCurrentSort({
            "sort": "",
            "clicked": false,
        });
        setStartDate("");
        setEndDate("");
    }

    const handleSaveDateRange = () => {
        setOpenCalendar(false);
        setStartDate(state[0].startDate.toISOString())
        setEndDate(state[0].endDate.toISOString())
    }

    const handleDateRangeCalendarChange = (item) => {
        const newDateRange = item.selection;
        setState([newDateRange]);
    }

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleSort = (sortType) => (event) => {
        event.preventDefault();
        currentSort.clicked ?
            setCurrentSort({ "sort": `${sortType}_desc`, "clicked": !currentSort.clicked }) :
            setCurrentSort({ "sort": `${sortType}_asc`, "clicked": !currentSort.clicked })
    }
    const renderName = (actionId) => {
        const selectedUser = data.admins.find(user => (user.user.id == actionId));
        return (<div>{fullName(selectedUser.user)}</div>)
    }

    return (
        <>
            <Dialog open={openCalendar} onClose={handleSaveDateRange}>
                <DateRange
                    editableDateInputs={true}
                    onChange={handleDateRangeCalendarChange}
                    moveRangeOnFirstSelection={false}
                    ranges={state}
                />
                <DialogActions>
                    <Button onClick={handleSaveDateRange} color="primary">
                        Save & Close
						</Button>
                </DialogActions>
            </Dialog>
            <div style={{ textAlign: "right", padding: 0 }}>
                <Button onClick={resetFilters}>
                    Reset All Filters
                </Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: 270 }}>
                            <Grid container>
                                <Grid>
                                    Timestamp
                                </Grid>
                                <Grid>
                                    <SwapVertIcon onClick={handleSort("date")} style={{ color: "grey" }} />
                                </Grid>
                            </Grid>
                            <Grid container >
                                <Grid>
                                    From <TextField
                                        variant="outlined"
                                        value={startDate ? moment(startDate).format("MM/DD/YYYY") : moment(state[0].startDate.toISOString()).format("MM/DD/YYYY")}
                                        onClick={() => setOpenCalendar(true)}
                                        inputProps={{
                                            style: {
                                                padding: 5
                                            }
                                        }}
                                        style={{ paddingLeft: 5, paddingRight: 5, width: 90 }} />
                                </Grid>
                                <Grid>
                                    To <TextField
                                        value={endDate ? moment(endDate).format("MM/DD/YYYY") : moment(state[0].endDate.toISOString()).format("MM/DD/YYYY")}
                                        variant="outlined"
                                        onClick={() => setOpenCalendar(true)}
                                        inputProps={{
                                            style: {
                                                padding: 5
                                            }
                                        }}
                                        style={{ paddingLeft: 5, width: 90 }} />
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 130 }}>
                            <Grid container>
                                <Grid>
                                    User
                                </Grid>
                                <Grid>
                                    <SwapVertIcon onClick={handleSort("user")} style={{ color: "grey" }} />
                                </Grid>
                            </Grid>
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel
                                        shrink={false}
                                        style={{ lineHeight: "5px" }}
                                        margin="dense" >
                                        {!userType && "User Type"}
                                    </InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"

                                        value={userType}
                                        onChange={handleUserSelection}
                                        style={{ width: 130 }}
                                        classes={{
                                            outlined: classes.outlined,
                                            root: classes.root,
                                            "MuiInputBase-input": classes.MuiInputBase
                                        }}
                                    >
                                        {data.admins.map((userType) =>
                                            (<MenuItem key={userType} value={userType.user.id}>
                                                {fullName(userType.user)}
                                            </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 130 }}>
                            <Grid container>
                                <Grid>
                                    Admin Type
                                </Grid>
                                <Grid>
                                    <SwapVertIcon onClick={handleSort("admin")} style={{ color: "grey" }} />
                                </Grid>
                            </Grid>
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel
                                        shrink={false}
                                        id="label"
                                        style={{ lineHeight: "5px" }}
                                        margin="dense" >
                                        {!adminType && "Profile Type"}
                                    </InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={adminType}
                                        onChange={handleSelection(setAdminType)}
                                        style={{ width: 130 }}
                                        classes={{
                                            outlined: classes.outlined,
                                            root: classes.root,
                                            "MuiInputBase-input": classes.MuiInputBase
                                        }}
                                    >
                                        {adminOptions.map((adminType) =>
                                            (<MenuItem key={adminType} value={adminType}>
                                                {adminType}
                                            </MenuItem>)
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 130 }}>
                            <Grid container>
                                <Grid>
                                    Action
                                </Grid>
                                <Grid>
                                    <SwapVertIcon onClick={handleSort("action")} style={{ color: "grey" }} />
                                </Grid>
                            </Grid>
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel
                                        shrink={false}
                                        style={{ lineHeight: "5px" }}
                                        margin="dense">
                                        {!actionType && "Action Type"}
                                    </InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={actionType}
                                        onChange={handleSelection(setActionType)}
                                        style={{ width: 130 }}
                                        classes={{
                                            outlined: classes.outlined,
                                            root: classes.root,
                                            "MuiInputBase-input": classes.MuiInputBase
                                        }}
                                    >
                                        {actionOptions.map((actionType) =>
                                            (<MenuItem key={actionType} value={actionType}>
                                                {actionType}
                                            </MenuItem>)
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 115 }}>
                            <Grid container>
                                <Grid>
                                    Object
                                </Grid>
                                <Grid>
                                    <SwapVertIcon onClick={handleSort("object")} style={{ color: "grey" }} />
                                </Grid>
                            </Grid>
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel
                                        shrink={false}
                                        style={{ lineHeight: "5px" }}
                                        margin="dense" >
                                        {!objectType && "Object Type"}
                                    </InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={objectType}
                                        onChange={handleSelection(setObjectType)}
                                        style={{ width: 130 }}
                                        classes={{
                                            outlined: classes.outlined,
                                            root: classes.root,
                                            "MuiInputBase-input": classes.MuiInputBase
                                        }}
                                    >
                                        {objectOptions.map((objectType) =>
                                            (<MenuItem key={objectType} value={objectType}>
                                                {objectType}
                                            </MenuItem>)
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            <Grid style={{paddingBottom:35}}>
                                Details
                            </Grid>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.logs.results.length == 0
                        ? (<TableRow>
                            <TableCell>
                                {//ASK DESIGN FOR STYLING ON THIS
                                }
                                There was no match found for your data
                                </TableCell>
                        </TableRow>)
                        : data.logs.results.map((actionItem) => (
                                <TableRow>
                                    <TableCell>
                                        <Moment
                                            date={actionItem.date}
                                            format="dddd, M/D/YYYY h:mm a"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {renderName(actionItem.userId)}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ textTransform: "capitalize" }}>
                                            {actionItem.adminType.toLowerCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {renderChip(actionItem.action)}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ textTransform: "capitalize" }}>
                                            {actionItem.objectType}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {actionItem.objectRepr}
                                    </TableCell>
                                </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Pagination
                    count={Math.ceil(data.logs.total / pageSize)}
                    onChange={handlePageChange}
                    style={{
                        paddingTop: 50,
                    }}
                />
            </div>
        </>)
}
ActionLog.propTypes = {}

export default ActionLog;
