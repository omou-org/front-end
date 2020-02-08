import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from "@material-ui/core/Grid";
import './Accounts.scss';


function OutOfOffice(props) {
    console.log(props);
    const [Dialog, setDialog] = useState(props.open);
    const [Date, setDate] = useState(null);
    const closeDialog = () => {
        setDialog(false);
    };
    const handleChange = event => {
        setDate(event.target.value);
    };

    return (
        <Dialog className={"oooDialog"}
            aria-labelledby="simple-dialog-title" open={props.open}
            fullWidth={true}
            onClose={closeDialog}
            contentStyle={{width: "100%", maxWidth: "none"}}
            >
            <DialogContent>
                <div>
                    Schedule OOO
                </div>
                <div>
                    Instructor:
                </div>
                <Grid container item md={12}>
                    <Grid item md={3}>
                        <div>
                            Select OOO Start Date
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO End Date
                            </div>
                            <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO Start Date
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO End Date
                            </div>
                            <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={6}></Grid>
                </Grid>
                <Grid container >
                    <Grid align="right">
                        <Button onClick={closeDialog}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid align="right">
                        <Button onClick={closeDialog}>
                            Save OOO
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );


}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default OutOfOffice;
