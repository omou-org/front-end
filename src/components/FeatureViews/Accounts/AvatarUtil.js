import React, { Component } from "react";
import { connect } from 'react-redux';
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";

import {stringToColor} from "./accountUtils";

class AvatarUtil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilename:"",
            margin: 0,
            width: 0,
            height: 0,
            fontSize: 0,
        };
    }

    componentWillMount() {
    }

    render(){
        console.log(this.props)
        let styles = () => ({
            backgroundColor: stringToColor(this.props.profilename),
            color: "white",
            margin: this.props.margin,
            width: this.props.width,
            height: this.props.height,
            fontSize: this.props.fontSize,
        });
        return(
            <Avatar
            style={styles(this.props.profilename)}>{this.props.profilename.match(/\b(\w)/g).join("")}</Avatar>
        );
    }
}
Avatar.propTypes = {
};

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
)(AvatarUtil);