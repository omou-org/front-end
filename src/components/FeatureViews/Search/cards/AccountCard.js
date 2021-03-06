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
import theme from "../../../../theme/muiTheme";

import { truncateStrings} from "../../../../utils";
import {ReactComponent as IDIcon} from "../../../identifier.svg";
import {stringToColor} from "components/FeatureViews/Accounts/accountUtils";
import { makeStyles } from '@material-ui/core/styles';
import { GET_ADMIN, GET_INSTRUCTOR, GET_PARENT, GET_STUDENT } from '../../../../queries/AccountsQuery/AccountsQuery';

const useStyles = makeStyles({
    cardContainer: {
        height: '152px',
        width: '288px',
      },
	...theme.accountCardStyle
});

const USER_DETAILS = gql`
    fragment UserDetails on UserType {
    email
    lastName
    firstName
    }`;

export const ACCOUNT_QUERIES = {
    "ADMIN": GET_ADMIN,
    "INSTRUCTOR": GET_INSTRUCTOR,
    "PARENT": GET_PARENT,
    "STUDENT": GET_STUDENT,
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

    const accountTypeLabel = accountType[0] + accountType.slice(1).toLowerCase();

    return (
        <Link 
        style={{"textDecoration": "none"}}
        to={`/accounts/${accountType.toLowerCase()}/${userID}`}>      
            <Card className={classes.cardContainer}>
		    	<Grid className={classes.gridContainer} container>
		    		<Grid
		    			style={{ background: stringToColor(fullName) }}
		    			className={classes.leftStripe}
		    			item
		    			xs={2}
		    		>
		    			{fullName.match(/\b(\w)/ug).join("")}
		    		</Grid>
		    		<Grid className={classes.cardRight} item xs={10}>
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
