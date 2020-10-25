import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Grid from "@material-ui/core/Grid";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Input from "@material-ui/core/Input";
import { omouBlue, styleMap } from "../../../theme/muiTheme";
import { getOperationAST } from 'graphql'
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_SESSION_NOTES } from "./ClassSessionView";
import { GET_ANNOUNCEMENTS } from "./CourseClasses";
import "./ModalTextEditor.scss";

const useStyles = makeStyles(theme => ({
  rootContainer: {
    width: "37%",
    [theme.breakpoints.between("md", "lg")]: {
      width: "60%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "100%",
    },
  },
  inputUnderline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
  textFieldStyle: {
    border: "1px solid #666666",
    borderRadius: "5px",
  },
  textBox: {
    paddingTop: ".625em",
    paddingLeft: ".625em",
    paddingRight: ".625em",
  },
  cancelButton: {
    color: "#747D88",
    border: "1px solid #747D88",
    borderRadius: "5px",
    fontSize: ".75rem",
    fontFamily: "Roboto",
    fontWeight: 500,
    width: "17%",
    marginRight: ".75em",
  },
  submitButton: {
    backgroundColor: omouBlue,
    borderRadious: "5px",
    fontFamily: "Roboto",
    fontWeight: 500,
    fontSize: ".75rem",
    width: "17%",
    color: "#FFFFFF",
    marginRight: "4em",
  },
  textArea: {
    padding: "56px 56px 120px 56px",
  },
  subjectUnderline: {
    marginBottom: ".75em",
    borderBottom: "1px solid #666666",
    paddingRight: "3em",
  },
  textfield: {
    border: "1px solid #000",
    borderRadius: "4px",
    padding: "10px 10px 0px 10px",
    overflowY: "auto",
  },
  buttonGroup: {
    marginLeft: "5em",
    marginBottom: "3.5em",
  },
}));

const ModalTextEditor = ({
  open,
  handleCloseForm,
  userId,
  origin,
  posterId,
  sessionId,
  noteId,
  textSubject,
  textBody,
  buttonState,
  announcementId,
  mutation,
  query,
  iconArray
}) => {
  const classes = useStyles();
  const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
  const [sendSMSCheckbox, setSendSMSCheckbox] = useState(false);
  const [subject, setSubject] = useState(textSubject);
  const [body, setBody] = useState(EditorState.createEmpty());
  const courseId = useParams();
  const poster_id = posterId.results[0].user.id;
  const disableCheck = convertToRaw(body.getCurrentContent()).blocks
  .reduce((accum, currentValue) => {
    return {...accum, text: currentValue.text} 
  }, {}).text
  const { gqlquery, queryVariables } = query;
  const { gqlmutation, mutationVariables } = mutation;

  useEffect(() => {
    if(buttonState === "edit") {
      setBody(EditorState.createWithContent(convertFromRaw(textBody)))
    } else {
      setBody(EditorState.createEmpty())
    }
  }, [buttonState])

  const NEWMUTATION_VARIABLES = {
    ...mutationVariables,
    subject,
    body: convertToRaw(body.getCurrentContent()),
  };

  const NEWQUERY_VARIABLES = {
    ...queryVariables
  }

  const [mutateTextEditor, createResults] = useMutation(gqlmutation, {
    onCompleted: () => handleClose(false),
    update: (cache, { data }) => {
      const queryTitle = getOperationAST(gqlquery).selectionSet.selections[0].name.value;
      const mutationTitle = getOperationAST(gqlmutation).selectionSet.selections[1].name.value;
      const [newTextData] = Object.values(data[mutationTitle]);
      const cachedTextData = cache.readQuery({
        query: gqlquery,
        variables: NEWQUERY_VARIABLES,
      })[queryTitle];
      let updatedTextData = [...cachedTextData];
      const matchingIndex = updatedTextData.findIndex(
        ({ id }) => id === newTextData.id
      );
      if (matchingIndex === -1) {
        updatedTextData = [...cachedTextData, newTextData];
      } else {
        updatedTextData[matchingIndex] = newTextData;
      }

      cache.writeQuery({
        data: {
          [queryTitle]: updatedTextData,
        },
        query: gqlquery,
        variables: NEWQUERY_VARIABLES,
      });
    },
  });

  const handleClose = () => {
    handleCloseForm(false);
    setBody(EditorState.createEmpty());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const createTextData = await mutateTextEditor({
      variables: NEWMUTATION_VARIABLES,
    });
    setBody(EditorState.createEmpty())
  };

  const toggleInlineStyles = e => {
    e.preventDefault();
    const style = e.currentTarget.getAttribute("data-style");
    const { toggleInlineStyle, toggleBlockType } = RichUtils
    const newState = {
      [style]: toggleInlineStyle(body, style),
      "unordered-list-item": toggleBlockType(body, style),
      "ordered-list-item": toggleBlockType(body, style),
    }; 
    if(newState[style]) {
      setBody(newState[style])
      return "handled"
    }
    return "not handled"
  };

  const handleKeyCommand = (command, body) => {
    const newState = RichUtils.handleKeyCommand(body, command);
    if (newState) {
      setBody(newState);
      return "handled";
    }
    return "not handled";
  };

  const handleCheckboxChange = setCheckbox => e =>
    setCheckbox(e.target.checked);

  const handleSubjectChange = useCallback(event => {
    setSubject(event.target.value);
  }, []);

  const handleBodyChange = useCallback(event => {
    setBody(event);
  }, []);

  const renderButtonText = () => {
    switch (buttonState) {
      case "edit":
        return "EDIT";
      case "post":
        return "POST";
      default:
        return "ADD NOTE";
    }
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Dialog
          PaperProps={{
            classes: { root: classes.rootContainer },
            square: true,
          }}
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
        >
          <DialogContent classes={{ root: classes.textArea }}>
            <Grid container>
              <Grid item xs={7}>
                <Input
                  placeholder="Subject"
                  className={classes.subjectUnderline}
                  disableUnderline
                  onChange={handleSubjectChange}
                  defaultValue={buttonState === "edit" ? textSubject : ""}
                  data-cy="text-editor-subject"
                />
              </Grid>
              <Grid item xs={6}>
                <ButtonGroup
                  color="primary"
                  aria-label="outlined primary button group"
                >
                  {
                    iconArray.map(icons => (
                    <IconButton onClick={toggleInlineStyles} data-style={icons.style} data-cy={`text-editor-${icons.name}`}>
                      {icons.icon}
                    </IconButton>
                    ))
                  }
                </ButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.textfield} data-cy="text-editor-body">
                  <Editor
                    editorState={body}
                    onChange={handleBodyChange}
                    handleKeyCommand={handleKeyCommand}
                    customStyleMap={styleMap}
                  />
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          {origin === "ANNOUNCEMENTS" && (
            <FormGroup className={classes.buttonGroup}>
              <FormControlLabel
                style={{ fontSize: ".5rem" }}
                control={
                  <Checkbox
                    checked={sendEmailCheckbox}
                    onChange={handleCheckboxChange(setSendEmailCheckbox)}
                    name="email"
                    className={classes.checkBoxPseudo}
                    checkedIcon={<CheckBoxIcon className={classes.checkBox} />}
                    icon={<CheckBoxOutlineBlankOutlinedIcon />}
                    color="primary"
                    data-cy="text-editor-email-checkbox"
                  />
                }
                label={
                  <Typography className={classes.checkboxLabel}>
                    Send as email to parent of students enrolled in class
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sendSMSCheckbox}
                    onChange={handleCheckboxChange(setSendSMSCheckbox)}
                    name="sms"
                    className={classes.checkBoxPseudo}
                    checkedIcon={<CheckBoxIcon className={classes.checkBox} />}
                    icon={<CheckBoxOutlineBlankOutlinedIcon />}
                    color="primary"
                    data-cy="text-editor-sms-checkbox"
                  />
                }
                label={
                  <Typography className={classes.checkboxLabel}>
                    Send as SMS to parents of students enrolled in class
                  </Typography>
                }
              />
            </FormGroup>
          )}
          <DialogActions style={{ marginBottom: "2em" }}>
            <Button className={classes.cancelButton} onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              className={classes.submitButton} 
              data-cy="text-editor-post-button"
              onClick={handleSubmit} 
              disabled={disableCheck === "" || subject === "" ? true : false}
            >
              {origin === "STUDENT_ENROLLMENT"
                ? "Send Email"
                : renderButtonText()}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
};

export default ModalTextEditor;
