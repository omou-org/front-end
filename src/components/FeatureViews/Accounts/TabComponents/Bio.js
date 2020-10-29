import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Loading from "../../../OmouComponents/Loading";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";



const GET_USER_BIO = gql`query getUserBio($ownerID: ID!) {
	userInfo(userId: $ownerID) {
	  ... on InstructorType {
		biography
		experience
		language
		subjects {
		  name
		}
	  }
	}
  }
  `


const Bio = ({ownerID}) => {
	
	const { data, loading, error } = useQuery(GET_USER_BIO, {
		variables: {ownerID}
	})
	
	if (loading ) return <Loading />
	if (error) return <div>There's been an error! - {error.message}</div>

	
	const {userInfo : {biography,experience,language, subjects}} = data
	

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
						{biography}
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
										variant="outlined" />
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
						{
							subjects && subjects.map((subject) => (
								<Grid
									className="chipPadding"
									key={subject}>
									<Chip
										className="bioChip"
										label={subject.name}
										variant="outlined" />
								</Grid>
							)
							)
						}
					</Grid>
					<Grid
						className="rowPadding"
						container>
						<Grid className="bioDescription">
							Language:
						</Grid>
						{
							language && language.split(",").map((language) => (
								<Grid
									className="chipPadding"
									key={language}>
									<Chip
										className="bioChip"
										label={language}
										variant="outlined" />
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
