import React from "react";

import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import BackButton from "../../../BackButton";
import "./NoResultsPage.scss";
import Grid from "@material-ui/core/Grid";

const NoResultsPage = () => {
	return (
		<Grid container className={"no-results"}>
			<Grid item xs={12}>
				<Paper elevation={2} className={"paper"}>
					<BackButton />
					<hr />
					<div className="center">
						<Typography variant={"h3"}>Sorry, no results were found</Typography>
						<br />
						<div className="left">
							<Typography variant={"h7"}>Search suggestions</Typography>
							<Typography variant={"body1"}>
								Check your spelling
								<br />
								Try more general words
							</Typography>

							<Typography variant={"h7"}>Popular pages</Typography>
							<Typography variant={"h6"}>
								<Link href="/scheduler">Scheduler</Link>
								<br />
								<Link href={"/registration"}>Registration</Link>
							</Typography>
							<div className="space" />
						</div>
					</div>
				</Paper>
			</Grid>
		</Grid>
	);
};

export default NoResultsPage;
