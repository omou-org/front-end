import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, CardHeader } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { flexibleCompare } from '@fullcalendar/core';

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
		background: '#9B59B6',
		borderRadius: '8px 0px 0px 8px',
	},
	rightInfo: {
		height: '100%',
		background: '#FFFFFF',
		boxShadow: '0px 0px 8px rgba(196, 196, 196, 0.6)',
		borderTopRightRadius: '8px',
		borderBottomRightRadius: '8px',
	},
});

const AccountCard = () => {
	const classes = useStyles();

	return (
		<Card className={classes.cardContainer}>
			<Grid className={classes.gridContainer} container>
				<Grid className={classes.leftStripe} item xs={2}>
					xx
				</Grid>
				<Grid className={classes.rightInfo} item xs={10}>
					<CardHeader
						className={classes.cardHeader}
                        titleTypographyProps={{ variant: 'h4' }}
                        subheaderTypographyProps= {{ variant: 'body2' }}
						title='Student Name'
						subheader='Student'
					/>
				</Grid>
			</Grid>
		</Card>
	);
};

export default AccountCard;

/* 
background: #FFFFFF;
Shadow 1 

box-shadow: 0px 0px 8px rgba(196, 196, 196, 0.6);
border-radius: 8px;


User Name: h4 styling
User Type: Body Bold

id number, phone #, email text: Body Default
*/
