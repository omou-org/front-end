import React from 'react';
import Grid from '@material-ui/core/Grid';
import ProfileCard from '../../../components/FeatureViews/Accounts/ProfileCard';

const users = {
	route: '/demo/accountscard',
	user1: {
		accountType: 'student',
		name: 'Lance Lu',
		phoneNumber: '111-111-1111',
		user: {
			id: 1,
			email:'lancelu@gmail.com'
		}
	},
	user2: {
		accountType: 'parent',
		name: 'Kelsey Dillinger',
		phoneNumber: '222-222-2222',
		user: {
			id: 2,
			email: 'kelsey@dillinger.com'
		}
	},
	user3: {
		accountType: 'student',
		name: 'Danny Hong',
		phoneNumber: '222-222-2222',
		user: {
			id: 2,
			email: 'kelsey@dillinger.com'
		}
	}
}


const AccountCardDemo = () => {
	return (
		<div>
			<Grid container>
				<Grid style={{ marginTop: '20px' }} item xs={4}>
					<ProfileCard user={users.user1} route={users.route} studentInvite />
				</Grid>

				<Grid style={{ marginTop: '20px' }} item xs={4}>
					<ProfileCard user={users.user2} route={users.route} />
				</Grid>

				<Grid style={{ marginTop: '20px' }} item xs={4} >
					<ProfileCard user={users.user3} route={users.route} studentInvite />
				</Grid>
			</Grid>
		</div>
	);
};

export default AccountCardDemo;
