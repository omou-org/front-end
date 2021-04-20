import React from 'react';

import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import BackButton from '../../../OmouComponents/BackButton';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
    root: {
        textAlign: 'center',
        width: '100%',
    },
    center: {
        display: 'inline-block',
        margin: '10% 0 10% 0',
        fontWeight: 'bold',
        fontSize: '32px',
        lineHeight: '60px',
        textAlign: 'left',
    },
    suggestionHeader: {
        paddingTop: '4vh',
        paddingBottom: '2vh',
        fontSize: '32px',
        fontWeight: '500',
    },
    popularHeader: {
        paddingTop: '4vh',
        paddingBottom: '2vh',
        fontSize: '32px',
        fontWeight: '500',
    },
});

const NoResultsPage = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <BackButton />
                <hr />

                <Grid
                    container
                    direction='column'
                    justify='center'
                    alignItems='center'
                    spacing={5}
                >
                    <Grid item xs={12} className={classes.center}>
                        <Typography
                            variant='h1'
                            style={{ paddingBottom: '20px' }}
                            data-cy='no-results-header'
                        >
                            Sorry, no results were found
                        </Typography>

                        <Grid item xs={12}>
                            <Typography className={classes.suggestionHeader}>
                                Suggestions
                            </Typography>
                        </Grid>
                        <Grid>
                            <Typography
                                variant='subtitle1'
                                style={{ paddingTop: '2vh' }}
                            >
                                Check your spelling
                                <br />
                                Try more general words
                            </Typography>
                            <Grid item xs={12}>
                                <Typography className={classes.popularHeader}>
                                    Popular
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant='subtitle1'>
                                    <Link
                                        href='/scheduler'
                                        data-cy='schedulerLink'
                                        style={{
                                            fontSize: '20px',
                                            borderBottom:
                                                '2px solid currentColor',
                                        }}
                                    >
                                        Scheduler
                                    </Link>
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant='subtitle1'>
                                    <Link
                                        href={'/registration'}
                                        style={{
                                            fontSize: '20px',
                                            borderBottom:
                                                '2px solid currentColor',
                                        }}
                                    >
                                        Registration Catalogue
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default NoResultsPage;
