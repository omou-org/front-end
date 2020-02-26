/* eslint-disable max-lines-per-function */
// React Imports
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/es/Typography/Typography";
import Remove from "@material-ui/icons/Cancel";
import Add from "@material-ui/icons/CheckCircle";
// Local Component Imports
import "./Form.scss";
import TextField from "@material-ui/core/es/TextField/TextField";
import { bindActionCreators } from "redux";
import * as apiActions from "../../actions/apiActions";
import { instance } from "../../actions/apiActions";
import * as userActions from "../../actions/userActions";
import * as registrationActions from "../../actions/registrationActions";
import { dayOfWeek, weeklySessionsParser } from "./FormUtils";
import { usePrevious } from "../../actions/hooks";

const CASH = "cash",
    CHECK = "check",
    CREDIT_CARD = "credit_card",
    INTERNATIONAL_CREDIT_CARD = "intl_credit_card";

const PriceQuoteForm = ({ courses, tutoring }) => {
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
    const token = useSelector(({ auth }) => auth.token);
    const isAdmin = useSelector(({ auth }) => auth.isAdmin);
    const [priceQuote, setPriceQuote] = useState({});
    const prevPriceQuote = usePrevious(priceQuote);
    const [discounts, setDiscounts] = useState([]);
    const prevDiscounts = usePrevious(discounts);
    const [priceAdjustment, setPriceAdjustment] = useState(0);
    const prevPriceAdjustment = usePrevious(priceAdjustment);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const handlePayMethodChange = useCallback((method) => () => {
        setPaymentMethod(method);
    }, []);
    const cleanTutoring = JSON.parse(JSON.stringify(tutoring));

    const stateUpdated = (currentState, prevState) => {
        const initialValues = ["{}", "[]"];
        // if the state has updated or we need to update because there's a value that hasn't been updated
        return JSON.stringify(currentState) !== JSON.stringify(prevState) ||
            initialValues.indexOf(JSON.stringify(prevState)) >= 0;
    };
    // get updated price quote
    useEffect(() => {
        if (paymentMethod && (
            stateUpdated(priceQuote, prevPriceQuote) ||
            stateUpdated(discounts, prevDiscounts) ||
            stateUpdated(priceAdjustment, prevPriceAdjustment)
        ) && priceAdjustment !== "") {
            const requestedQuote = {
                "payment_method": paymentMethod,
                "classes": courses,
                "tutoring": cleanTutoring.map((tutoring) => {
                    delete tutoring.new_course;
                    return {
                        ...tutoring,
                        "duration": 1
                    };
                }),
                "disabled_discounts": discounts.filter((discount) => !discount.enable).map(({ id }) => id),
                "price_adjustment": Number(priceAdjustment),
            };
            // make price quote request
            instance.post("/pricing/quote/", requestedQuote, {
                "headers": {
                    "Authorization": `Token ${token}`,
                },
            }).then((quoteResponse) => {
                const responseDiscounts = JSON.stringify(quoteResponse.data.discounts);
                const stateDiscounts = JSON.stringify(discounts);
                if (responseDiscounts !== stateDiscounts) {
                    let ResponseDiscounts = quoteResponse.data.discounts.map((discount) => ({
                        ...discount,
                        "enable": discounts.find((sDiscount) => sDiscount.id === discount.id)
                            ? discounts.find((sDiscount) => sDiscount.id === discount.id).enable : true,
                    }));
                    const ResponseDiscountIDs = ResponseDiscounts.map((discount) => discount.id);
                    const discountNotInResponseButInState = discounts.filter((discount) => !ResponseDiscountIDs.includes(discount.id));
                    ResponseDiscounts = ResponseDiscounts.concat(discountNotInResponseButInState);
                    setDiscounts(ResponseDiscounts);
                }
                delete quoteResponse.data.discounts;
                if (quoteResponse.data.price_adjustment !== priceAdjustment) {
                    setPriceAdjustment(quoteResponse.data.price_adjustment);
                }
                delete quoteResponse.data.price_adjustment;
                const responseQuote = JSON.stringify(quoteResponse.data);
                const stateQuote = JSON.stringify(priceQuote);
                if (responseQuote !== stateQuote) {
                    setPriceQuote(quoteResponse.data);
                }
            });
        }
    }, [paymentMethod, courses, tutoring, discounts, priceAdjustment, priceQuote, prevPriceQuote, prevDiscounts, prevPriceAdjustment, cleanTutoring, token]);

    const handlePay = () => (e) => {
        e.preventDefault();
        const courseRegistrations = [];
        const tutoringRegistrations = [];

        // create course enrollments
        courses.forEach((course) => {
            courseRegistrations.push(
                {
                    "student": course.student_id,
                    "course": course.course_id,
                    "sessions": course.sessions,
                    "enrollment": course.enrollment,
                }
            );
        });
        tutoring.forEach((tutoring) => {
            console.log(tutoring);
            const startDate = tutoring.new_course.schedule.start_date.substring(0, 10);
            const endDate = tutoring.new_course.schedule.end_date.substring(0, 10);
            const tutoringCourse = {
                "subject": tutoring.new_course.title,
                "day_of_week": dayOfWeek[tutoring.new_course.day_of_week] || tutoring.new_course.schedule.days,
                "start_time": tutoring.new_course.schedule.start_time,
                "end_time": tutoring.new_course.schedule.end_time,
                "start_date": startDate,
                "end_date": endDate,
                "max_capacity": 1,
                "course_category": tutoring.category_id || tutoring.new_course.category,
                "academic_level": tutoring.academic_level || tutoring.new_course.academic_level,
                "instructor": tutoring.new_course.instructor || tutoring.new_course.instructor_id,
                "course_type": "tutoring",
                "description": tutoring.new_course.description,
                "is_confirmed": tutoring.new_course.is_confirmed,
            };
            tutoringRegistrations.push({
                "newTutoringCourse": tutoringCourse,
                "sessions": weeklySessionsParser(startDate, endDate),
                "student": tutoring.student_id,
                "courseID": tutoring.courseID,
            });
        });

        const paymentInfo = {
            "base_amount": priceQuote.total,
            "price_adjustment": priceAdjustment,
            "method": paymentMethod,
            "disabled_discounts": discounts.filter((discount) => !discount.enable),
        };
        api.initRegistration(tutoringRegistrations, courseRegistrations, paymentInfo);
        history.push("/registration/receipt/");
    };

    const toggleDiscount = useCallback((id) => () => {
        setDiscounts((previousDiscounts) => previousDiscounts.map((discount) => ({
            ...discount,
            "enable": discount.id === id ? !discount.enable : discount.enable,
        })));
    }, []);

    const handlePriceAdjustment = useCallback(({ target }) => {
        setPriceAdjustment(target.value);
    }, []);

    return (
        <Grid
            className="price-quote-form"
            container>
            <Grid
                item
                xs={3}>
                <FormControl>
                    <FormLabel>Select Payment Method</FormLabel>
                    <RadioGroup>
                        <FormControlLabel
                            control={<Radio
                                checked={paymentMethod === CASH}
                                onChange={handlePayMethodChange(CASH)}
                                value="Cash" />}
                            label="Cash" />
                        <FormControlLabel
                            control={<Radio
                                checked={paymentMethod === CHECK}
                                onChange={handlePayMethodChange(CHECK)}
                                value="Check" />}
                            label="Check" />
                        <FormControlLabel
                            control={<Radio
                                checked={paymentMethod === CREDIT_CARD}
                                onChange={handlePayMethodChange(CREDIT_CARD)}
                                value="Credit Card" />}
                            label="Credit Card" />
                        <FormControlLabel
                            control={<Radio
                                checked={paymentMethod === INTERNATIONAL_CREDIT_CARD}
                                onChange={handlePayMethodChange(INTERNATIONAL_CREDIT_CARD)}
                                value="International Credit Card" />}
                            label="International Credit Card" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid
                item
                xs={9}>
                <Grid
                    container
                    spacing={8}>
                    <Grid
                        item
                        xs={12}>
                        <Grid
                            container
                            direction="column"
                            spacing={8}>
                            <Grid item>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end">
                                    <Grid
                                        item
                                        xs={3}>
                                        <Typography
                                            align="right"
                                            className="price-label">
                                            Subtotal
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}>
                                        <Typography align="right">
                                            {priceQuote.sub_total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {
                                discounts.map((discount, i) => (<Grid
                                    item
                                    key={i}>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="flex-end">
                                        <Grid
                                            item
                                            xs={1} />
                                        <Grid
                                            item
                                            xs={3}>
                                            <Typography
                                                align="right"
                                                className={`price-label
                                                            ${discount.enable && "discount"}`}>
                                                {
                                                    discount.enable
                                                        ? <Remove
                                                            className="remove icon"
                                                            onClick={toggleDiscount(discount.id)} />
                                                        : <Add
                                                            className="add icon"
                                                            onClick={toggleDiscount(discount.id)} />
                                                }
                                                {discount.name} Discount
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}>
                                            <Typography
                                                align="right"
                                                className={`discount-amount
                                                            ${discount.enable && "enable"}`}>
                                                - {discount.amount}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>))
                            }
                            <Grid item>
                                {/* Manual Price Adjustment for Admins */}
                                {
                                    isAdmin &&
                                    <Grid
                                        className="price-adjustment-wrapper"
                                        container
                                        direction="row"
                                        justify="flex-end">
                                        <Grid
                                            item
                                            xs={2}>
                                            <Typography
                                                align="right"
                                                className="price-label">
                                                Price Adjustment
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={2}>
                                            <Typography align="right">
                                                <TextField
                                                    className="price-adjustment"
                                                    onChange={handlePriceAdjustment}
                                                    type="number"
                                                    value={priceAdjustment}
                                                    variant="outlined" />
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end">
                                    <Grid
                                        item
                                        xs={2}>
                                        <Typography
                                            align="right"
                                            className="price-label">
                                            Total
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}>
                                        <Typography
                                            align="right"
                                            className="total-price">
                                            ${priceQuote.total}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Grid
                            container
                            justify="flex-end">
                            <Button
                                className="button"
                                disabled={paymentMethod === null}
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
