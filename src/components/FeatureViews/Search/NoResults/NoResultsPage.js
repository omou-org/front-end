import React from "react";

import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

import BackButton from "../../../OmouComponents/BackButton";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles({
	"root": {
		"textAlign": "center",
		"width": "100%"
	},
	"center": {
		"display": "inline-block",
		"margin": "10% 0 10% 0",
		"fontWeight": "bold",
		"fontSize": "32px",
		"lineHeight": "60px",
		"textAlign": "left",

	},
	"left": {
		"display": "inline-block",
		"text-align": "left"
	},
	"suggestionHeader": {
		"fontSize": "32px",
		"fontWeight": "500"

	},
	"popularHeader": {
		"padding-top": "20px",
		"fontSize": "32px",
		"fontWeight": "500"
	},

})




const NoResultsPage = () => {
	const classes = useStyles()
	return (
		<Grid container className={classes.root} >
			<Grid item xs={12}>
				<BackButton/>
				<hr/>
				<div className={classes.center}>
					<Typography variant={"h1"} style={{paddingBottom: "20px"}} data-cy="no-results-header">Sorry, no
						results were found</Typography>

					<div className={classes.left}>
						<Typography className={classes.suggestionHeader}>Search suggestions</Typography>
						<Typography variant={"body1"}>
							Check your spelling
							<br/>
							Try more general words
						</Typography>
						<Typography className={classes.popularHeader}>Popular pages</Typography>
						<Typography variant={"h6"}>
							<Link href="/scheduler" data-cy="schedulerLink"
								  style={{"borderBottom": "2px solid currentColor"}}>Scheduler</Link>
							<br/>
							<Link href={"/registration"} style={{"borderBottom": "2px solid currentColor"}}>Registration
								Catalogue</Link>
						</Typography>
					</div>
				</div>
			</Grid>
		</Grid>
	);
};

export default NoResultsPage;
