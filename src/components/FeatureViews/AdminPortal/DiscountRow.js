import React, {useMemo, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import Switch from "@material-ui/core/es/Switch";
import IconButton from "@material-ui/core/es/IconButton";
import Options from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/es/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/es/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/es/Button/Button";
import DialogContent from "@material-ui/core/es/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";

function DiscountRow({discount, type}){
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );
    let [anchorEl, setAnchorEl ] = useState(null);
    let [open, setOpen] = useState(false);
    let [deleteWarning, setDeleteWarning] = useState(false);
    const handleToggle = () => (e) =>{
        e.preventDefault();
        setOpen(!open);
    };

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };

    const handleDelete = event =>{
        setDeleteWarning(!deleteWarning);
    };

    const handleDeleteDiscount = (discountID, discountType) => event => {
        event.preventDefault();
        switch(discountType){
            case "MultiCourse":{
                api.deleteMultiCourseDiscount(discountID);
                break;
            }
            case "DateRange":{
                api.deleteDateRangeDiscount(discountID);
                break;
            }
            case "PaymentDiscount":{
                api.deletePaymentMethodDiscount(discountID);
                break;
            }
        }
    };

    return (<Grid item xs={12} md={12} key={discount.id}>
        <Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <Typography align={'left'}>
                        {discount.name}
                    </Typography>
                </Grid>
                <Grid item xs={5} md={5}>
                    <Typography align={'left'}>
                        {discount.description}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                    <Switch
                        checked={discount.active}
                        value={`${discount.name} is ${discount.active ? "active":"inactive"}`}/>
                </Grid>
                <Grid item xs={2} md={2}>
                    <IconButton
                        aria-label={"more"}
                        aria-controls={"long-menu"}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <Options/>
                    </IconButton>
                    <Menu
                        id={"long-menu"}
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClick={handleToggle()}
                    >
                        <MenuItem>
                            <Edit/>
                            EDIT
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                            <Delete/>
                            DELETE
                        </MenuItem>
                    </Menu>
                </Grid>
            </Grid>
        </Paper>
        <Dialog
            open={deleteWarning}
            onClose={handleDelete}
        >
            <DialogContent>
                <DialogTitle>
                    Are you sure you delete {discount.name}?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleDeleteDiscount(discount.id, type)}>Yes, DELETE</Button>
                    <Button onClick={handleDelete}>No, Exit</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </Grid>)
}

export default DiscountRow;