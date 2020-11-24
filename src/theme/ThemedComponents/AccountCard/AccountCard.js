import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as IDIcon } from '../../../components/identifier.svg';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	cardContainer: {
		height: '152px',
		width: '288px',
	},
	gridContainer: {
		height: '100%',
	},
	cardHeader: {
		textAlign: 'left',
	},
	leftStripe: {
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0 auto',
		height: '100%',
		borderRadius: '8px 0px 0px 8px',
	},
	rightInfo: {
		width: '100%',
		height: '100%',
		background: '#FFFFFF',
		boxShadow: '0px 0px 8px rgba(196, 196, 196, 0.6)',
		borderTopRightRadius: '8px',
		borderBottomRightRadius: '8px',
	},
	accountInfo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	iconStyles: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
});

const AccountCard = ({ accountName, role }) => {
	const classes = useStyles();

	let stripeColor;

	if (role === 'Parent') {
		stripeColor = '#D74AC8';
	}

	if (role === 'Student') {
		stripeColor = '#9B59B6';
	}

	return (
		<Card className={classes.cardContainer}>
			<Grid className={classes.gridContainer} container>
				<Grid
					style={{ background: stripeColor }}
					className={classes.leftStripe}
					item
					xs={2}
				>
					xx
				</Grid>
				<Grid className={classes.rightInfo} item xs={10}>
					<CardHeader
						className={classes.cardHeader}
						titleTypographyProps={{ variant: 'h4' }}
						subheaderTypographyProps={{ variant: 'body2' }}
						title={accountName}
						subheader={role}
					/>

					<Grid container>
						<Grid className={classes.iconStyles} item xs={2}>
							<IDIcon height={22} width={20.5} />
						</Grid>

						<Grid className={classes.accountInfo} item xs={10}>
							<Typography variant='body1'>#Number</Typography>
						</Grid>
					</Grid>

					<Grid container>
						<Grid className={classes.iconStyles} item xs={2}>
							<PhoneIcon height={22} width={20.5} />
						</Grid>

						<Grid className={classes.accountInfo} item xs={10}>
							<Typography variant='body1'>###-###-####</Typography>
						</Grid>
					</Grid>

					<Grid container>
						<Grid className={classes.iconStyles} item xs={2}>
							<EmailIcon height={22} width={20.5} />
						</Grid>

						<Grid className={classes.accountInfo} item xs={10}>
							<Typography variant='body1'>email@gmail.com</Typography>
						</Grid>
					</Grid>

				</Grid>
			</Grid>
		</Card>
	);
};

export default AccountCard;
