import {connect} from "react-redux";
import React, {Component} from "react";
import "./Dashboard.scss";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Dashboard extends Component {
	render() {
		return (
			<div className="`Dashboard`">
				<h1>Dashboard</h1>
				<Grid container spacing={2} className="Root">
					<Card>
						<CardActionArea>
							<CardMedia></CardMedia>
							<CardContent>
								<Typography gutterBottom variant="h5" component="h2">
									Contact Us
								</Typography>
							</CardContent>
						</CardActionArea>
						<CardActions>
							<Button size="small" color="primary">
								Share
							</Button>
							<Button size="small" color="primary">
								Learn More
							</Button>
						</CardActions>
					</Card>
				</Grid>
			</div>
		);
	}
}

Dashboard.propTypes = {};

function mapStateToProps(state) {
	return {};
}

function mapDispatchToProps(dispatch) {
	return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
