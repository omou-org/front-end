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
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Checkbox from "@material-ui/core/Checkbox";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";

import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { set } from "date-fns";

const GET_ADMINS = gql`
    query GetAdmins {
        __typename
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

const GET_LOGS = gql`
    query GetLogs {
        logs {
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
    //const { data, loading } = useQuery(GET_LOGS);


    const classes = useStyles();
    const [userType, setUserType] = useState("");
    const [adminType, setAdminType] = useState("");
    const [actionType, setActionType] = useState("");
    const [objectType, setObjectType] = useState("");
    const [fetchAdmins] = useLazyQuery(GET_ADMINS, {
        "onCompleted": (data) => {
            setUserOptions(data.admins)
            console.log(data.admins);
        },
    });
    const [userOptions, setUserOptions] = useState([{ user: { firstName: "", lastName: "", id: "-1" } }])
    console.log(userOptions);
    const adminOptions = ["Owner", "Receptionist", "Assistant"];
    const actionOptions = ["Add", "Edit", "Delete"]
    const objectOptions = ["Student", "Admin", "Parent", "Instructor", "Payment", "Registration", "Tutoring", "Course", "Discount", "Price Rules"]
    const testData = {

        "results": [
            {
                "date": "2020-07-27T04:53:17.614317+00:00",
                "userId": "16",
                "adminType": "OWNER",
                "action": "Delete",
                "objectType": "price rule",
                "objectRepr": "7"
            },
            {
                "date": "2020-07-27T04:53:06.132332+00:00",
                "userId": "1",
                "adminType": "OWNER",
                "action": "Edit",
                "objectType": "price rule",
                "objectRepr": "7"
            },
            {
                "date": "2020-07-27T04:52:48.676183+00:00",
                "userId": "16",
                "adminType": "OWNER",
                "action": "Add",
                "objectType": "price rule",
                "objectRepr": "7"
            },
            {
                "date": "2020-07-27T04:51:43.067927+00:00",
                "userId": "16",
                "adminType": "OWNER",
                "action": "Add",
                "objectType": "instructor",
                "objectRepr": "Instructor: Bruce Wayne"
            }
        ],
        "total": 4
    }
    useEffect(() => {
        fetchAdmins()
    }, [])

    const renderChip = (action) => {
        switch (action) {
            case "Edit":
                return (<Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#FFDD59" }} label="Edit"></Chip>)
            case "Add":
                return (<Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#78E08F" }} label="Add"></Chip>)
            case "Delete":
                return (<Chip style={{ borderRadius: 3, width: 70, backgroundColor: "#FF7675" }} label="Delete"></Chip>)
        }
    }

    const handleSelection = (event) => {
        const value = event.target.value;
        console.log(event);
        if (adminOptions.indexOf(value) > -1) {
            setAdminType(value);
        }
        if (actionOptions.indexOf(value) > -1) {
            setActionType(value);
        }
        if (objectOptions.indexOf(value) > -1) {
            setObjectType(value);
        }
        if (userOptions.indexOf(value) > -1) {
            setUserType(value);
        }
    }

    const resetFilters = () => {
        setAdminType("");
        setActionType("");
        setObjectType("");
        setUserType("");
    }

    console.log(Object.values(testData.results))
    console.log(testData.results);
    return (
        <>
            <div style={{ textAlign: "right", padding: 0 }}>
                <Button onClick={resetFilters}>
                    Reset All Filters
                </Button>
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: 250 }}>
                            <Grid container>
                                <Grid>
                                    Timestamp
                                </Grid>
                            </Grid>
                            <Grid container >
                                <Grid>
                                    From <TextField
                                        variant="outlined"
                                        inputProps={{
                                            style: {
                                                padding: 5
                                            }
                                        }}
                                        style={{ paddingLeft: 5, paddingRight: 5, width: 80 }} />
                                </Grid>
                                <Grid>
                                    To <TextField
                                        variant="outlined"
                                        inputProps={{
                                            style: {
                                                padding: 5
                                            }
                                        }}
                                        style={{ paddingLeft: 5, width: 80 }} />
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 150 }}>
                            User
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel shrink={false} style={{ lineHeight: "5px" }} margin="dense" >{userType ? "" : "User Type"}</InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={userType}
                                        onChange={handleSelection}
                                        style={{ width: 150 }}
                                        classes={{
                                            outlined: classes.outlined,
                                            root: classes.root,
                                            "MuiInputBase-input": classes.MuiInputBase
                                        }}
                                    >
                                        {userOptions.map((userType) =>
                                            (<MenuItem key={userType} value={userType}>
                                                {userType.user.firstName} {userType.user.lastName}
                                            </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </TableCell>
                        <TableCell style={{ width: 130 }}>
                            Admin Type
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel shrink={false} id="label" style={{ lineHeight: "5px" }} margin="dense" >{adminType ? "" : "Profile Type"}</InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={adminType}
                                        onChange={handleSelection}
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
                            Action
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel shrink={false} style={{ lineHeight: "5px" }} margin="dense" >{actionType ? "" : "Action Type"}</InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={actionType}
                                        onChange={handleSelection}
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
                            Object
                            <Grid>
                                <FormControl
                                    variant="outlined"
                                >
                                    <InputLabel shrink={false} style={{ lineHeight: "5px" }} margin="dense" >{objectType ? "" : "Object Type"}</InputLabel>
                                    <Select
                                        id="select"
                                        labelId="label"
                                        value={objectType}
                                        onChange={handleSelection}
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
                            Details
                            <Grid>
                                <br />
                            </Grid>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {testData.results.map((actionItem) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Moment
                                        date={actionItem.date}
                                        format="dddd, M/D/YYYY h:mm a"
                                    />
                                </TableCell>
                                <TableCell>
                                    {userOptions.map((userType) => {
                                        if (userType.user.id == actionItem.userId) {
                                            return (`${userType.user.firstName} ${userType.user.lastName}`)
                                        }
                                    })}
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
                        )
                    })}
                </TableBody>
            </Table>
        </>)
}
ActionLog.propTypes = {}

export default ActionLog;