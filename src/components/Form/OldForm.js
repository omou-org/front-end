import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";
import * as userActions from "../../actions/userActions";
import * as apiActions from "../../actions/apiActions";
import * as adminActions from "../../actions/adminActions";
import * as types from "actions/actionTypes";
import React, {Component} from "react";
import {Prompt} from "react-router";
import {NavLink, withRouter} from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import {updateParent, updateStudent} from "reducers/usersReducer";
import {updateCourse} from "reducers/courseReducer";
// Material UI Imports
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {InputValidation} from "../FeatureViews/Registration/Validations";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
// Outside React Component
import SearchSelect from "react-select";
import Modal from "@material-ui/core/Modal";
import CompleteCourseRegistration from "./Receipts/CompleteCourseRegistration";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DatePicker, TimePicker} from "@material-ui/pickers";
import * as utils from "./FormUtils";
import TutoringPriceQuote from "./Field Components/TutoringPriceQuote";
import InstructorConflictCheck from "components/InstructorConflictCheck";
import {combineDateAndTime, durationStringToNum} from "utils";

const parseGender = {
    "M": "Male",
    "F": "Female",
    "U": "Do not disclose",
};

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "conditional": "",
            "nextSection": false,
            "activeStep": 0,
            "activeSection": "",
            "form": "",
            "submitPending": false,
            "preLoaded": false,
            "existingUser": false,
            "hasLoaded": false,
            "confirmTuition": false,
            "showPassword": false,
        };
    }

    componentWillMount() {
        let prevState = JSON.parse(sessionStorage.getItem("form") || null);
        const formType = this.props.match.params.type;
        const {id} = this.props.match.params;
        this.props.userActions.fetchStudents();
        this.props.userActions.fetchParents();
        this.props.userActions.fetchInstructors();
        this.props.registrationActions.initializeRegistration();
        this.props.adminActions.fetchCategories();
        if (this.props.match.params.edit === "edit") {
            switch (formType) {
                case "instructor": {
                    const instructor = this.props.instructors[id];
                    if (instructor) {
                        prevState = {
                            ...this.state,
                            "Basic Information": {
                                "First Name": instructor.first_name,
                                "Last Name": instructor.last_name,
                                "E-Mail": instructor.email,
                                "Phone Number": instructor.phone_number,
                                "Gender": parseGender[instructor.gender],
                                "Address": instructor.address,
                                "City": instructor.city,
                                "Zip Code": instructor.zipcode,
                                "State": instructor.state,
                                "Date of Birth": instructor.birth_date,
                            },
                            "Experience": {
                                "Subject(s) Tutor Can Teach": instructor.background.subjects,
                                "Teaching Experience (Years)": instructor.background.experience,
                                "Background": instructor.background.bio,
                                "Languages": instructor.background.languages,
                            },
                            "Basic Information_validated": {
                                "First Name": true,
                                "Last Name": true,
                                "E-Mail": true,
                                "Phone Number": true,
                                "Gender": true,
                                "Address": true,
                                "City": true,
                                "Zip Code": true,
                                "State": true,
                                "Date of Birth": true,
                            },
                            "Experience_validated": {
                                "Subject(s) Tutor Can Teach": true,
                                "Teaching Experience (Years)": true,
                                "Background": true,
                                "Languages": true,
                            },
                            "form": formType,
                            "activeSection": "Basic Information",
                            "nextSection": true,
                            "preLoaded": true,
                        };
                    }
                    break;
                }
                case "course": {
                    if (id && this.props.registeredCourses) {
                        if (id.indexOf("+") >= 0) {
                            const studentID = id.substring(0, id.indexOf("+"));
                            const courseID = id.substring(id.indexOf("+") + 1);
                            const {form} = this.props.registeredCourses[studentID].find(({course_id}) => course_id === courseID);
                            prevState = {
                                ...form,
                            };
                        }
                    }
                    break;
                }
                case "tutoring": {
                    if (id && this.props.registeredCourses) {
                        if (id.indexOf("+") >= 0) {
                            const studentID = id.substring(0, id.indexOf("+"));
                            const courseID = id.substring(id.indexOf("+") + 1);
                            const {form} = this.props.registeredCourses[studentID].find(({course_id}) => course_id === courseID);
                            prevState = {
                                ...form,
                            };
                        }
                    }
                    break;
                }
                case "small_group": {
                    if (id && this.props.registeredCourses) {
                        if (id.indexOf("+") >= 0) {
                            const studentID = id.substring(0, id.indexOf("+"));
                            const courseID = id.substring(id.indexOf("+") + 1);
                            const {form} = this.props.registeredCourses[studentID].find(({course_id}) => course_id === courseID);
                            prevState = {
                                ...form,
                            };
                        }
                    }
                    break;
                }
                default: console.warn("Invalid form type!");
            }
        }

        if (!prevState ||
            formType !== prevState.form ||
            prevState.submitPending ||
            (id && this.props.match.params.edit !== "edit")) {

            if (this.props.registrationForm[formType]) {
                this.setState((oldState) => {
                    const formContents = JSON.parse(
                        JSON.stringify(this.props.registrationForm[formType])
                    );
                    const NewState = {
                        ...oldState,
                        "activeSection": formContents.section_titles[0],
                        "form": formType,
                    };

                    let course = null;
                    if (this.props.courses.hasOwnProperty(id)) {
                        const {course_id, title} =
                            this.props.courses[this.props.match.params.id];
                        // convert it to a format that onselectChange can use
                        course = {
                            "value": course_id,
                            "label": title,
                        };
                    }
                    formContents.section_titles.forEach((title) => {
                        // create blank fields based on form type
                        NewState[title] = {};
                        NewState[`${title}_validated`] = {};
                        // set a value for every non-conditional field (object)
                        if (Array.isArray(formContents[title])) {
                            formContents[title].forEach(({name, type}) => {
                                NewState[`${title}_validated`][name] = true;
                                switch (type) {
                                    case "course":
                                        NewState[title][name] = course;
                                        break;
                                    case "category":
                                        if (formType === "tutoring") {
                                            NewState[title][name] = id;
                                            break;
                                        }
                                        break;
                                    default:
                                        NewState[title][name] = null;
                                }
                            });
                        }
                    });
                    if (formType === "tutoring" && id &&
                        this.props.courses.hasOwnProperty(id)) {
                        NewState["Tutor Selection"]["Course / Subject"] =
                            this.props.courses[id].title;
                    }
                    return NewState;
                }, () => {
                    this.setState({
                        "nextSection": this.validateSection(),
                    });
                });
            }
        } else if (prevState && !prevState.submitPending) {
            if (formType === "tutoring" &&
                this.props.courses.hasOwnProperty(id)) {
                prevState["Tutor Selection"]["Course / Subject"] =
                    this.props.courses[id].title;
            }
            this.setState(prevState);
        }
    }

    componentDidMount() {
        this.props.adminActions.fetchCategories();
        const {id, edit, "type": formType} = this.props.match.params;
        if (!this.props.isAdmin && (formType === "instructor" || formType === "course_details")) {
            this.props.history.replace("/PageNotFound");
        }

        if (this.props.currentParent) {
            // load parent's students if parent selected
            this.props.currentParent.student_list.forEach((student) => {
                this.props.userActions.fetchStudents(student);
            });
        }

        if (edit === "edit") {
            switch (formType) {
                case "student": {
                    this.props.userActions.fetchParents();
                    (async () => {
                        // creates a new action based on the response given
                        const newAction = (type, response) => {
                            this.props.dispatch({
                                type,
                                "payload": {
                                    id,
                                    response,
                                },
                            });
                        };
                        let student;
                        try {
                            const response = await apiActions.instance.get(
                                `/account/student/${id}/`
                            );
                            // succesful request
                            newAction(types.FETCH_STUDENT_SUCCESSFUL, response);
                            student = updateStudent({}, id, response.data)[id];
                            const parents = await apiActions.instance.get(
                                "/account/parent/"
                            );
                            this.props.dispatch({
                                "type": types.FETCH_PARENT_SUCCESSFUL,
                                "payload": {
                                    "id": -1,
                                    "response": parents,
                                },
                            });
                        } catch ({response}) {
                            if (this.props.students[id]) {
                                student = this.props.courses[id];
                            } else {
                                this.props.history.replace("/PageNotFound");
                            }
                        } finally {
                            if (student) {
                                const parent = this.props.parents[student.parent_id];
                                this.setState((prevState) => ({
                                    "Basic Information": {
                                        "Student First Name": student.first_name,
                                        "Student Last Name": student.last_name,
                                        "Gender": parseGender[student.gender],
                                        "Birthday": student.birthday,
                                        "Grade": student.grade,
                                        "School": student.school,
                                        "Student Email": student.email,
                                        "Student Phone Number": student.phone_number,
                                    },
                                    "Parent Information":
                                        parent ? {
                                            "Select Parent": {
                                                "value": parent.user_id,
                                                "label": `${parent.user_id}: ${parent.name} - ${parent.email}`,
                                            },
                                            "Parent First Name": parent.first_name,
                                            "Parent Last Name": parent.last_name,
                                            "Parent Birthday": parent.birthday,
                                            "Gender": parseGender[parent.gender],
                                            "Parent Email": parent.email,
                                            "Address": parent.address,
                                            "City": parent.city,
                                            "State": parent.state,
                                            "Zip Code": parent.zipcode,
                                            "Relationship to Student": parent.relationship,
                                            "Phone Number": parent.phone_number,
                                        } : prevState["Parent Information"],
                                    "preLoaded": true,
                                }));
                            }
                        }
                    })();
                    break;
                }
                case "course_details": {
                    this.props.userActions.fetchInstructors();
                    (async () => {
                        // creates a new action based on the response given
                        const newAction = (type, response) => {
                            this.props.dispatch({
                                type,
                                "payload": {
                                    id,
                                    response,
                                },
                            });
                        };
                        let course;
                        try {
                            const response = await apiActions.instance.get(
                                `/course/catalog/${id}/`
                            );
                            // succesful request
                            newAction(types.FETCH_COURSE_SUCCESSFUL, response);
                            course = updateCourse({}, id, response.data)[id];
                            const instructors = await apiActions.instance.get(
                                "/account/parent/"
                            );
                            this.props.dispatch({
                                "type": types.FETCH_INSTRUCTOR_SUCCESSFUL,
                                "payload": {
                                    "id": -1,
                                    "response": instructors,
                                },
                            });
                        } catch ({response}) {
                            if (this.props.courses[id]) {
                                course = this.props.courses[id];
                            } else {
                                this.props.history.replace("/PageNotFound");
                            }
                        } finally {
                            if (course) {
                                const inst = this.props.instructors[course.instructor_id];
                                this.setState(utils.loadEditCourseState(course, inst));
                            }
                        }
                    })();
                    break;
                }
                case "parent": {
                    (async () => {
                        // creates a new action based on the response given
                        const newAction = (type, response) => {
                            this.props.dispatch({
                                type,
                                "payload": {
                                    id,
                                    response,
                                },
                            });
                        };
                        let parent;
                        try {
                            const response = await apiActions.instance.get(
                                `/account/parent/${id}/`
                            );
                            // succesful request
                            newAction(types.FETCH_PARENT_SUCCESSFUL, response);
                            parent = updateParent({}, id, response.data)[id];
                        } catch {
                            if (this.props.parents[id]) {
                                parent = this.props.parents[id];
                            } else {
                                this.props.history.replace("/PageNotFound");
                            }
                        } finally {
                            if (parent) {
                                this.setState({
                                    "Parent Information": {
                                        "First Name": parent.first_name,
                                        "Last Name": parent.last_name,
                                        "Gender": parseGender[parent.gender],
                                        "Email": parent.email,
                                        "Address": parent.address,
                                        "Birthday": parent.birthday,
                                        "City": parent.city,
                                        "State": parent.state,
                                        "Zip Code": parent.zipcode,
                                        "Relationship to Student(s)": parent.relationship,
                                        "Phone Number": parent.phone_number,
                                    },
                                    "preLoaded": true,
                                });
                            }
                        }
                    })();
                }
                // no default
            }
        }
        this.setState({
            "hasLoaded": true,
        });
    }

    componentWillUnmount = () => {
        this.props.registrationActions.resetSubmitStatus();
    };

    getFormObject() {
        return this.props.registrationForm[this.state.form];
    }

    getActiveSection() {
        const section = this.getFormObject()[this.state.activeSection];
        if (Array.isArray(section)) {
            return section;
        }
        return section[this.state.conditional];

    }

    onBack = () => {
        // clear session storage
        sessionStorage.removeItem("form");
        this.props.registrationActions.resetSubmitStatus();
    };

    validateSection() {
        let currSectionTitle;
        if (this.state.isSmallGroup) {
            currSectionTitle = "Student";
        } else {
            currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        }
        return (
            this.getActiveSection()
                .filter(({required}) => required)
                .every(({name}) => this.state[currSectionTitle][name]) &&
            Object.values(this.state[`${currSectionTitle}_validated`])
                .every((valid) => valid)
        );
    }

    getConditionalFieldFromCurrentSection() {
        let nextSectionInput = false;
        const currSectionTitle = this.state.activeSection;
        // Get input from the conditional field
        if (Array.isArray(this.getFormObject()[currSectionTitle])) {
            this.getFormObject()[currSectionTitle].some((field) => {
                if (field.conditional) {
                    nextSectionInput = this.state[currSectionTitle][field.name];
                    return true;
                }
                return false;

            });
        }
        return nextSectionInput;
    }

    // Progresses to next section in registration form
    handleNext = () => {
        let currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        let section = this.props.registrationForm[this.state.form][this.state.activeSection];
        if (this.state.isSmallGroup) {
            currSectionTitle = "Student";
            section = this.props.registrationForm[this.state.form].Student;
        }
        if (!Array.isArray(section)) {
            section = section[this.state.conditional];
        }
        section.forEach((field) => {
            this.validateField(currSectionTitle, field, this.state[currSectionTitle][field.name]);
        });
        this.setState((oldState) => {
            if (this.validateSection()) {
                if (oldState.activeStep === this.getFormObject().section_titles.length - 1 || oldState.isSmallGroup) {
                    if (!oldState.submitPending) {
                        if (this.props.match.params.edit === "edit") {
                            this.props.registrationActions.submitForm(this.state, this.props.match.params.id);
                        } else {
                            switch (this.state.form) {
                                case "small_group":
                                    if (this.state["Group Type"]["Select Group Type"] === "New Small Group") {
                                        this.props.apiActions.submitNewSmallGroup(this.state);
                                    } else {
                                        this.props.registrationActions.submitForm(this.state);
                                    }
                                    break;
                                case "pricing":
                                    this.props.adminActions.setPrice(this.state);
                                    break;
                                case "discount":
                                    const discountType = this.state["Discount Description"]["Discount Type"];
                                    const discountPayload = utils.createDiscountPayload(this.state, discountType);
                                    this.props.adminActions.setDiscount(discountType, discountPayload);
                                    break;
                                default:
                                    this.props.registrationActions.submitForm(this.state);
                            }
                        }
                    }
                    return {
                        "submitPending": false,
                    };
                }
                const conditionalField = this.getConditionalFieldFromCurrentSection(),
                    nextActiveStep = oldState.activeStep + 1,
                    nextActiveSection = this.getFormObject().section_titles[nextActiveStep];
                const newState = {
                    "activeStep": nextActiveStep,
                    "activeSection": nextActiveSection,
                    "conditional": conditionalField ? conditionalField : oldState.conditional,
                    "nextSection": false,
                };
                if (conditionalField) {
                    const formContents = this.getFormObject(),
                        title = nextActiveSection;
                    // create blank fields based on form type
                    newState[title] = {};
                    formContents[nextActiveSection][conditionalField].forEach((field) => {
                        newState[title][field.name] = "";
                    });
                    // create validated state for each field
                    newState[`${title}_validated`] = {};
                    formContents[nextActiveSection][conditionalField].forEach((field) => {
                        newState[`${title}_validated`][field.name] = true;
                    });
                }
                return newState;

            }
            return {};

        }, () => {
            this.setState({
                "nextSection": this.validateSection(),
            });
        });
    };

    // Regresses to previous section in registration form
    handleBack = () => {
        this.setState((oldState) => {
            if (oldState.activeStep !== 0 && oldState.activeSection) {
                return {
                    "activeStep": oldState.activeStep - 1,
                    "activeSection": this.getFormObject().section_titles[oldState.activeStep - 1],
                };
            }
            return {};

        }, () => {
            this.setState({
                "nextSection": this.validateSection(),
            });
        });
    };

    handleReset() {
        this.setState({"activeStep": 0});
    }

    handleFieldUpdate(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            oldState[sectionTitle][field.name] = fieldValue;
            return oldState;
        });
    }

    validateField(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            if (!fieldValue) { // if empty field
                oldState[`${sectionTitle}_validated`][field.name] = !field.required;
            } else if (InputValidation(fieldValue, field.type)) { // if valid input
                let isValid = true;
                if (field.type === "number") {
                    // parse if number
                    oldState[sectionTitle][field.name] = parseInt(fieldValue, 10);
                } else if (field.type === "email") {
                    let emails = [];
                    if (field.field === "Student Email") {
                        emails = Object.values(this.props.students).map(({email}) => email);
                    }
                    // validate that email doesn't exist in database already
                    isValid = !emails.includes(fieldValue) || oldState.preLoaded;
                    if (!isValid) {
                        oldState.existingUser = true;
                    }
                }
                oldState[`${sectionTitle}_validated`][field.name] = isValid;
            } else {
                oldState[`${sectionTitle}_validated`][field.name] = false;
            }

            return oldState;
        }, () => {
            this.setState({
                "nextSection": this.validateSection(),
            }, () => {
                sessionStorage.setItem("form", JSON.stringify(this.state));
            });
        });
    }

    onSelectChange(value, label, field) {
        if (field.type === "select parent") {
            if (value) {
                this.setState((OldState) => {
                    const NewState = OldState;
                    const selectedParentID = value.value;
                    const parent = this.props.parents[selectedParentID];
                    NewState[label] = {
                        "Select Parent": {
                            "value": selectedParentID,
                            "label": `${selectedParentID}: ${parent.name} - ${parent.email}`,
                        },
                        "Parent First Name": parent.first_name,
                        "Parent Last Name": parent.last_name,
                        "Gender": parseGender[parent.gender],
                        "Parent Email": parent.email,
                        "Parent Birthday": parent.birthday,
                        "Address": parent.address,
                        "City": parent.city,
                        "State": parent.state,
                        "Zip Code": parent.zipcode,
                        "Relationship to Student": parent.relationship,
                        "Phone Number": parent.phone_number,
                        "user_id": selectedParentID,
                    };
                    Object.keys(NewState[label]).forEach((key) => {
                        NewState[`${label}_validated`][key] = true;
                    });
                    return NewState;
                }, () => {
                    this.validateSection();
                    this.setState({"nextSection": true});
                });
            } else {
                this.setState((OldState) => {
                    const NewState = OldState;
                    NewState[label] = {
                        "Select Parent": null,
                        "Parent First Name": "",
                        "Parent Last Name": "",
                        "Gender": "",
                        "Parent Email": "",
                        "Address": "",
                        "Parent Birthday": "",
                        "City": "",
                        "State": "",
                        "Zip Code": "",
                        "Relationship to Student": "",
                        "Phone Number": "",
                        "user_id": "",
                    };
                    Object.keys(NewState[label]).forEach((key) => {
                        NewState[`${label}_validated`][key] = true;
                    });
                    NewState.nextSection = false;
                    return NewState;
                });
            }
        } else {
            this.setState((OldState) => {
                const NewState = OldState;
                NewState[label][field.name] = value;
                return NewState;
            }, () => {
                this.validateField(this.state.activeSection, field, value);
            });
        }
    }

    onDateChange(date, label, fieldTitle) {
        this.setState((prevState) => {
            prevState[label][fieldTitle] = date;
            return {
                ...prevState,
            };
        }, () => {
            this.setState({"nextSection": this.validateSection()});
        });
    }

    updatePriceFields(category, academicLevel, sessionDuration, numSessions) {
        this.setState((prevState) => {
            switch (prevState.form) {
                case "tutoring": {
                    prevState.Student["Grade Level"] = academicLevel;
                    prevState["Tutor Selection"].Category = category;
                    prevState.Schedule.Duration = sessionDuration;
                    prevState.Schedule["Number of Sessions"] = numSessions;
                    break;
                }
                case "small_group": {
                    prevState["Group Details"].Category = category;
                    prevState["Group Details"]["Grade Level"] = academicLevel;
                    prevState["Group Details"].Duration = sessionDuration;
                    prevState["Group Details"]["# of Weekly Sessions"] = numSessions;
                    break;
                }
                default:
                //no default case
            }
            return {
                ...prevState,
                "confirmTuition": true,
            };
        });
    }

    searchInstructors = async (input) => await utils.loadInstructors(input);

    handleClickShowPassword = () => {
        this.setState((state) => ({"showPassword": !state.showPassword}));
    };

    renderField(field, label, fieldIndex) {
        const fieldTitle = field.name;
        let disabled = this.state["Parent Information"] &&
            Boolean(this.state["Parent Information"]["Select Parent"]) &&
            this.state.activeSection === "Parent Information";
        switch (field.type) {
            case "price quote":
                if (this.state.conditional && this.state.conditional.toLowerCase().includes("existing")) {
                    const course = this.props.courses[this.state["Group Details"]["Select Group"].value];
                    return <div>
                        <Typography>
                            <b>{course.title}'s</b> hourly rate is <b>${course.hourly_tuition}</b>. You will select the number of
                            sessions you wish to register for at checkout.
                        </Typography>
                    </div>
                } else {
                    return (<TutoringPriceQuote
                        courseType={this.state.form}
                        handleUpdatePriceFields={this.updatePriceFields.bind(this)}
                        tuitionConfirmed={this.state.confirmTuition}
                        tutoringCategory={this.props.match.params.id} />);
                }
            case "select":
                const value = this.state[label][fieldTitle];
                const {options} = field;
                disabled = disabled && fieldTitle !== "Relationship to Student" && fieldTitle !== "Gender";
                return (
                    <FormControl className="form-control">
                        <InputLabel shrink={Boolean(value)}>
                            {fieldTitle}
                        </InputLabel>
                        <Select
                            disabled={disabled}
                            onChange={({"target": {value}}) => {
                                this.onSelectChange(value, label, field);
                            }}
                            value={value}>
                            {
                                options.map((option) => (
                                    <MenuItem
                                        key={option}
                                        selected={option === "1 Hour" && fieldTitle === "Duration" ? true
                                            : fieldTitle !== "Duration"}
                                        value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                );

            case "password": {
                return (
                    <FormControl className="form-control">
                        <InputLabel htmlFor="adornment-password">Password *</InputLabel>
                        <Input
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={this.handleClickShowPassword}>
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            id="adornment-password"
                            label={field.name}

                            onBlur={(e) => {
                                e.preventDefault();
                                this.validateField.bind(this)(label, field, e.target.value);
                            }}
                            onChange={(e) => {
                                e.preventDefault();
                                this.handleFieldUpdate.bind(this)(label, field, e.target.value);
                            }}
                            type={this.state.showPassword ? "text" : "password"} />
                    </FormControl>
                );
            }
            case "course": {
                let courseList;
                if (fieldTitle === "Select Group") {
                    // filter for all of the groups
                    courseList = Object.keys(this.props.courses)
                        .filter((courseID) =>
                            this.props.courses[courseID].capacity >
                            this.props.courses[courseID].roster.length &&
                            this.props.courses[courseID].capacity <= 5)
                        .map((courseID) => ({
                            "value": courseID,
                            "label": `${this.props.courses[courseID].title} #${courseID}`,
                        }));
                } else {
                    courseList = Object.keys(this.props.courses)
                        .filter((courseID) =>
                            this.props.courses[courseID].capacity >
                            this.props.courses[courseID].roster.length)
                        .map((courseID) => ({
                            "value": courseID,
                            "label": this.props.courses[courseID].title,
                        }));
                }

                // remove preselected courses
                courseList = this.removeDuplicates(Object.values(this.state[label]), courseList);
                // count # of course fields in current section
                const fieldCount = this.getActiveSection()
                    .reduce((total, {type}) => total + (type === "course"), 0);
                return (
                    <div style={{"width": "inherit"}}>
                        <Grid
                            className="student-align"
                            container
                            spacing={2000}>
                            <SearchSelect
                                className="search-options"
                                disabled={disabled}
                                onChange={(value) => {
                                    this.onSelectChange(value, label, field);
                                }}
                                options={courseList}
                                placeholder="Select existing group..."
                                value={this.state[label][fieldTitle]} />
                            {
                                (fieldCount > 1) && !disabled &&
                                <RemoveIcon
                                    aria-label="Add"
                                    className="button-remove-student"
                                    color="primary"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        // deletes answer field from state
                                        this.removeField(fieldIndex);
                                        this.forceUpdate();
                                    }}
                                    variant="extended" />
                            }
                        </Grid>
                    </div>
                );
            }
            case "student": {
                let studentList = [];
                if (this.props.currentParent) {
                    this.props.currentParent.student_list.forEach((studentID) => {
                        if (this.props.students[studentID]) {
                            const {user_id, name, email} = this.props.students[studentID];
                            studentList.push({
                                "value": user_id,
                                "label": `${name} - ${email}`,
                            });
                        }
                    });
                } else {
                    studentList = Object.values(this.props.students)
                        .map(({user_id, name, email}) => ({
                            "value": user_id,
                            "label": `${name} - ${email}`,
                        }));
                }


                studentList = this.removeDuplicates(Object.values(this.state[label]), studentList);

                // count # of course fields in current section
                const studentCount = this.getActiveSection()
                    .reduce((total, {type}) => total + (type === "student"), 0);

                return (
                    <div style={{"width": "inherit"}}>
                        <Grid
                            className="student-align"
                            container>
                            <SearchSelect
                                className="search-options"
                                disabled={disabled}
                                onChange={(value) => {
                                    this.onSelectChange(value, label, field);
                                }}
                                options={studentList}
                                placeholder="Select a Student..."
                                value={this.state[label][fieldTitle] ? this.state[label][fieldTitle] : ""} />
                            {
                                studentCount > 1 && !disabled &&
                                <RemoveIcon
                                    aria-label="Add"
                                    className="button-remove-student"
                                    color="primary"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        // deletes answer field
                                        this.removeField(fieldIndex);
                                        this.forceUpdate();
                                    }}
                                    variant="extended" />
                            }
                        </Grid>
                    </div>
                );
            }
            case "instructor": {
                let instructorList = this.props.instructors;

                instructorList = Object.values(instructorList)
                    .map(({user_id, name, email}) => ({
                        "value": user_id,
                        "label": `${name} - ${email}`,
                    }));

                return (
                    <div style={{"width": "inherit"}}>
                        <Grid
                            className="student-align"
                            container>
                            <AsyncSelect
                                cacheOptions
                                className="search-options"
                                defaultOptions={instructorList}
                                loadOptions={this.searchInstructors}
                                onChange={(value) => {
                                    this.onSelectChange(value, label, field);
                                }}
                                placeholder="Select an instructor..." />
                        </Grid>
                    </div>
                );
            }
            case "category": {
                const categoriesList = this.props.courseCategories
                    .map(({id, name}) => ({
                        "value": id,
                        "label": name,
                    }));
                // setting the category name if it was given an id in URL
                const currVal = this.state[label][fieldTitle];
                if (currVal && typeof currVal !== "object") {
                    const category = this.props.courseCategories.find(({id}) => Number(id) === Number(currVal));
                    if (category) {
                        this.setState((oldState) => ({
                            ...oldState,
                            [label]: {
                                ...oldState[label],
                                [fieldTitle]: {
                                    "value": currVal,
                                    "label": category.name,
                                }
                            }
                        }));
                    }
                }
                return (
                    <SearchSelect
                        className="search-options"
                        isClearable
                        onChange={(value) => {
                            this.onSelectChange(value, label, field);
                        }}
                        options={categoriesList}
                        placeholder="Choose a Category"
                        value={this.state[label][fieldTitle]} />
                );
            }
            case "select parent": {
                const currParentList = Object.values(this.props.parents)
                    .map(({user_id, name, email}) => ({
                        "value": user_id,
                        "label": `${name} - ${email}`,
                    }));
                return (
                    <CreatableSelect
                        className="search-options"
                        createOptionPosition="first"
                        isClearable
                        onChange={(value) => {
                            this.onSelectChange(value, label, field);
                        }}
                        onCreateOption={() => {
                            this.onSelectChange(null, label, field);
                        }}
                        options={currParentList}
                        value={this.state[label][fieldTitle]} />
                );
            }
            case "date":
                return (<Grid container>
                    <DatePicker
                        animateYearScrolling
                        error={!this.state[`${label}_validated`][field.name]}
                        format="MM/dd/yyyy"
                        label={fieldTitle}
                        margin="normal"
                        onChange={(date) => {
                            this.onDateChange(date, label, fieldTitle);
                        }}
                        openTo={fieldTitle === "Birthday" ? "year" : "day"}
                        value={this.state[label][fieldTitle]}
                        views={["year", "month", "date"]} />
                </Grid>);
            case "time":
                let time;
                if (this.state[label][fieldTitle] && typeof this.state[label][fieldTitle] !== "string") {
                    time = this.state[label][fieldTitle];
                } else if (typeof this.state[label][fieldTitle] === "string") {
                    time = utils.timeParser(this.state[label][fieldTitle]);
                }
                return (<Grid container>
                    <TimePicker
                        autoOk
                        error={!this.state[`${label}_validated`][field.name]}
                        label={fieldTitle}
                        onChange={(date) => {
                            this.setState((prevState) => {
                                prevState[label][fieldTitle] = date;
                                return {
                                    ...prevState,
                                    "nextSection": this.validateSection(),
                                };
                            });
                        }}
                        value={time} />
                </Grid>);
            default:
                const textValue = utils.weeklySessionsParser(this.state[label], field.name) || this.state[label][field.name];
                return (<TextField
                    disabled={disabled}
                    error={!this.state[label + "_validated"][field.name]}
                    fullWidth={field.full}
                    helperText={!this.state[label + "_validated"][field.name] ? field.name + " invalid" : ""}
                    InputLabelProps={{
                        "shrink": Boolean(textValue)
                    }}
                    label={field.name}
                    margin="normal"
                    multiline={field.multiline}
                    onBlur={(e) => {
                        e.preventDefault();
                        this.validateField.bind(this)(label, field, e.target.value);
                    }}
                    onChange={(e) => {
                        e.preventDefault();
                        this.handleFieldUpdate.bind(this)(label, field, e.target.value);
                    }}
                    required={field.required}
                    type={field.type === "number" ? "Number" : "text"}
                    value={textValue}
                />);
        }
    }

    // removes duplicates with arr1 from arr2 from search select field
    removeDuplicates(arr1, arr2) {
        let stringOtherValue, stringValue;
        arr1.forEach((value) => {
            if (value) {
                stringValue = value.value;
            } else {
                stringValue = "";
            }
            arr2.forEach((otherValue, j) => {
                if (otherValue) {
                    stringOtherValue = otherValue.value;
                } else {
                    stringOtherValue = "";
                }
                if (stringValue === stringOtherValue) {
                    arr2[j] = "1";
                }
            });
        });
        let uniqueVals = [...new Set(arr2)],
            indexOfString = -1;
        uniqueVals.forEach((value, i) => {
            if (typeof value === "string") {
                indexOfString = i;
            }
        });
        if (indexOfString > -1) {
            uniqueVals.splice(indexOfString, 1);
        }
        return uniqueVals;
    }

    addField(field, fieldIndex) {
        const currentForm = this.getFormObject();
        const param = [this.state.form, this.state.activeSection, fieldIndex];
        if (!Array.isArray(currentForm[this.state.activeSection])) {
            param.splice(2, 0, this.state.conditional);
        }
        this.props.registrationActions.addField(param);
        this.setState((prevState) => {
            // number of fields of the same type as the current field
            const {form, activeSection, conditional} = prevState;
            let section = this.props.registrationForm[form][activeSection];
            if (!Array.isArray(section)) {
                section = section[conditional];
            }
            const numSameTypeFields = section.reduce((count, otherField) =>
                count + (field === otherField.field), 0);
            if (Array.isArray(prevState[activeSection])) {
                prevState[activeSection][`${field} ${numSameTypeFields}`] = null;
                prevState[`${activeSection}_validated`][`${field} ${numSameTypeFields}`] = true;
            } else {
                prevState[activeSection][`${field} ${numSameTypeFields}`] = null;
                prevState[`${activeSection}_validated`][`${field} ${numSameTypeFields}`] = true;
            }
            return prevState;
        }, () => {
            sessionStorage.setItem("form", JSON.stringify(this.state));
        });
    }

    removeField(fieldIndex) {
        this.setState((prevState) => {
            const currentSectionFields = prevState[prevState.activeSection];
            const currentSectionValidationFields = prevState[`${prevState.activeSection}_validated`];
            let baseName;
            const newSectionFields = {};
            const newSectionValidationFields = {};
            let index = 0;
            let hasNotRemoved = true;

            Object.entries(currentSectionFields).forEach(([origFieldKey, fieldValue]) => {
                if (index === 0 && hasNotRemoved) {
                    baseName = origFieldKey;
                }
                if (index === fieldIndex && hasNotRemoved) {
                    hasNotRemoved = false;
                    return;
                }
                const newFieldName = index === 0 ? baseName : `${baseName} ${index + 1}`;
                newSectionFields[newFieldName] = fieldValue;
                newSectionValidationFields[newFieldName] = currentSectionValidationFields[origFieldKey];
                index++;
            });

            prevState[prevState.activeSection] = newSectionFields;
            prevState[`${prevState.activeSection}_validated`] = newSectionValidationFields;
            // save to session Storage
            sessionStorage.setItem("form", JSON.stringify(this.state));
            return prevState;
        }, () => {
            // delete field from redux store
            const param = [this.state.form, this.state.activeSection];
            this.props.registrationActions.removeField(param, fieldIndex, this.state.conditional);
            this.forceUpdate();
        });
        this.forceUpdate();
    }

    renderForm() {
        const {activeStep, nextSection} = this.state;
        let currentForm,
            steps;
        if (this.state.isSmallGroup) {
            const {form_type, Student} = this.props.registrationForm[this.state.form];
            currentForm = {
                form_type,
                Student,
            };
            steps = ["Student"];
        } else {
            currentForm = this.props.registrationForm[this.state.form];
            steps = currentForm.section_titles;
        }
        const section = this.getActiveSection();

        // conflict checking
        let checkForConflict = true, instructorID = null,
            start = null, end = null;
        switch (this.state.form) {
            case "course_details":
                if (this.state.activeSection === "Tuition" &&
                    this.state.Tuition && this.state.Tuition.Duration) {
                    instructorID = this.state["Course Info"]["Instructor"].value;
                    start = combineDateAndTime(
                        new Date(this.state["Course Info"]["Start Date"]),
                        new Date(this.state["Course Info"]["Start Time"]),
                    );
                    end = new Date(start);
                    // add duration and weeks for the end date
                    end.setMinutes(end.getMinutes() +
                        durationStringToNum[this.state.Tuition.Duration] * 60);
                    end.setDate(end.getDate() +
                        (this.state.Tuition["# of Weekly Sessions"] - 1) * 7);
                }
                break;
            case "tutoring":
                if (this.state.activeSection === "Tuition Quote Tool" &&
                    this.state.Schedule &&
                    this.state.Schedule["Number of Sessions"] &&
                    this.state.Schedule.Duration) {
                    instructorID = this.state["Tutor Selection"]["Instructor"].value;
                    const numSesh = this.state.Schedule["Number of Sessions"];
                    const {Duration} = this.state.Schedule;
                    start = combineDateAndTime(
                        new Date(this.state.Schedule["Start Date"]),
                        new Date(this.state.Schedule["Session Start Time"]),
                    );
                    end = new Date(start);
                    // add duration and weeks for the end date
                    end.setMinutes(end.getMinutes() + durationStringToNum[Duration] * 60);
                    end.setDate(end.getDate() + (numSesh - 1) * 7);
                }
                break;
            case "small_group":
                if (this.state.activeSection === "Tuition Quote Tool" &&
                    this.state["Group Details"]["# of Weekly Sessions"] &&
                    this.state["Group Details"].Duration) {
                    instructorID = this.state["Group Details"]["Instructor"].value;
                    const numSesh = this.state["Group Details"]["# of Weekly Sessions"];
                    const {Duration} = this.state["Group Details"];
                    start = combineDateAndTime(
                        new Date(this.state["Group Details"]["Start Date"]),
                        new Date(this.state["Group Details"]["Start Time"]),
                    );
                    end = new Date(start);
                    // add duration and weeks for the end date
                    end.setMinutes(end.getMinutes() + durationStringToNum[Duration] * 60);
                    end.setDate(end.getDate() + (numSesh - 1) * 7);
                }
                break;
            default:
                checkForConflict = false;
        }
        checkForConflict = Boolean(instructorID && start && end);
        return (
            <Stepper
                activeStep={activeStep}
                className="form-section"
                orientation="vertical">
                {
                    steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {
                                    section.map((field, j) => {
                                        // number of fields of the same type as the current field
                                        const numSameTypeFields = section.reduce((count, otherField) => field.field === otherField.field ? count + 1 : count, 0),
                                            reversedSection = [...section].reverse(),
                                            lastFieldOfType = reversedSection.find((otherField) => otherField.field === field.field);
                                        return (
                                            <div
                                                className="fields-wrapper"
                                                key={j}
                                                style={{}}>
                                                <Grid
                                                    className="student-align"
                                                    container>
                                                    {label === this.state.activeSection && this.renderField(field, label, j)}
                                                </Grid>
                                                <br />
                                                {
                                                    !this.props.match.params.course && numSameTypeFields < field.field_limit &&
                                                    field === lastFieldOfType &&
                                                    <Fab
                                                        aria-label="Add"
                                                        className="button add-student"
                                                        color="primary"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            this.addField(field.field, j);
                                                        }}
                                                        variant="extended">
                                                        <AddIcon />
                                                        Add {field.field}
                                                    </Fab>
                                                }

                                            </div>
                                        );
                                    })
                                }
                                <Grid
                                    container
                                    direction="row-reverse"
                                    justify="flex-start">
                                    <Grid
                                        item
                                        style={{
                                            "marginLeft": "2%",
                                        }}>
                                        <InstructorConflictCheck
                                            active={checkForConflict}
                                            start={start}
                                            instructorID={instructorID}
                                            eventID={this.props.match.params.id}
                                            end={end}
                                            onSubmit={this.handleNext}>
                                            <Button
                                                className="button primary"
                                                color="primary"
                                                disabled={!nextSection}
                                                variant="contained">
                                                {activeStep === steps.length - 1 ? this.props.submitPending ? "Submitting"
                                                    : ["course", "tutoring"].includes(this.state.form) ? "Add to Cart" : "Submit" : "Next"}
                                            </Button>
                                        </InstructorConflictCheck>
                                    </Grid>
                                    {
                                        activeStep !== 0 &&
                                        <Grid item>
                                            <Button
                                                className="button"
                                                color="secondary"
                                                onClick={this.handleBack}>
                                                Back
                                            </Button>
                                        </Grid>
                                    }
                                </Grid>
                            </StepContent>
                        </Step>
                    ))
                }
            </Stepper>
        );
    }

    // view after a submitted form
    renderSubmitted() {
        const currentForm = this.props.registrationForm[this.state.form];
        const steps = currentForm.section_titles;
        sessionStorage.removeItem("form");
        return (
            <div style={{
                "margin": "2%",
                "padding": "5px",
            }}>
                {
                    this.state.form !== "pricing" && <>
                        <Typography
                            align="left"
                            style={{"fontSize": "24px"}}>
                            You have successfully registered!
                        </Typography>
                        <Typography
                            align="left"
                            style={{"fontSize": "14px"}}>
                            An email will be sent to you to confirm your registration
                        </Typography>
                        <Button
                            align="left"
                            className="button"
                            component={NavLink}
                            onClick={() => {
                                this.props.registrationActions.resetSubmitStatus();
                            }}
                            style={{"margin": "20px"}}
                            to="/registration">REGISTER MORE
                        </Button>
                    </>
                }
                {
                    this.state.form === "pricing" &&
                    <Button
                        align="left"
                        className="button"
                        component={NavLink}
                        onClick={() => {
                            this.props.registrationActions.resetSubmitStatus();
                        }}
                        style={{"margin": "20px"}}
                        to="/adminportal/tuition-rules">VIEW PRICE RULES
                    </Button>
                }
                <div className="confirmation-copy">
                    <Typography
                        align="left"
                        className="title">Confirmation
                    </Typography>
                    {
                        steps.map((sectionTitle) => {
                            const sectionFields = this.state.conditional &&
                                !Array.isArray(this.getFormObject()[sectionTitle])
                                ? this.getFormObject()[sectionTitle][this.state.conditional]
                                : this.getFormObject()[sectionTitle];
                            return (
                                <div key={sectionTitle}>
                                    <Typography
                                        align="left"
                                        className="section-title">
                                        {sectionTitle}
                                    </Typography>
                                    {
                                        sectionFields.map(({field, type}) => {
                                            let fieldVal = this.state[sectionTitle][field];
                                            if (fieldVal && fieldVal.hasOwnProperty("value")) {
                                                fieldVal = fieldVal.value;
                                                if (type === "select parent" && typeof fieldVal === "number") {
                                                    fieldVal = this.props.parents[fieldVal].first_name;
                                                }
                                            }

                                            return (
                                                <div key={field}>
                                                    <Typography
                                                        align="left"
                                                        className="field-title">
                                                        {field || ""}
                                                    </Typography>
                                                    <Typography
                                                        align="left"
                                                        className="field-value">
                                                        {typeof fieldVal === "object" ? new Date(fieldVal).toLocaleString("eng-US") : fieldVal || "N/A"}
                                                    </Typography>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }

    renderCourseRegistrationSubmission() {
        if (this.props.registeredCourses) {
            const currentStudentID = this.state.Student.Student.value;
            let registeredCourseForm = this.props.registeredCourses[currentStudentID];
            registeredCourseForm = registeredCourseForm[registeredCourseForm.length - 1];
            return (<>
                <CompleteCourseRegistration
                    courseType={this.state.form}
                    registeredCourseForm={registeredCourseForm} />
            </>);
        }
    }

    renderTitle(id, type) {
        if (this.props.title) {
            return this.props.title;
        }
        let title = "";
        switch (type) {
            case "course": {
                const course = this.props.courses[id];
                title = course ? `${course.title} ` : "";
                break;
            }
            case "student": {
                const student = this.props.students[id];
                title = student ? `${student.name} ` : "";
                break;
            }
            case "parent": {
                const parent = this.props.parents[id];
                title = parent ? `${parent.name} ` : "";
                break;
            }
            case "course_details": {
                const course = this.props.courses[id];
                title = course ? `${course.title} ` : "";
                break;
            }
            case "tutoring": {
                title = "New ";
                break;
            }
            default:
                title = "";
                break;
        }
        return `${title} ${type.split("_").join(" ")} ${this.props.match.params.edit === "edit" ? "Edit" : "Registration"}`;
    }

    render() {
        if (!this.state.hasLoaded || !this.props.students) {
            return <Loading />;
        }
        return (
            <Grid
                className=""
                container>
                {/* Determine if finished component is displayed. If not, then don't prompt */}
                {this.state.submitPending ? "" : <Prompt message="Are you sure you want to leave?" />}
                <Grid
                    item
                    xs={12}>
                    <Paper className="registration-form paper">
                        {
                            !this.props.location.pathname.includes("adminportal") &&
                           
                        }
                        <Typography
                            align="left"
                            className="heading">
                            {this.renderTitle(this.props.match.params.id, this.props.match.params.type)}
                        </Typography>
                        {
                            this.props.submitStatus !== "success"
                                ? this.props.registrationForm[this.state.form]
                                    ? this.renderForm()
                                    : <Typography>
                                        Sorry! The form is unavailable.
                                      </Typography>
                                : this.state.form !== "course" && this.state.form !== "tutoring" &&
                                    this.state.form !== "small_group"
                                    ? this.renderSubmitted()
                                    : this.renderCourseRegistrationSubmission()
                        }
                        <Modal
                            aria-describedby="simple-modal-description"
                            aria-labelledby="simple-modal-title"
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({"existingUser": false});
                            }}
                            open={this.state.existingUser}>
                            <div className="existing-user-popup">
                                <Typography
                                    id="modal-title"
                                    variant="h6">
                                    {"The user you are entering already exists in the database! Please enter a new email, and check for spelling."}
                                </Typography>
                                <Button
                                    className="button primary"
                                    color="primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({"existingUser": false});
                                    }}>
                                    {"I will enter a new email"}
                                </Button>
                            </div>
                        </Modal>
                        {/* Error message on failed submit */}
                        <Dialog
                            aria-describedby="alert-dialog-description"
                            aria-labelledby="alert-dialog-title"
                            onClose={() => {
                                this.props.registrationActions.resetSubmitStatus();
                                this.setState({
                                    "submitPending": false,
                                }, () => {
                                    sessionStorage.setItem("form", JSON.stringify(this.state));
                                });
                            }}
                            open={this.props.submitStatus === "fail"}>
                            <DialogTitle disableTypography id="alert-dialog-title">Failed to Submit</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    There was an error submitting the form. Check all fields and try again.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    autoFocus
                                    color="primary"
                                    onClick={() => {
                                        this.props.registrationActions.resetSubmitStatus();
                                        this.setState({
                                            "submitPending": false,
                                        }, () => {
                                            sessionStorage.setItem("form", JSON.stringify(this.state));
                                        });
                                    }}>
                                    Go back
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => ({
    "courses": state.Course.NewCourseList,
    "courseCategories": state.Course.CourseCategories,
    "registrationForm": state.Registration.registration_form,
    "registeredCourses": state.Registration.registered_courses,
    "currentParent": state.Registration.CurrentParent,
    "submitStatus": state.Registration.submitStatus,
    "parents": state.Users.ParentList,
    "students": state.Users.StudentList,
    "instructors": state.Users.InstructorList,
    "requestStatus": state.RequestStatus,
    "isAdmin": state.auth.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch),
    "apiActions": bindActionCreators(apiActions, dispatch),
    "adminActions": bindActionCreators(adminActions, dispatch),
    dispatch,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form));
