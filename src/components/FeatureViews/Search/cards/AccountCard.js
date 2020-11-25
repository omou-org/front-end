import React from "react";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";

import { truncateStrings} from "../../../../utils";
import {ReactComponent as IDIcon} from "../../../identifier.svg";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	cardContainer: {
		height: '152px',
		width: '288px',
	},
	gridContainer: {
		height: '100%',
	},
	cardHeader: {
		textAlign: 'left',
	},
	leftStripe: {
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '0 auto',
		height: '100%',
		borderRadius: '8px 0px 0px 8px',
	},
	rightInfo: {
		width: '100%',
		height: '100%',
		background: '#FFFFFF',
		boxShadow: '0px 0px 8px rgba(196, 196, 196, 0.6)',
		borderTopRightRadius: '8px',
		borderBottomRightRadius: '8px',
	},
	accountInfo: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	iconStyles: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}
});

const USER_DETAILS = gql`
    fragment UserDetails on UserType {
    email
    lastName
    firstName
    }`;

export const ACCOUNT_QUERIES = {
    "ADMIN": gql`
        query AdminFetch($userID: ID!) {
            admin(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "INSTRUCTOR": gql`
        query InstructorFetch($userID: ID!) {
            instructor(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "PARENT": gql`
        query ParentFetch($userID: ID!) {
            parent(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
    "STUDENT": gql`
        query StudentFetch($userID: ID!) {
            student(userId: $userID) {
                user {
                    ...UserDetails
                }
            }
        }
        ${USER_DETAILS}`,
};

const AccountCard = ({accountType, userID, isLoading}) => {
    const classes = useStyles();

    // needs a defined query, else it breaks
    const {data, loading} = useQuery(ACCOUNT_QUERIES[accountType] || ACCOUNT_QUERIES.STUDENT, {
        "variables": {userID},
    });

    if (isLoading || loading) {
        return (
            <Card style={{"height": "130px"}}>
                <CardContent>
                    <Typography color="textSecondary"
                        gutterBottom
                        variant="h4">
                        Loading...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

	const [{user}] = Object.values(data);
    const fullName = `${user.firstName} ${user.lastName}`;

    const stripeColor = stringToColor(fullName);
    const accountTypeLabel = accountType[0] + accountType.slice(1).toLowerCase();

    return (
        <Link 
        style={{"textDecoration": "none"}}
        to={`/accounts/${accountType.toLowerCase()}/${userID}`}>      
            <Card className={classes.cardContainer}>
		    	<Grid className={classes.gridContainer} container>
		    		<Grid
		    			style={{ background: stripeColor }}
		    			className={classes.leftStripe}
		    			item
		    			xs={2}
		    		>
		    			{fullName.match(/\b(\w)/ug).join("")}
		    		</Grid>
		    		<Grid className={classes.rightInfo} item xs={10}>
		    			<CardHeader
		    				className={classes.cardHeader}
		    				titleTypographyProps={{ variant: 'h4' }}
		    				subheaderTypographyProps={{ variant: 'body2' }}
		    				title={truncateStrings(fullName, 20)}
		    				subheader={accountTypeLabel}
		    			/>

		    			<Grid container>
		    				<Grid className={classes.iconStyles} item xs={2}>
		    					<IDIcon height={22} width={20.5} />
		    				</Grid>

		    				<Grid className={classes.accountInfo} item xs={10}>
		    					<Typography variant='body1'># {userID}</Typography>
		    				</Grid>
		    			</Grid>

		    			<Grid container>
		    				<Grid className={classes.iconStyles} item xs={2}>
		    					<EmailIcon height={22} width={20.5} />
		    				</Grid>

		    				<Grid className={classes.accountInfo} item xs={10}>
		    					<Typography variant='body1'>{user.email}</Typography>
		    				</Grid>
		    			</Grid>
		    		</Grid>
		    	</Grid>
		    </Card>

        </Link>
    );
};

AccountCard.propTypes = {
    "accountType": PropTypes
        .oneOf(["STUDENT", "PARENT", "INSTRUCTOR", "ADMIN"]),
    "isLoading": PropTypes.bool,
    "userID": PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default AccountCard;
