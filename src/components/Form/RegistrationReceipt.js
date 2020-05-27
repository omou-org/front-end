import React from "react";
import {useSelector} from "react-redux";
import {useSubmitRegistration} from "actions/multiCallHooks";

export default function RegistrationReceipt() {
	const Registration = useSelector(({Registration}) => Registration);
	const registrationStatus = useSubmitRegistration(Registration.registration);

	return (<div>

	</div>)
}