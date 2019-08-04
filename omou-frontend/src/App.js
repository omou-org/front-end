// React
import React from "react";
import PropTypes from "prop-types";

// Redux
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as rootActions from "./actions/rootActions";

// Material UI
// TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
import {CssBaseline} from "@material-ui/core";
// import MenuIcon from '@material-ui/icons/Menu';

// Local Component Imports
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import "./theme/theme.scss";

const App = (props) => {
    props.rootActions.fetchData("student");
    props.rootActions.fetchData("parent");
    return (
        <div className="App">
            <CssBaseline />
            <Navigation />
        </div>
    );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
    rootActions: bindActionCreators(rootActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
