import React, {useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useSubmitRegistration} from "actions/multiCallHooks";
import {isLoading} from "actions/hooks";
import Loading from "../OmouComponents/Loading";
import PaymentReceipt from "../FeatureViews/Registration/PaymentReceipt";
import Button from "@material-ui/core/Button";
import {bindActionCreators} from "redux";
import Grid from "@material-ui/core/Grid";
import * as registrationActions from "actions/registrationActions";
import {useHistory} from "react-router-dom";

import { ResponsiveButton } from '../../theme/ThemedComponents/Button/ResponsiveButton';

export default function RegistrationReceipt() {
	const Registration = useSelector(({Registration}) => Registration);
	const registrationStatus = useSubmitRegistration(Registration.registration);
	const history = useHistory();

	const dispatch = useDispatch();
	const api = useMemo(
		() => bindActionCreators(registrationActions, dispatch),
		[dispatch]
	);

	const handleCloseRegistration = useCallback(() => {
		api.closeRegistration();
		history.push("/registration")
	}, [api]);
	const handlePrint = useCallback(() => window.print(), []);

	if (isLoading(registrationStatus)) {
		return <Loading/>
	}

	return (<>
		<PaymentReceipt paymentID={registrationStatus.paymentID}/>
		<Grid container direction="row" alignItems="flex-end">
			<Grid item>
				<ResponsiveButton variant="contained" onClick={handleCloseRegistration}>
					Close Registration
				</ResponsiveButton>
			</Grid>
			<Grid item>
				<ResponsiveButton variant="outlined" onClick={handlePrint}>
					Print
				</ResponsiveButton>
			</Grid>
		</Grid>

		<Grid item>

		</Grid>
	</>)
}