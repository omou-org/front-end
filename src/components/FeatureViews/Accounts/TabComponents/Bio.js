import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useSelector} from "react-redux";
import {isLoading, useCategory} from "../../../../actions/hooks";
import Loading from "../../../OmouComponents/Loading";

const Bio = ({"background": {bio, experience, languages, subjects}}) => {
	const categories = useSelector(({Course}) => Course.CourseCategories);
	const categoryStatus = useCategory();
	if (isLoading(categoryStatus)) {
		return <Loading/>
	}

	return (
		<Card className="Bio">
			<Grid
				container
				item
				xs={12}>
				<Grid
					className="BioMain"
					item
					md={6}
					xs={12}>
					<Typography className="bioHeader">
						Biography
					</Typography>
					<Typography className="bioBody">
						{bio}
					</Typography>
				</Grid>
				<Grid
					className="BioBackground BioDetails"
					item
					md={6}
					xs={12}>
					<Grid
						className="rowPadding"
						container>
						<Grid className="bioDescription">
							Experience:
						</Grid>
						{
							experience && experience.split(",").map((exp) => (
								<Grid
									className="chipPadding"
									key={exp}>
									<Chip
										className="bioChip"
										label={exp}
										variant="outlined"/>
								</Grid>
							))
						}

					</Grid>
					<Grid
						className="rowPadding"
						container>
						<Grid className="bioDescription">
							Subjects offered:
						</Grid>
						{console.log(categories)}
						{
							subjects && subjects.map((subject) => (
								<Grid
									className="chipPadding"
									key={subject}>
									<Chip
										className="bioChip"
										label={categories[subject + 1].name}
										variant="outlined"/>
								</Grid>
							))
						}
					</Grid>
					<Grid
						className="rowPadding"
						container>
						<Grid className="bioDescription">
							Language:
						</Grid>
						{
							languages && languages.split(",").map((language) => (
								<Grid
									className="chipPadding"
									key={language}>
									<Chip
										className="bioChip"
										label={language}
										variant="outlined"/>
								</Grid>
							))
						}
					</Grid>
				</Grid>
			</Grid>
		</Card>
	)
};

Bio.propTypes = {
    "background": PropTypes.shape({
        "bio": PropTypes.string,
        "experience": PropTypes.any,
        "languages": PropTypes.any,
        "subjects": PropTypes.any,
    }).isRequired,
};

export default Bio;
