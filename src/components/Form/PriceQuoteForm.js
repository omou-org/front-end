// React Imports
import React, {useCallback, useState, useEffect, useMemo, useRef} from "react";
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
import {bindActionCreators} from "redux";
import * as apiActions from "../../actions/apiActions";
import * as userActions from "../../actions/userActions";
import * as registrationActions from "../../actions/registrationActions";
import {dayOfWeek, weeklySessionsParser} from "./FormUtils";
import {instance} from "../../actions/apiActions";
import {usePrevious} from "../../actions/hooks";

const PriceQuoteForm = ({courses, tutoring, disablePay}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );
    const history = useHistory();
    const token = useSelector(({auth}) => auth.token);
    const isAdmin = useSelector(({auth}) => auth.isAdmin);
    const [priceQuote, setPriceQuote] = useState({});
    const prevPriceQuote = usePrevious(priceQuote);
    const [discounts, setDiscounts] = useState([]);
    const prevDiscounts = usePrevious(discounts);
    const [priceAdjustment, setPriceAdjustment] = useState(0);
    const prevPriceAdjustment = usePrevious(priceAdjustment);
    const [payment, setPayment] = useState(1000);
    const [paymentMethod, setPaymentMethod] = useState(()=>{
        return {
            cash: false,
            creditCard: false,
            check: false,
            internationalCreditCard: false,
        }
    });
    const activeMethod = Object.entries(paymentMethod)
        .filter(([paymentMethod, active]) => active)
        .map(([paymentMethod, active]) => paymentMethod)[0];
    const handlePayMethodChange = method => e =>{
        setPaymentMethod({ [method]: e.target.checked })
    };
    const {cash, creditCard, check, internationalCreditCard} = paymentMethod;
    const cleanTutoring = JSON.parse(JSON.stringify(tutoring));
    console.log(cleanTutoring);

    const stateUpdated = (currentState, prevState) => {
        const initialValues = ["{}","[]"];
        // if the state has updated or we need to update because there's a value that hasn't been updated
        return (JSON.stringify(currentState) !== JSON.stringify(prevState) ||
            initialValues.indexOf(JSON.stringify(prevState)) >= 0);
    };
    // get updated price quote
    useEffect(()=>{
        if(activeMethod && (
            stateUpdated(priceQuote,prevPriceQuote) ||
            stateUpdated(discounts,prevDiscounts) ||
            stateUpdated(priceAdjustment, prevPriceAdjustment)
        ) && priceAdjustment !== ""){
            let requestedQuote = {
                payment_method: activeMethod,
                classes: courses,
                tutoring: cleanTutoring.map((tutoring)=>
                    {
                        delete tutoring.new_course;
                        return tutoring
                    }
                ),
                disabled_discounts: discounts.filter((discount) => {
                    return !discount.enable;
                }).map(discount => discount.id),
                price_adjustment: Number(priceAdjustment),
            };
            // make price quote request
            instance.request({
                'url':'/pricing/quote/',
                "headers": {
                    "Authorization": `Token ${token}`,
                },
                "data":requestedQuote,
                'method':'post',
            }).then((quoteResponse) => {
                const responseDiscounts = JSON.stringify(quoteResponse.data.discounts);
                const stateDiscounts = JSON.stringify(discounts);
                if(responseDiscounts !== stateDiscounts){
                    let ResponseDiscounts = quoteResponse.data.discounts.map( (discount) => {
                        return {
                        ...discount,
                            enable: discounts.find(sDiscount => sDiscount.id === discount.id) ?
                            discounts.find(sDiscount => sDiscount.id === discount.id).enable : true,
                        }
                    });
                    let ResponseDiscountIDs = ResponseDiscounts.map( discount => discount.id)
                    let discountNotInResponseButInState = discounts.filter(discount => {
                        return !ResponseDiscountIDs.includes(discount.id);
                    });
                    ResponseDiscounts = ResponseDiscounts.concat(discountNotInResponseButInState);
                    setDiscounts(ResponseDiscounts);
                }
                delete quoteResponse.data.discounts;
                if(quoteResponse.data.price_adjustment !== priceAdjustment){
                    setPriceAdjustment(quoteResponse.data.price_adjustment);
                }
                delete quoteResponse.data.price_adjustment;
                const responseQuote = JSON.stringify(quoteResponse.data);
                const stateQuote = JSON.stringify(priceQuote);
                if(responseQuote !== stateQuote){
                    setPriceQuote(quoteResponse.data);
                }
            });
        }
    },[activeMethod, courses, tutoring, discounts, priceAdjustment]);

    const handlePay = () => (e)=>{
        e.preventDefault();
        let courseRegistrations = [];
        let tutoringRegistrations = [];
        // create course enrollments
        courses.forEach(course => {
            courseRegistrations.push(
                {
                    student: course.student_id,
                    course: course.course_id,
                    sessions: course.sessions,
                });
        });
        tutoring.forEach(tutoring => {
            const startDate = tutoring.new_course.schedule.start_date.substring(0,10);
            const endDate = tutoring.new_course.schedule.end_date.substring(0,10);
            let tutoringCourse = {
                subject: tutoring.new_course.title,
                day_of_week: dayOfWeek[tutoring.new_course.day_of_week],
                start_time: tutoring.new_course.schedule.start_time,
                end_time: tutoring.new_course.schedule.end_time,
                start_date: startDate,
                end_date: endDate,
                max_capacity: 1,
                course_category: tutoring.category_id,
                academic_level: tutoring.academic_level,
                instructor: tutoring.new_course.instructor,
                course_type:"tutoring",
                description: tutoring.new_course.description,
                // need to add academic level
            };
            tutoringRegistrations.push({
                newTutoringCourse: tutoringCourse,
                sessions: weeklySessionsParser(startDate, endDate),
                student: tutoring.student_id,
            });
        });

        let paymentInfo = {
            "base_amount": priceQuote.total,
            "price_adjustment": priceAdjustment,
            "method": activeMethod,
            "disabled_discounts": discounts.filter(discount=> !discount.enable)
        };
        api.initRegistration(tutoringRegistrations, courseRegistrations, paymentInfo);
        history.push("/registration/receipt/");
    };

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
    };

    const handlePayment = event => {
        setPayment(event.target.value);
    };

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
                        <FormControlLabel
                            label={"International Credit Card"}
                            control={<Checkbox checked={internationalCreditCard}
                                               onChange={handlePayMethodChange('internationalCreditCard')}
                                               value={"International Credit Card"}/>}
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
                                                    {discount.name} Discount
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
};

export default PriceQuoteForm;