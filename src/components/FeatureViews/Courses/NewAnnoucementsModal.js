import React from "react"

import AddIcon from "@material-ui/icons/AddOutlined";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DoneIcon from "@material-ui/icons/CheckCircleOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Loading from "components/OmouComponents/Loading";
import LoadingError from "../Accounts/TabComponents/LoadingCourseError";
import NotificationIcon from "@material-ui/icons/NotificationImportant";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {

    },
}));


const NewAnnoucementsModal = () => {
    return(
        <Grid className="annoucement-container" container item md={12} spacing={2}>
            <Dialog>

            </Dialog>
        </Grid>
    );
};

export default NewAnnoucementsModal;
