import React, {useMemo, useState, useEffect} from "react";
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
import TextField from "@material-ui/core/TextField";
import Done from "@material-ui/icons/Done";
import {DatePicker } from "material-ui-pickers";
import Select from "@material-ui/core/Select";
import {dateParser} from "../../Form/FormUtils";
import { withStyles } from '@material-ui/core/styles';
import blue from "@material-ui/core/es/colors/blue";

const styles = theme => ({
    colorSwitchBase: {
        color: blue[300],
        '&$colorChecked':{
            color: blue[500],
            '& + $colorBar': {
                backgroundColor: blue[500],
            }
        }
    },
    colorBar: {},
    colorChecked: {},
});

function DiscountRow({discount, type, classes}){
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
    let [DiscountFields, setDiscountFields] = useState(null);
    let [editing, setEditing] = useState(false);
    const BaseFields = ["Name", "Description", "Active"];

    const handleToggle = () => (e) =>{
        e.preventDefault();
        setOpen(!open);
    };

    const parseAmountType = {
        "Fixed":"fixed",
        "Percent":"percent",
        "fixed":"Fixed",
        "percent":"Percent",
    };

    useEffect(()=>{
        setDiscountFields(()=>{
            const {name, description, amount_type, amount} = discount;
            const baseDiscount = {
                "Name": { value:name, type:"text"},
                "Description": { value: description, type:"text"},
            };
            const discountAmount = {
                "Amount": { value: amount, type: "number" },
                "Amount Type": {
                    value: parseAmountType[amount_type],
                    type: "select",
                    options: ["Fixed", "Percent"],
                },
            }
            switch(type){
                case "MultiCourse":{
                    return {
                        ...baseDiscount,
                        "Minimum number of sessions": { value: discount.num_sessions, type: "text"},
                        ...discountAmount,
                    }
                }
                case "DateRange":{
                    return {
                        ...baseDiscount,
                        "Discount Start Date": { value: discount.start_date, type: "date"},
                        "Discount End Date": { value: discount.end_date, type: "date"},
                        ...discountAmount,
                    }
                }
                case "PaymentMethod":{
                    return {
                        ...baseDiscount,
                        "Payment Method": {
                            value: discount.payment_method,
                            type: "select",
                            options: ["Cash", "Check", "Credit Card", "International Credit Card"],
                        },
                        ...discountAmount,
                    }
                }
            }
        })
    },[]);

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
            case "PaymentMethod":{
                api.deletePaymentMethodDiscount(discountID);
                break;
            }
        }
    };

    const handleDiscountToggle = (discountID, discountType, active) => event => {
        event.preventDefault();
        const toggledActive = { active:!active };
        switch(discountType){
            case "MultiCourse":{
                api.patchMultiCourseDiscount(discountID, toggledActive);
                break;
            }
            case "DateRange":{
                api.patchDateRangeDiscount(discountID, toggledActive);
                break;
            }
            case "PaymentMethod":{
                api.patchPaymentMethodDiscount(discountID, toggledActive);
                break;
            }
        }
    };

    const viewDiscount = () => {
        return (<Grid container alignItems={"center"}>
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
                    onClick={handleDiscountToggle(discount.id, type, discount.active)}
                    checked={discount.active}
                    value={`${discount.name} is ${discount.active ? "active":"inactive"}`}
                    classes={{
                        switchBase: classes.colorSwitchBase,
                        checked: classes.colorChecked,
                        bar: classes.colorBar,
                    }}
                />
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
                    <MenuItem onClick={handleEdit}>
                        <Edit/>
                        EDIT
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <Delete/>
                        DELETE
                    </MenuItem>
                </Menu>
            </Grid>
        </Grid>);
    };

    const handleEdit = event => {
        event.preventDefault();
        setEditing(!editing);
        switch(type){
            case "MultiCourse":{
                let data = {
                    name: DiscountFields["Name"].value,
                    description: DiscountFields["Description"].value,
                    num_sessions: DiscountFields["Minimum number of sessions"].value,
                    amount: DiscountFields["Amount"].value,
                    amount_type: parseAmountType[DiscountFields["Amount Type"].value],
                };
                api.patchMultiCourseDiscount(discount.id, data);
                break;
            }
            case "DateRange":{
                let data = {
                    name: DiscountFields["Name"].value,
                    description: DiscountFields["Description"].value,
                    amount: DiscountFields["Amount"].value,
                    amount_type: parseAmountType[DiscountFields["Amount Type"].value],
                    start_date: dateParser(DiscountFields["Discount Start Date"].value).substring(0,10),
                    end_date: dateParser(DiscountFields["Discount End Date"].value).substring(0,10),
                };
                api.patchDateRangeDiscount(discount.id, data);
                break;
            }
            case "PaymentMethod":{
                let data = {
                    name: DiscountFields["Name"].value,
                    description: DiscountFields["Description"].value,
                    amount: DiscountFields["Amount"].value,
                    amount_type: parseAmountType[DiscountFields["Amount Type"].value],
                    payment_method: DiscountFields["Payment Method"].value,
                };
                api.patchPaymentMethodDiscount(discount.id, data);
                break;
            }
        }
    };

    const onDateChange = (field, fieldName) => date => {
        setDiscountFields({
                ...DiscountFields,
                [fieldName]: {
                    ...field,
                    value: date,
                }
            })
    };

    const handleTextChange = (field, fieldName) => event => {
        setDiscountFields({
            ...DiscountFields,
            [fieldName]: {
                ...field,
                value: event.target.value,
            }
        });
    };

    const renderField = (field, fieldName) => {
        switch(field.type){
            case "text":
                return <TextField
                    value={field.value}
                    onChange={handleTextChange(field, fieldName)}
                />;
            case "number":
                return <TextField
                    type={"number"}
                    value={field.value}
                    onChange={handleTextChange(field, fieldName)}
                />;
            case "date":
                return <DatePicker
                        margin="normal"
                        label={field.name}
                        value={field.value}
                        onChange={onDateChange(field, fieldName)}
                        openTo={"day"}
                        format="MM/dd/yyyy"
                        views={["year", "month", "date"]}
                    />;
            case "select":
                return <Select
                    value={field.value}
                    onChange={handleTextChange(field, fieldName)}
                >
                    {
                        field.options.map(option => (
                            <MenuItem
                                key={option}
                                value={option}
                            >
                                {option}
                            </MenuItem>
                        ))
                    }
                </Select>
        }
    };

    const editDiscount = () => {
        return (<>
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <TextField
                        value={DiscountFields["Name"].value}
                        onChange={handleTextChange(DiscountFields["Name"], "Name")}
                    />
                </Grid>
                <Grid item xs={5} md={5}>
                    <TextField
                        value={DiscountFields["Description"].value}
                        onChange={handleTextChange(DiscountFields["Description"], "Description")}
                    />
                </Grid>
                <Grid item xs={2} md={2}>
                    <Switch
                        onClick={handleDiscountToggle(discount.id, type, discount.active)}
                        checked={discount.active}
                        value={`${discount.name} is ${discount.active ? "active":"inactive"}`}/>
                </Grid>
                <Grid item xs={2} md={2}>
                    <IconButton
                        aria-label={"more"}
                        aria-controls={"long-menu"}
                        aria-haspopup="true"
                        onClick={handleEdit}
                    >
                        <Done/>
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container spacing={16} alignItems={"center"}>
                {
                    Object.entries(DiscountFields)
                        .filter( ([fieldName, field]) => BaseFields.indexOf(fieldName) < 0 )
                        .map( ([fieldName, field]) => {
                            return (
                                <Grid item>
                                    {
                                        renderField(field, fieldName)
                                    }
                                </Grid>
                            )
                        })
                }
            </Grid>
        </>)
    };

    return (<Grid item xs={12} md={12} key={discount.id}>
        <Paper square={true} className={"category-row"} >
            {
                editing ? editDiscount() : viewDiscount()
            }
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

export default withStyles(styles)(DiscountRow);