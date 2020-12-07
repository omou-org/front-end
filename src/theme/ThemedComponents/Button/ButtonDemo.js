import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import BackgroundPaper from '../../../components/OmouComponents/BackgroundPaper';
import { ResponsiveButton } from './ResponsiveButton';
import BackArrow from '@material-ui/icons/ArrowBackIos';
import AddIcon from '@material-ui/icons/Add';

const ButtonDemo = () => {
	return (
		<BackgroundPaper>
			<Grid container spacing={6}>
				<Grid
					container
					direction='row'
					justify='center'
					alignItems='center'
					spacing={2}
					item
					xs={6}
				>
					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							standard length outlined buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							{' '}
							&lt; 6 characters
						</Typography>
					</Grid>

					<Grid item xs={3}>
						<ResponsiveButton variant='outlined' label='save' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='outlined' label='delete' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='outlined' label='pay' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='outlined' label='ok' />
					</Grid>

					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							medium length outlined buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							7-10 characters
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='reschedule' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='unregister' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='unenroll' />
					</Grid>

					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							long length outlined buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							11-16 characters
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='set password' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='reset password' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='outlined' label='learn more ' />
					</Grid>

					<Grid item xs={12}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							buttons with icons
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton
							variant='outlined'
							label='back'
							startIcon={<BackArrow style={{ transform: 'scale(0.8)' }} />}
						/>
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton
							variant='outlined'
							label='register'
							startIcon={<AddIcon />}
						/>
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton
							variant='outlined'
							label='announcement'
							startIcon={<AddIcon />}
						/>
					</Grid>
				</Grid>

				<Grid
					container
					direction='row'
					justify='center'
					alignItems='center'
					// spacing={3}

					item
					xs={6}
				>
					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							standard length contained buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							{' '}
							&lt; 6 characters
						</Typography>
					</Grid>

					<Grid item xs={3}>
						<ResponsiveButton variant='contained' label='save' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='contained' label='delete' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='contained' label='send' />
					</Grid>
					<Grid item xs={3}>
						<ResponsiveButton variant='contained' label='cancel' />
					</Grid>

					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							medium length contained buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							{' '}
							7-10 characters
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='reschedule' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='unregister' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='unenroll' />
					</Grid>

					<Grid item xs={6}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							long length contained buttons
						</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h4' align='right'>
							{' '}
							11-16 characters
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='send reset email' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='reset password' />
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton variant='contained' label='request demo' />
					</Grid>

					<Grid item xs={12}>
						<Typography
							variant='h4'
							align='left'
							style={{ textTransform: 'uppercase' }}
						>
							buttons with icons
						</Typography>
					</Grid>

					<Grid item xs={4}>
						<ResponsiveButton
							variant='contained'
							label='back'
							startIcon={<BackArrow style={{ transform: 'scale(0.8)' }} />}
						/>
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton
							variant='contained'
							label='register'
							startIcon={<AddIcon />}
						/>
					</Grid>
					<Grid item xs={4}>
						<ResponsiveButton
							variant='contained'
							label='register'
							startIcon={<AddIcon />}
							disabled
						/>
					</Grid>
				</Grid>
			</Grid>
		</BackgroundPaper>
	);
};

export default ButtonDemo;
