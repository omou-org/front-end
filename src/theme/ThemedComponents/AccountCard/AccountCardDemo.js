import React from 'react';
import Grid from '@material-ui/core/Grid';
import AccountCard from './AccountCard';

const AccountCardDemo = () => {
	return (
		<div>
			<Grid container>
                <Grid item xs={4} />
				<Grid style={{marginTop: "20px"}} item xs={4}>
					<AccountCard role='Student' accountName='Student Name'/>
				</Grid>
                <Grid item xs={4} />

                <Grid item xs={4} />
				<Grid style={{marginTop: "20px"}} item xs={4}>
					<AccountCard role='Parent' accountName='Parent Name'/>
				</Grid>
                <Grid item xs={4} />
			</Grid>
		</div>
	);
};

export default AccountCardDemo;
