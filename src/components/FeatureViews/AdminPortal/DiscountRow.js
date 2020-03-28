import React, {useCallback, useEffect, useMemo, useState} from "react";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";

import blue from "@material-ui/core/colors/blue";
import Button from "@material-ui/core/Button/Button";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Done from "@material-ui/icons/Done";
import Edit from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Options from "@material-ui/icons/MoreVert";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

import * as adminActions from "actions/adminActions";
import {dateParser} from "../../Form/FormUtils";
import {DatePicker} from "material-ui-pickers";

const styles = () => ({
    "colorBar": {},
    "colorChecked": {},
    "colorSwitchBase": {
        "&$colorChecked": {
            "& + $colorBar": {
                "backgroundColor": blue[500],
            },
            "color": blue[500],
        },
        "color": blue[300],
    },
});

const parseAmountType = {
    "Fixed": "fixed",
    "Percent": "percent",
    "fixed": "Fixed",
    "percent": "Percent",
};

const DiscountRow = ({discount, type, classes}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => bindActionCreators(adminActions, dispatch),
        [dispatch]
    );
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [deleteWarning, setDeleteWarning] = useState(false);
    const [DiscountFields, setDiscountFields] = useState(null);
    const [editing, setEditing] = useState(false);
    const BaseFields = ["Name", "Description", "Active"];

    const handleToggleEdit = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, []);

    useEffect(() => {
        setDiscountFields(() => {
            const {name, description, amount_type, amount} = discount;
            const baseDiscount = {
                "Description": {
                    "type": "text",
                    "value": description,
                },
                "Name": {
                    "type": "text",
                    "value": name,
                },
            };
            const discountAmount = {
                "Amount": {
                    "type": "number",
                    "value": amount,
                },
                "Amount Type": {
                    "options": ["Fixed", "Percent"],
                    "type": "select",
                    "value": parseAmountType[amount_type],
                },
            };
            switch (type) {
                case "MultiCourse": {
                    return {
                        ...baseDiscount,
                        "Minimum number of sessions": {
                            "type": "text",
                            "value": discount.num_sessions,
                        },
                        ...discountAmount,
                    };
                }
                case "DateRange": {
                    return {
                        ...baseDiscount,
                        "Discount End Date": {
                            "type": "date",
                            "value": discount.end_date,
                        },
                        "Discount Start Date": {
                            "type": "date",
                            "value": discount.start_date,
                        },
                        ...discountAmount,
                    };
                }
                case "PaymentMethod": {
                    return {
                        ...baseDiscount,
                        "Payment Method": {
                            "options": [
                                "Cash",
                                "Check",
                                "Credit Card",
                                "International Credit Card",
                            ],
                            "type": "select",
                            "value": discount.payment_method,
                        },
                        ...discountAmount,
                    };
                }
                default:
                    return baseDiscount;
            }
        });
    }, [discount, type]);

    const handleClick = useCallback(({currentTarget}) => {
        setAnchorEl(currentTarget);
        setOpen((prevOpen) => !prevOpen);
    }, []);

    const handleDelete = useCallback(() => {
        setDeleteWarning((prevWarning) => !prevWarning);
    }, []);

    const handleDeleteDiscount = useCallback(
        (discountID, discountType) => () => {
            switch (discountType) {
                case "MultiCourse": {
                    api.deleteMultiCourseDiscount(discountID);
                    break;
                }
                case "DateRange": {
                    api.deleteDateRangeDiscount(discountID);
                    break;
                }
                case "PaymentMethod": {
                    api.deletePaymentMethodDiscount(discountID);
                    break;
                }
                // no default
            }
        }, [api]
    );

    const handleDiscountToggleActive = (discountID, discountType, active) =>
        () => {
            const toggledActive = {"active": !active};
            switch (discountType) {
                case "MultiCourse":
                    api.patchMultiCourseDiscount(discountID, toggledActive);
                    break;
                case "DateRange":
                    api.patchDateRangeDiscount(discountID, toggledActive);
                    break;
                case "PaymentMethod":
                    api.patchPaymentMethodDiscount(discountID, toggledActive);
                    break;
                // no default
            }
        };

    const handleEdit = useCallback((event) => {
        event.preventDefault();
        setEditing(!editing);
        const updatedDiscount = {
            "amount": DiscountFields.Amount.value,
            "amount_type": parseAmountType[DiscountFields["Amount Type"].value],
            "description": DiscountFields.Description.value,
            "name": DiscountFields.Name.value,
        };
        switch (type) {
            case "MultiCourse":
                api.patchMultiCourseDiscount(discount.id, {
                    ...updatedDiscount,
                    "num_sessions":
                        DiscountFields["Minimum number of sessions"].value,
                });
                break;
            case "DateRange":
                api.patchDateRangeDiscount(discount.id, {
                    ...updatedDiscount,
                    "end_date": dateParser(
                        DiscountFields["Discount End Date"].value
                    ).substring(0, 10),
                    "start_date": dateParser(
                        DiscountFields["Discount Start Date"].value
                    ).substring(0, 10),
                });
                break;
            case "PaymentMethod":
                api.patchPaymentMethodDiscount(discount.id, {
                    ...updatedDiscount,
                    "payment_method": DiscountFields["Payment Method"].value,
                });
                break;
            // no default
        }
    }, [DiscountFields, api, discount.id, editing, type]);

    const onDateChange = useCallback((field, fieldName) => (date) => {
        setDiscountFields((prevFields) => ({
            ...prevFields,
            [fieldName]: {
                ...field,
                "value": date,
            },
        }));
    }, []);

    const handleTextChange = useCallback((field, fieldName) => ({target}) => {
        setDiscountFields((prevFields) => ({
            ...prevFields,
            [fieldName]: {
                ...field,
                "value": target.value,
            },
        }));
    }, []);

    const viewDiscount = () => (
        <Grid
            alignItems="center"
            container>
            <Grid
                item
                xs={3}>
                <Typography align="left">
                    {discount.name}
                </Typography>
            </Grid>
            <Grid
                item
                xs={5}>
                <Typography align="left">
                    {discount.description}
                </Typography>
            </Grid>
            <Grid
                item
                xs={2}>
                <Switch
                    checked={discount.active}
                    classes={{
                        "bar": classes.colorBar,
                        "checked": classes.colorChecked,
                        "switchBase": classes.colorSwitchBase,
                    }}
                    onClick={handleDiscountToggleActive(
                        discount.id, type, discount.active
                    )}
                    value={`${discount.name} is ${discount.active ? "active" : "inactive"}`} />
            </Grid>
            <Grid
                item
                xs={2}>
                <IconButton
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    aria-label="more"
                    onClick={handleClick}>
                    <Options />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="long-menu"
                    keepMounted
                    onClick={handleToggleEdit}
                    open={open}>
                    <MenuItem onClick={handleEdit}>
                        <Edit />
                        EDIT
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <Delete />
                        DELETE
                    </MenuItem>
                </Menu>
            </Grid>
        </Grid>
    );

    const renderField = useCallback((field, fieldName) => {
        switch (field.type) {
            case "text":
                return (
                    <TextField
                        onChange={handleTextChange(field, fieldName)}
                        value={field.value} />
                );
            case "number":
                return (
                    <TextField
                        onChange={handleTextChange(field, fieldName)}
                        type="number"
                        value={field.value} />
                );
            case "date":
                return (
                    <DatePicker
                        format="MM/dd/yyyy"
                        label={field.name}
                        margin="normal"
                        onChange={onDateChange(field, fieldName)}
                        openTo="day"
                        value={field.value}
                        views={["year", "month", "date"]} />
                );
            case "select":
                return (
                    <Select
                        onChange={handleTextChange(field, fieldName)}
                        value={field.value}>
                        {
                            field.options.map((option) => (
                                <MenuItem
                                    key={option}
                                    value={option}>
                                    {option}
                                </MenuItem>
                            ))
                        }
                    </Select>
                );
            // no default
        }
    }, [handleTextChange, onDateChange]);

    const editDiscount = () => (
        <>
            <Grid
                alignItems="center"
                container>
                <Grid
                    item
                    xs={3}>
                    <TextField
                        onChange={handleTextChange(DiscountFields.Name, "Name")}
                        value={DiscountFields.Name.value} />
                </Grid>
                <Grid
                    item
                    xs={5}>
                    <TextField
                        onChange={handleTextChange(
                            DiscountFields.Description, "Description"
                        )}
                        value={DiscountFields.Description.value} />
                </Grid>
                <Grid
                    item
                    xs={2}>
                    <Switch
                        checked={discount.active}
                        onClick={handleDiscountToggleActive(
                            discount.id, type, discount.active
                        )}
                        value={`${discount.name} is ${discount.active ? "active" : "inactive"}`} />
                </Grid>
                <Grid
                    item
                    xs={2}>
                    <IconButton
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        aria-label="more"
                        onClick={handleEdit}>
                        <Done />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid
                alignItems="center"
                container
                spacing={2}>
                {
                    Object.entries(DiscountFields)
                        .filter(([fieldName]) =>
                            BaseFields.indexOf(fieldName) < 0)
                        .map(([fieldName, field]) => (
                            <Grid
                                item
                                key={field}>
                                {renderField(field, fieldName)}
                            </Grid>
                        ))
                }
            </Grid>
        </>
    );

    return (
        <Grid
            item
            key={discount.id}
            xs={12}>
            <Paper
                className="category-row"
                square >
                {editing ? editDiscount() : viewDiscount()}
            </Paper>
            <Dialog
                onClose={handleDelete}
                open={deleteWarning}>
                <DialogContent>
                    <DialogTitle>
                    Are you sure you want to delete {discount.name}?
                    </DialogTitle>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteDiscount(discount.id, type)}>
                            Yes, DELETE
                        </Button>
                        <Button onClick={handleDelete}>No, Exit</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

DiscountRow.propTypes = {
    "classes": PropTypes.shape({
        "bar": PropTypes.any,
        "checked": PropTypes.any,
        "switchBase": PropTypes.any,
    }),
    "discount": PropTypes.object.isRequired,
    "type": PropTypes.oneOf([
        "DateRange",
        "MultiCourse",
        "PaymentMethod",
    ]).isRequired,
};

export default withStyles(styles)(DiscountRow);
