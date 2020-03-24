import PropTypes from "prop-types";
import React from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewUser from "@material-ui/icons/PersonAdd";
import { NavLink } from "react-router-dom";
import "./registration.scss";
import SetParent from "./SetParentRegistration";
import { bindActionCreators } from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import { connect } from "react-redux";
import ParentRegistrationActions from "./ParentRegistrationActions";

function RegistrationActions(props) {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      className="registration-action-control"
    >
      <Grid item md={2}>
        <Button
          component={NavLink}
          to="/registration/form/student"
          variant="outlined"
          color="secondary"
          className="button"
        >
          <NewUser className="icon" />
          New Student
        </Button>
      </Grid>
      <Grid item md={8}>
        {props.registration.CurrentParent && <ParentRegistrationActions />}
      </Grid>
      <SetParent />
    </Grid>
  );
}
RegistrationActions.propTypes = {
  courseTitle: PropTypes.string,
  admin: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  registration: state.Registration,
});

const mapDispatchToProps = (dispatch) => ({
  registrationActions: bindActionCreators(registrationActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationActions);
