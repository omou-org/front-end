import React, { useState, useCallback } from "react";
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
import { getOperationAST } from 'graphql';
import { newUpdatedCache } from '../../../utils';
import Loading from "../../OmouComponents/Loading";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import "./ModalTextEditor.scss";
import { GET_SESSION_NOTES } from "./ClassSessionView";
import { ResponsiveButton } from '../../../theme/ThemedComponents/Button/ResponsiveButton';

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
  origin,
  buttonState,
  editPost,
  mutation,
  query,
  iconArray
}) => {
  const classes = useStyles();
  const [sendEmailCheckbox, setSendEmailCheckbox] = useState(false);
  const [sendSMSCheckbox, setSendSMSCheckbox] = useState(false);
  const [subject, setSubject] = useState();
  const [body, setBody] = useState(EditorState.createEmpty());
  const isDisabled = convertToRaw(body.getCurrentContent())?.blocks
  .reduce((accum, currentValue) => {
    return {...accum, text: currentValue.text} 
  }, {}).text === "" || subject === "" ? true : false;
  const plainText = convertToRaw(body.getCurrentContent())?.blocks.reduce((accum, currentValue) => ({...accum, text: currentValue.text}), {}).text; 
  const { gqlquery, queryVariables } = query || {};
  const { gqlmutation, mutationVariables } = mutation || {};
  const { editGqlQuery, editQueryVariables } = editPost || {};


  const MUTATION_VARIABLES = {
    ...mutationVariables,
    subject,
    body: origin === "STUDENT_ENROLLMENT" ? plainText
    : convertToRaw(body.getCurrentContent()),
  };


  const QUERY_VARIABLES = {
    ...queryVariables
  };

  const { data, loading, error } = useQuery(
    editGqlQuery, 
    {
      variables: editQueryVariables || null,
      skip: typeof editGqlQuery === "undefined" || typeof editQueryVariables.announcementId === "undefined" || editQueryVariables.announcementId === null,
      onCompleted: () => {
        if(!data) return
        const { body, subject } = data.announcement
        setBody(EditorState.createWithContent(convertFromRaw(JSON.parse(body.replace(/'/g, '"')))));
        setSubject(subject)
      },
    },
  );

  
  const [mutateTextEditor, createResults] = useMutation(gqlmutation, {
    onCompleted: () => handleClose(false),
    update: (cache, { data }) => {
      const queryTitle = getOperationAST(gqlquery).selectionSet.selections[0].name.value;
      const mutationTitle = getOperationAST(gqlmutation).selectionSet.selections[1].name.value;
      const [newTextData] = Object.values(data[mutationTitle]);
      const cachedTextData = cache.readQuery({
        query: gqlquery,
        variables: QUERY_VARIABLES,
      })[queryTitle];
      cache.writeQuery({
        data: {
          [queryTitle]: newUpdatedCache(newTextData, cachedTextData),
        },
        query: gqlquery,
        variables: QUERY_VARIABLES,
      });
    },
  });

  const handleClose = () => {
    handleCloseForm(false);
    setBody(EditorState.createEmpty());
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await mutateTextEditor({
      variables: MUTATION_VARIABLES,
    });
    setBody(EditorState.createEmpty())
  };

  const toggleInlineStyles = e => {
    e.preventDefault();
    const style = e.currentTarget.getAttribute("data-style");
    const { toggleInlineStyle, toggleBlockType } = RichUtils
    
    if(style === "ordered-list-item" || style === "unordered-list-item") {
        setBody(toggleBlockType(body, style))
    } else {
      setBody(toggleInlineStyle(body, style))
    }
  };

  const handleKeyCommand = (command, body) => {
    const newState = RichUtils.handleKeyCommand(body, command);
    if (newState) {
      setBody(newState);
    }
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
      case "addNote":
        return "ADD NOTE";
      default:
        return "FINISH";
    }
  };

  if(loading) return <Loading />
  if(error) return console.error(error)

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
                  defaultValue={buttonState === "edit" ? subject : ""}
                  data-cy="text-editor-subject"
                />
              </Grid>
              <Grid item xs={6}>
                <ButtonGroup
                  color="primary"
                  aria-label="outlined primary button group"
                >
                  {
                    iconArray?.map(icons => (
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
              disabled={isDisabled}>
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
