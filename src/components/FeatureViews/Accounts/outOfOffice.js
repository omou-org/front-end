import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent } from "@material-ui/core";
import React from 'react';
import { connect } from "react-redux";


class outOfOffice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

render(){
    console.log(this.props.open);
    return (
        <Dialog className={"select-parent-dialog"}
            onClose={this.handleClose}
            aria-labelledby="simple-dialog-title" open={this.props.open}>
            <DialogTitle id="simple-dialog-title">
                <h3>Currently helping...</h3>
            </DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(outOfOffice);