import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import {Typography} from "@material-ui/core";
import {capitalizeString} from "../../../../utils";

const ReceiptFieldRow = ({keyType, value, isUpdated}) => {
	return (<Grid item container direction='row'>
		<Grid item>
			<Typography color={isUpdated ? 'primary' : ''}>
				{`${capitalizeString(keyType)}: ${value}`}
			</Typography>
		</Grid>
	</Grid>);
};

ReceiptFieldRow.propTypes = {
	keyType: PropTypes.string,
	value: PropTypes.string,
	isUpdated: PropTypes.bool,
};

function SessionEditReceipt({
								databaseState,
								newState,
							}) {
	function arrayCompare(_arr1, _arr2) {
		if (
			!Array.isArray(_arr1)
			|| !Array.isArray(_arr2)
			|| _arr1.length !== _arr2.length
		) {
			return false;
		}

		// .concat() to not mutate arguments
		const arr1 = _arr1.concat().sort();
		const arr2 = _arr2.concat().sort();

		for (let i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i]) {
				return false;
			}
		}

		return true;
	}

	const actualNewState = JSON.parse(newState);

	const statesDoNotHaveSameKeys = !arrayCompare(Object.keys(databaseState), Object.keys(actualNewState));

	if (statesDoNotHaveSameKeys) return `The developer messed up! Check the Database and New States!`;

	const compareValue = (oldVal, newVal) => {
		return oldVal !== newVal;
	};

	const receiptFieldData = Object.entries(actualNewState)
		.map(([key, value]) => {
				return {
					key,
					value,
					isUpdated: compareValue(value, databaseState[key]),
				};
			}
		);

	return (<Grid container direction='row' spacing={1}>
		{
			receiptFieldData.map(({key, value, isUpdated}) =>
				(<ReceiptFieldRow key={key} keyType={key} value={value} isUpdated={isUpdated}/>))
		}
	</Grid>);
}

SessionEditReceipt.propTypes = {
	databaseState: PropTypes.any.isRequired,
	newState: PropTypes.any.isRequired,
};

export default SessionEditReceipt;