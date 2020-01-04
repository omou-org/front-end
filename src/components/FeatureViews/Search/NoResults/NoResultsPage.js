import React from 'react';

import Link from "@material-ui/core/Link"
import Typography from "@material-ui/core/Typography"

import "./NoResultsPage.scss";
import Grid from "@material-ui/core/Grid";

const NoResultsPage = () => {
    // TODO: how to (lazy?) load suggestions for search? Make an initial API call on component mounting for a list of suggestions?
    return (
        <Grid container className={'no-results'}>
            <hr/>
            <Grid item xs={12}>
                <div className="center">

                    <Typography variant={"h3"}>Sorry, no results were found</Typography>
                    <br />
                    <div className="left">
                        <Typography variant={"h7"}>Search suggestions</Typography>
                        <Typography variant={"h6"}>
                            Check your spelling
                        <br />
                            Try more general words
                    </Typography>

                        <Typography variant={"h7"}>Popular pages</Typography>
                        <Typography variant={"h6"} >
                            <Link href="/scheduler">
                                Scheduler
                            </Link>
                            <br />
                            <Link href={"/registration"}>
                                Registration Catalogue
                            </Link>
                        </Typography>
                        <div className="space" />
                    </div>
                </div>
            </Grid>
        </Grid >
    )
};




export default NoResultsPage