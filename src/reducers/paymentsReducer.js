import initialState from './initialState';
import * as actions from "./../actions/actionTypes"
import {REQUEST_ALL} from "../actions/apiActions";

export default function course(state = initialState.Payments, {payload, type}) {
    let newState;
    switch (type) {
        case actions.POST_PAYMENT_SUCCESS:
            return handlePayments(state, payload);
        default:
            return state;
    }
};

const handlePayments = (state, response) => {
    let Payments = {...state};
    console.log(response.data.id);
    if(response.data.id === REQUEST_ALL){
        response.data.forEach((payment)=>{
            Payments = updatePayment(Payments, payment.id, payment)
        });
    } else if (Array.isArray(response.data.id)) {
        response.data.forEach(({data})=>{
            Payments = updatePayment(Payments, data.id, data)
        });
    } else {
        console.log("updating payment", response.data, response.data.id)
        Payments = updatePayment(Payments, response.data.id, response.data);
    }
    return {
        ...Payments,
    }
};

const updatePayment = (payments, id, payment) => {
    console.log(payments, payment.parent, );
    console.log({
        ...payments,
        [payment.parent]: {
            ...payments[payment.parent],
            [id]: payment,
        }
    });
    return {
        ...payments,
        [payment.parent]: {
            ...payments[payment.parent],
            [id]: payment,
        }
    }
};
