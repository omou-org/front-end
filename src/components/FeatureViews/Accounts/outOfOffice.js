import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from "@material-ui/core/Grid";
import Checkbox from '@material-ui/core/Checkbox';
import './Accounts.scss';

const styles = {
    minHeight: '80vh',
    maxHeight: '80vh',
};

function OutOfOffice(props) {
    console.log(props);
    const [dialog, setdialog] = useState(props.open);
    const [date, setdate] = useState(null);
    const [checked, setChecked] = useState(true);
    const handleChange = event => {
        setdate(event.target.value);
    };
    const handlecheckChange = event => {
        setChecked(event.target.checked);
    };
    return (
        <Dialog className={"oooDialog"}
            classes={{ paper: styles }}
            aria-labelledby="simple-dialog-title" open={props.open}
            fullWidth={true}
            maxWidth="md"
        >
            <DialogContent>
                <div className="title">
                    Schedule OOO
                </div>
                <div className="instructor">
                    Instructor:
                </div>
                <Grid container item md={12}>
                    <Grid item md={3}>
                        <div className="select">
                            * Select OOO Start Date
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
                        <div className="select">
                            * Select OOO End Date
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
                        <div className="select">
                            * Select OOO Start Date
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
                    <Grid item md={2}>
                        <div className="select">
                            * Select OOO End Date
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
                    <Grid item md={2}>
                        <Grid container>
                            <Grid>
                                <Checkbox
                                    className="checkbox"
                                    checked={checked}
                                    onChange={handlecheckChange}
                                    value="primary"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </Grid>
                            <Grid>
                                <div
                                    className="checkboxText">
                                    All Day
                        </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={5}>

                    </Grid>
                </Grid>
                <Grid container md={12}>
                    <Grid item md={8}>

                    </Grid>
                    <Grid item md={2}>
                        <Button className="button" onClick={props.handleclose}>
                            Cancel
                        </Button>
                        </Grid>
                    <Grid item md={2}>
                        <Button className="button" onClick={props.handleclose}>
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

export default withStyles(styles)(OutOfOffice);
