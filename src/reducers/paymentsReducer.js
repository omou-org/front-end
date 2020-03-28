import initialState from './initialState';
import * as actions from "./../actions/actionTypes"
import {REQUEST_ALL} from "../actions/apiActions";

export default function course(state = initialState.Payments, {payload, type}) {
    let newState;
    switch (type) {
        case actions.POST_PAYMENT_SUCCESS:
            return handlePayments(state, payload);
        case actions.GET_PAYMENT_PARENT_SUCCESS:
            return handlePayments(state, payload);
        case actions.GET_PAYMENT_SUCCESS:
            return handlePayments(state,payload);
        case actions.GET_PAYMENT_ENROLLMENT_SUCCESS:
            return handlePayments(state,payload);
        default:
            return state;
    }
};

const handlePayments = (state, payload) => {
    let Payments = {...state};
    let id;
    let response;

    if(payload.id){
        id = payload.id;
        response = payload.response;
    } else if(Array.isArray(payload)){
        payload.forEach((paymentRequest) =>{
            paymentRequest.data.forEach((data) => {
                Payments = updatePayment(Payments, data.id, data);
            });
        });
    } else {
        id = payload.data.id;
        response = payload;
    }
    if(id === REQUEST_ALL){
        response.data.forEach((payment)=>{
            Payments= updatePayment(Payments, payment.id, payment)
        });
    } else if (Array.isArray(id)) {
        response.data.forEach(({data})=>{
            Payments = updatePayment(Payments, data.id, data)
        });
    } else{
        Payments = updatePayment(Payments, id, response.data);
    }
    return {
        ...Payments,
    }
};

const updatePayment = (payments, id, payment) => ({
        ...payments,
        [payment.parent]: {
            ...payments[payment.parent],
            [id]: payment,
        }
    });
