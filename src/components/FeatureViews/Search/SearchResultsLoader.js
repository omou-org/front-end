import PropTypes from "prop-types";
import React from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./Search.scss";
import AccountCard from "./cards/AccountCard";
import CourseCard from "./cards/CourseCard";
import { LabelBadge } from "../../../theme/ThemedComponents/Badge/LabelBadge";

const SearchResultsLoader = ({
								 numResults,
								 query,
								 accountPage,
								 coursePage,
							 }) => (
	<Grid className="search-results" container>
		<Grid item xs={12}>
			<Paper className="main-search-view">
				<Grid className="searchResults" item xs={12}>
					<Typography align="left" className="search-title" variant="h3">
						{numResults} Search Results for "{query}"
					</Typography>
				</Grid>
				<div className="account-results-wrapper">
					<Grid item xs={12}>
						<hr/>
						<Grid
							alignItems="center"
							container
							direction="row"
							justify="space-between"
						>
							<Grid className="searchResults" item>
								<Typography align="left" className="resultsColor" gutterBottom>
									Accounts
								</Typography>
							</Grid>
							<Grid item>
								<LabelBadge label="See All Accounts" variant="outline-gray"/>
							</Grid>
						</Grid>
						<Grid container direction="row" spacing={2}>
							{[1, 2, 3, 4].map((account) => (
								<Grid item key={account} sm={3}>
									<AccountCard isLoading/>
								</Grid>
							))}
						</Grid>
						<div className="results-nav">
							{
								<IconButton className="less" disabled>
									<LessResultsIcon/>
								</IconButton>
							}
							{accountPage}
							{
								<IconButton className="more" disabled>
									<MoreResultsIcon/>
								</IconButton>
							}
						</div>
					</Grid>
				</div>
				<div className="course-results-wrapper">
					<hr/>
					<Grid item xs={12}>
						<Grid
							alignItems="center"
							container
							direction="row"
							justify="space-between"
						>
							<Grid className="searchResults" item>
								<Typography align="left" className="resultsColor">
									Courses
								</Typography>
							</Grid>
							<Grid item style={{paddingRight: "1vh"}}>
								<LabelBadge label="See All Courses" variant="outline-gray"/>
							</Grid>
						</Grid>
						<Grid container direction="row" spacing={1}>
							{[1, 2, 3, 4].map((course) => (
								<CourseCard isLoading key={course}/>
							))}
						</Grid>
					</Grid>
					<div className="results-nav">
						<IconButton className="less" disabled>
							<LessResultsIcon/>
						</IconButton>
						{coursePage}
						<IconButton className="more" disabled>
							<MoreResultsIcon/>
						</IconButton>
					</div>
				</div>
			</Paper>
		</Grid>
	</Grid>
);

SearchResultsLoader.propTypes = {
	accountPage: PropTypes.number.isRequired,
	coursePage: PropTypes.number.isRequired,
	numResults: PropTypes.number.isRequired,
	query: PropTypes.string.isRequired,
};

export default SearchResultsLoader;
