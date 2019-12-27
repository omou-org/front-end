// React Imports
import React, {useCallback, useState, useEffect} from "react";
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../actions/authActions";
import NavLinkNoDup from "../Routes/NavLinkNoDup";
import PropTypes from "prop-types";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import {FormControl} from "@material-ui/core";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/es/Typography/Typography";
import Remove from "@material-ui/icons/Cancel"
import Add from "@material-ui/icons/CheckCircle";

// Local Component Imports
import "./Form.scss"
import TextField from "@material-ui/core/es/TextField/TextField";


const PriceQuoteForm = ({courses, tutoring, students, disablePay}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const isAdmin = useSelector(({auth}) => auth.isAdmin);
    const [priceQuote, setPriceQuote] = useState({
        sub_total: 1000,
        total: 980,
    });
    const [discounts, setDiscounts] = useState([
        {
            amount: 20,
            title:"EARLY BIRD",
            enable: true,
            id: 1,
        },
    ]);
    const [priceAdjustment, setPriceAdjustment] = useState(0);

    useEffect(()=>{
        console.log(courses, tutoring, students)
    },[courses, tutoring, students]);

    const [payment, setPayment] = useState(1000);
    const [paymentMethod, setPaymentMethod] = useState(()=>{
        return {
            cash: false,
            creditCard: false,
            check: false,
        }
    });
    const handlePayMethodChange = method => e =>{
        setPaymentMethod({ [method]: e.target.checked })
    }
    const {cash, creditCard, check} = paymentMethod;

    // get updated price quote
    useEffect(()=>{
        let requestedQuote = {
            payment_method: paymentMethod,
            courses: courses,
            tutoring: tutoring,
            students: students,
            disabled_discounts: discounts.filter((discount) => {
                return !discount.enable;
            }),
            price_adjustment: priceAdjustment,
        };
        // make price quote request
    },[paymentMethod,payment, courses, tutoring, discounts, priceAdjustment]);

    const handlePay = () => (e)=>{
        e.preventDefault();
        // setSelectionPending(false);
        // Object.keys(props.registration.registered_courses).forEach((studentID)=>{
        //     props.registration.registered_courses[studentID].forEach(({type, course_id, new_course})=>{
        //         if(selectedCourses[studentID][course_id].checked){
        //             switch(type){
        //                 case "class":
        //                     api.submitClassRegistration(studentID, course_id);
        //                     break;
        //                 case "tutoring":
        //                     let schedule = {
        //                         ...new_course.schedule,
        //                         start_date:new_course.schedule.start_date.substring(0,10),
        //                         end_date: new_course.schedule.end_date.substring(0,10),
        //                     }
        //                     new_course = {
        //                         ...new_course,
        //                         ...schedule,
        //                     };
        //                     delete new_course["schedule"];
        //                     let dayOfWeek = {
        //                         0: "Sun",
        //                         1: "Mon",
        //                         2: "Tue",
        //                         3: "Wed",
        //                         4: "Thu",
        //                         5: "Fri",
        //                         6: "Sat",
        //                     };
        //                     new_course.day_of_week = dayOfWeek[new_course.day_of_week];
        //                     api.submitTutoringRegistration(new_course,studentID);
        //                     break;
        //             }
        //         }
        //     })
        // });
        history.push(`/registration/receipt/`);
    }

    const toggleDiscount = (id) => (e) =>{
        e.preventDefault();
        setDiscounts(discounts.map((discount)=>{
            return {
                ...discount,
                enable: discount.id === id ? !discount.enable : discount.enable,
            }
        }));
    };

    const handlePriceAdjustment = () => (e) => {
        setPriceAdjustment(e.target.value);
    }

    return (
        <Grid container className={"price-quote-form"}>
            <Grid item xs={3}>
                <FormControl>
                    <FormLabel>Select Payment Method</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            label={"Cash"}
                            control={<Checkbox checked={cash} onChange={handlePayMethodChange('cash')} value={"Cash"}/>}
                        />
                        <FormControlLabel
                            label={"Check"}
                            control={<Checkbox checked={check} onChange={handlePayMethodChange('check')} value={"Check"}/>}
                        />
                        <FormControlLabel
                            label={"Credit Card"}
                            control={<Checkbox checked={creditCard} onChange={handlePayMethodChange('creditCard')} value={"Credit Card"}/>}
                        />
                    </FormGroup>
                </FormControl>
            </Grid>
            <Grid item xs={9}>
                <Grid container spacing={8}>
                    <Grid item xs={12}>
                        <Grid container direction={"column"} spacing={8}>
                            <Grid item>
                                <Grid container direction={"row"} justify={"flex-end"}>
                                    <Grid item xs={3}>
                                        <Typography align={"right"} className={"price-label"}>
                                            Subtotal
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography align={"right"}>
                                            {priceQuote.sub_total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {
                                discounts.map((discount, i)=>{
                                    return <Grid item key={i}>
                                        <Grid container direction={"row"} justify={"flex-end"}>
                                            <Grid item xs={1}>
                                                {
                                                    discount.enable ?
                                                    <Remove
                                                        onClick={toggleDiscount(discount.id)}
                                                        className={"remove icon"}/> :
                                                    <Add
                                                        onClick={toggleDiscount(discount.id)}
                                                        className={"add icon"}/>
                                                }
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Typography align={"right"}
                                                            className={`price-label 
                                                            ${ discount.enable && "discount"}`}>
                                                    {discount.title} Discount
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <Typography align={"right"}
                                                            className={`discount-amount 
                                                            ${discount.enable && "enable"}`}>
                                                    - {discount.amount}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                })
                            }
                            <Grid item>
                                {/*Manual Price Adjustment for Admins*/}
                                {
                                    isAdmin &&
                                    <Grid container direction={"row"} justify={"flex-end"}>
                                        <Grid item xs={2}>
                                            <Typography align={"right"} className={"price-label"}>
                                                Price Adjustment
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography align={"right"}>
                                                <TextField
                                                    value = {priceAdjustment}
                                                    onChange={ handlePriceAdjustment() }
                                                    type={"number"}
                                                    className={"price-adjustment"}
                                                />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                <Grid container direction={"row"} justify={"flex-end"}>
                                    <Grid item xs={2}>
                                        <Typography align={"right"} className={"price-label"}>
                                            Total
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography align={"right"}>
                                            {priceQuote.total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify={"flex-end"}>
                            <Button
                                disabled={disablePay}
                                className={"button"}
                                onClick={handlePay()}>
                                PAY
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

PriceQuoteForm.propTypes = {
    "courses": PropTypes.array.isRequired,
    "tutoring": PropTypes.array.isRequired,
    "students": PropTypes.array.isRequired,
};

export default PriceQuoteForm;