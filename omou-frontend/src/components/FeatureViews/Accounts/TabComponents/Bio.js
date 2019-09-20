import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Chip from "@material-ui/core/Chip";
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/EditOutlined";
import RemoveIcon from "@material-ui/icons/DeleteForeverOutlined";
import AlertIcon from "@material-ui/icons/AddAlertOutlined";

class Bio extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Card className={"Bio"}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={6} >
                            <div className="Bio">
                                <Typography class="bioHeader">
                                    Bio
                                    </Typography>
                                <Typography className="bioBody">
                                    {this.props.background.bio}
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className="BioBackground">
                                <div className="Bio2">
                                    <Grid>
                                        <Grid container className="rowPadding">
                                            <Grid className="bioDescription">
                                                Experience:
                                        </Grid>
                                            <Grid className="chipPadding">
                                                <Chip
                                                    label={this.props.background.experience + " years at Summit"}
                                                    className="bioChip"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container className="rowPadding">
                                            <Grid className="bioDescription">
                                                Subjects offered:
                                        </Grid>
                                            {this.props.background.subjects.map((subjects) => {
                                                return (
                                                    <Grid className="chipPadding">
                                                        <Chip
                                                            label={subjects} className="bioChip"
                                                            variant="outlined"
                                                        />
                                                    </Grid>)
                                            })}
                                        </Grid>
                                        <Grid container className="rowPadding">
                                            <Grid className="bioDescription">
                                                Language:
                                        </Grid>
                                            {this.props.background.languages.map((languages) => {
                                                return (
                                                    <Grid className="chipPadding">
                                                        <Chip 
                                                            label={languages}
                                                            className="bioChip"
                                                            variant="outlined"
                                                        />
                                                    </Grid>)
                                            })}
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>)
    }

}

Bio.propTypes = {};

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Bio);