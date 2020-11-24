import React from 'react';
import Grid from '@material-ui/core/Grid';
import AccountCard from './AccountCard';

const AccountCardDemo = () => {
	return (
		<div>
			<Grid container>
				<Grid item xs={12}>
					<AccountCard />
				</Grid>
				<Grid style={{marginTop: "20px"}} item xs={12}>
					<AccountCard />
				</Grid>
			</Grid>
		</div>
	);
};

export default AccountCardDemo;
