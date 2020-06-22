import React from "react";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		'& > *': {
			margin: theme.spacing(1),
			width: theme.spacing(32),
			height: theme.spacing(32),
		},
	},
}));

export default function InstructorDashboard({user}) {
	const classes = useStyles();
	return (<BackgroundPaper>
		<Grid
			container
			spacing={5}
		>
			<Grid
				item container
				justify="space-between"
				alignItems="flex-end"
			>
				<Grid item>
					<Typography variant="h4">Hello {user.user.firstName}!</Typography>
				</Grid>
				<Grid item>
					<Typography variant="subtitle1">
						<Moment format={"LL"}/>
					</Typography>
				</Grid>
			</Grid>
			<Grid item className={classes.root}>
				<Paper>

				</Paper>
			</Grid>
		</Grid>
	</BackgroundPaper>)
}