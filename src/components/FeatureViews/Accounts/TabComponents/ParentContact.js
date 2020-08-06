import "./TabComponents.scss";
import * as hooks from "actions/hooks";
import Grid from "@material-ui/core/Grid";
import Loading from "components/OmouComponents/Loading";
import ProfileCard from "../ProfileCard";
import PropTypes from "prop-types";
import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import LoadingError from "./LoadingCourseError";

const GET_PARENTS = gql`
	query getParents($id:ID){
		parent(userId: $id) {
		user {
			email
			firstName
			id
			lastName
		}
		accountType
		phoneNumber
		}
	}
`


const ParentContact = ({ parent_id }) => {
	const { data, loading, error } = useQuery(GET_PARENTS, { "variables": { "id": parent_id } });
	console.log(data);
	console.log(parent_id);
	if (loading) {
		return <Loading loadingText="PARENT LOADING" small />
	}
	if (error) {
		return <LoadingError error="parent" />;
	}

	const parent = {
		"name": `${data.parent.user.firstName} ${data.parent.user.lastName}`,
		"phoneNumber": data.parent.phoneNumber,
		"accountType": data.parent.accountType.toLowerCase(),
		"user": {
			"id": data.parent.user.id,
			"email": data.parent.user.email,
		}
	}


	console.log(parent)

	return (
		<Grid item md={12}>
			<Grid container spacing={2}>
				<Grid item md={12} xs={10}>
					<ProfileCard route={`/accounts/parent/${parent_id}`} user={parent} />
				</Grid>
			</Grid>
		</Grid>
	);
};

ParentContact.propTypes = {
	parent_id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

export default ParentContact;
