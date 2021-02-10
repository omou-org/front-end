import React, { useCallback, useEffect, useMemo, useState } from 'react';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

import CardView from '@material-ui/icons/ViewModule';
import EditIcon from '@material-ui/icons/EditOutlined';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ViewListOutlinedIcon from '@material-ui/icons/ViewListOutlined';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import './Accounts.scss';
import { addDashes } from './accountUtils';
import { capitalizeString, USER_TYPES } from 'utils';
import IconButton from '@material-ui/core/IconButton';
import LoadingHandler from 'components/OmouComponents/LoadingHandler';
import ProfileCard from './ProfileCard';
import { simpleUser } from 'queryFragments';
import UserAvatar from './UserAvatar';
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';
import { buttonBlue } from '../../../theme/muiTheme';

const QUERY_USERS = gql`
    query UserQuery {
        students {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        parents {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        instructors {
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
        admins {
            adminType
            userUuid
            user {
                ...SimpleUser
                email
            }
            accountType
            phoneNumber
        }
    }
    ${simpleUser}
`;

const AccountTab = withStyles({
    root: {
        background: '#FFFFFF',
        borderTop: '1px solid #43B5D9',
        borderLeft: '1px solid #43B5D9',
        color: buttonBlue,
        fontWeight: '500',
        borderRadius: '0px',
        '&$selected': {
            borderRadius: '0px',
        },
        '&:last-of-type': {
            borderRight: '1px solid #43B5D9',
        },
    },
    selected: {},
})((props) => <Tab {...props}></Tab>);

const TABS = [
    'All',
    'Instructors',
    'Students',
    'Receptionist',
    'Parents',
].map((label) => <AccountTab key={label} label={label} />);

const useStyles = makeStyles({});

const stopPropagation = (event) => {
    event.stopPropagation();
};

const Accounts = () => {
    const userID = useSelector(({ auth }) => auth.user.id);

    const { loading, error, data } = useQuery(QUERY_USERS);

    const prevState = JSON.parse(sessionStorage.getItem('AccountsState'));
    const [isMobile, setIsMobile] = useState(false);
    const [tabIndex, setTabIndex] = useState(
        prevState ? prevState.tabIndex : 0
    );
    // true = list view, false = card view
    const [viewToggle, setViewToggle] = useState(
        prevState ? prevState.viewToggle : true
    );

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth <= 760);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    const classes = useStyles();

    const displayUsers = useMemo(() => {
        if (!data) {
            return [];
        }
        let newUsersList = [];
        switch (tabIndex) {
            case 1:
                newUsersList = data.instructors;
                break;
            case 2:
                newUsersList = data.students;
                break;
            case 3:
                newUsersList = data.admins.filter(
                    (admin) => admin.adminType === USER_TYPES.receptionist
                );
                break;
            case 4:
                newUsersList = data.parents;
                break;
            default:
                newUsersList = Object.values(data).flat();
        }
        return newUsersList
            .filter((user) => user.adminType !== 'OWNER')
            .map((user) => ({
                ...user,
                accountType: user.accountType.toLowerCase(),
                name: `${user.user.firstName} ${user.user.lastName}`,
            }))
            .sort((first, second) =>
                first.name < second.name ? -1 : first.name > second.name ? 1 : 0
            );
    }, [data, tabIndex]);

    useEffect(() => {
        sessionStorage.setItem(
            'AccountsState',
            JSON.stringify({
                tabIndex,
                viewToggle,
            })
        );
    }, [tabIndex, viewToggle]);

    const handleTabChange = useCallback((_, newIndex) => {
        setTabIndex(newIndex);
    }, []);

    const setView = useCallback(
        (view) => () => {
            setViewToggle(view);
        },
        []
    );

    const MAX_EMAIL_LENGTH = 21;
    const isOverMaxEmailLength = (emailLength) =>
        emailLength > MAX_EMAIL_LENGTH;

    const tableView = useMemo(
        () => (
            <Table className='AccountsTable' resizable='false'>
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.tableCellStyle}>
                            Name
                        </TableCell>
                        <TableCell className={classes.tableCellStyle}>
                            Email
                        </TableCell>
                        <TableCell className={classes.tableCellStyle}>
                            Phone
                        </TableCell>
                        <TableCell className={classes.tableCellStyle}>
                            Role
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {displayUsers.map((row) => (
                        <TableRow
                            className='row'
                            component={Link}
                            key={row.user.id}
                            to={`/accounts/${row.accountType}/${row.user.id}`}
                        >
                            <TableCell className={classes.tableRowStyle}>
                                <Grid
                                    alignItems='center'
                                    container
                                    layout='row'
                                >
                                    <UserAvatar
                                        fontSize={14}
                                        margin={9}
                                        name={row.name}
                                        size={38}
                                    />
                                    {row.name}
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <Tooltip title={row.user.email}>
                                    <span>
                                        {row.user.email.substr(0, 20)}
                                        {isOverMaxEmailLength(
                                            row.user.email.length
                                        ) && '...'}
                                    </span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{addDashes(row.phoneNumber)}</TableCell>
                            <TableCell>
                                {capitalizeString(row.accountType)}
                            </TableCell>
                            <TableCell onClick={stopPropagation}>
                                <Grid>
                                    {(row.accountType.toUpperCase() ===
                                        USER_TYPES.student ||
                                        row.accountType.toUpperCase() ===
                                            USER_TYPES.parent ||
                                        row.user.id === userID) && (
                                        <IconButton
                                            component={Link}
                                            to={`/form/${row.accountType}/edit/${row.user.id}`}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        ),
        [displayUsers]
    );

    const cardView = useMemo(
        () => (
            <Grid
                alignItems='center'
                className='card-container'
                container
                direction='row'
                spacing={2}
                xs={12}
            >
                {displayUsers.map((user) => (
                    <ProfileCard
                        key={user.user_id}
                        route={`/accounts/${user.role}/${user.user_id}`}
                        user={user}
                    />
                ))}
            </Grid>
        ),
        [displayUsers]
    );

    return (
        <Grid className='Accounts' item xs={12}>
            <Grid container alignItems='flex-start' spacing={4}>
                <Grid item>
                    <ResponsiveButton
                        component={Link}
                        to='/form/student/add'
                        variant='outlined'
                    >
                        new student
                    </ResponsiveButton>
                </Grid>
                <Grid item>
                    <ResponsiveButton
                        component={Link}
                        to='/form/parent/add'
                        variant='outlined'
                    >
                        new parent
                    </ResponsiveButton>
                </Grid>
            </Grid>
            <Hidden xsDown>
                <hr style={{ marginTop: '24px' }} />
            </Hidden>
            <Typography align='left' className='heading' variant='h1'>
                Accounts
            </Typography>
            <Grid
                style={{ marginBottom: '40px' }}
                justify='space-between'
                container
                direction='row'
            >
                <Grid component={Hidden} item lgUp md={8} xs={10}>
                    <Tabs
                        className='tabs'
                        onChange={handleTabChange}
                        scrollButtons='on'
                        value={tabIndex}
                        variant='scrollable'
                    >
                        {TABS}
                    </Tabs>
                </Grid>
                <Grid component={Hidden} item md={8} mdDown xs={10}>
                    <Tabs
                        className='tabs'
                        onChange={handleTabChange}
                        scrollButtons='off'
                        value={tabIndex}
                    >
                        {TABS}
                    </Tabs>
                </Grid>
                <Hidden smDown>
                    <Grid container item md={1}>
                        <ToggleButtonGroup aria-label='list & grid view toggle buttons'>
                            <ToggleButton
                                onClick={setView(true)}
                                selected={viewToggle && true}
                                disabled={viewToggle && true}
                            >
                                <ViewListOutlinedIcon />
                            </ToggleButton>
                            <ToggleButton
                                onClick={setView(false)}
                                selected={!viewToggle && true}
                                disabled={!viewToggle && true}
                            >
                                <CardView />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Hidden>
            </Grid>
            <Grid
                alignItems='center'
                className='accounts-list-wrapper'
                container
                direction='row'
                justify='center'
                spacing={1}
            >
                <LoadingHandler error={error} loading={loading}>
                    {isMobile || !viewToggle ? cardView : tableView}
                </LoadingHandler>
            </Grid>
        </Grid>
    );
};

export default Accounts;
