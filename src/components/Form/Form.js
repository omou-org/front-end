import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../actions/registrationActions";
import * as userActions from "../../actions/userActions";
import * as apiActions from "../../actions/apiActions";
import * as types from "actions/actionTypes";
import React, {Component} from "react";
import {Prompt} from "react-router";
import {NavLink, withRouter} from "react-router-dom";
import CreatableSelect, {makeCreatableSelect} from 'react-select/creatable';
import {updateStudent, updateParent} from "reducers/usersReducer";
import {updateCourse} from "reducers/courseReducer";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import {Typography} from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import {InputValidation} from "../FeatureViews/Registration/Validations";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Clear";

// Outside React Component
import SearchSelect from "react-select";
import BackButton from "../BackButton.js";
import Modal from "@material-ui/core/Modal";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DatePicker, TimePicker, MuiPickersUtilsProvider,} from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";

const parseGender = {
    "M": "Male",
    "F": "Female",
    "U": "Do not disclose",
};

const numToDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatDate = (date) => {
    if (!date) {
        return null;
    }
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
};

const formatTime = (time) => {
    if (!time) {
        return null;
    }
    const [hrs, mins] = time.substring(1).split(":");
    const hours = parseInt(hrs, 10);
    return `${hours % 12 === 0 ? 12 : hours % 12}:${mins} ${hours >= 12 ? "PM" : "AM"}`
}

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditional: "",
            nextSection: false,
            activeStep: 0,
            activeSection: "",
            form: "",
            submitPending: false,
            preLoaded: false,
            existingUser: false,
            "hasLoaded": false,
        };
    }

    componentWillMount() {
        let prevState = JSON.parse(sessionStorage.getItem("form") || null);
        const formType = this.props.computedMatch.params.type;
        const {id} = this.props.computedMatch.params;

        this.props.userActions.fetchStudents();
        this.props.userActions.fetchParents();
        this.props.userActions.fetchInstructors();
        this.props.registrationActions.initializeRegistration();
        if (this.props.computedMatch.params.edit === "edit") {
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
                            "Education": {
                                "College": "",
                                "Degree(s)": "",
                                "Minor(s)": "",
                            },
                            "Experience": {
                                "Subject(s) Tutor Can Teach": "",
                                "Specialties": "",
                                "Background": "",
                                "Notes": "",
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
                            "Education_validated": {
                                "College": true,
                                "Degree(s)": true,
                                "Minor(s)": true,
                            },
                            "Experience_validated": {
                                "Subject(s) Tutor Can Teach": true,
                                "Specialties": true,
                                "Background": true,
                                "Notes": true,
                            },
                            "form": formType,
                            "activeSection": "Basic Information",
                            "nextSection": true,
                            "preLoaded": true,
                        };
                    }
                    break;
                }
                case "course":{
                    console.log("editing a course!");
                    if(id && this.props.registeredCourses){
                        if(id.indexOf("+")>=0){
                            let studentID = id.substring(0,id.indexOf("+"));
                            let courseID = id.substring(id.indexOf("+")+1);
                            let {form} = this.props.registeredCourses[studentID].find(({course_id}) => {
                                return course_id === courseID;
                            });
                            console.log(form);
                            prevState = {
                                ...form,
                            };
                            console.log(prevState);
                        }
                    }
                    break;
                }
                case "tutoring":{
                    if(id && this.props.registeredCourses){
                        if(id.indexOf("+")>=0){
                            let studentID = id.substring(0,id.indexOf("+"));
                            let courseID = id.substring(id.indexOf("+")+1);
                            let {form} = this.props.registeredCourses[studentID].find(({course_id}) => {
                                return course_id === courseID;
                            });
                            prevState = {
                                ...form
                            };
                        }
                    }
                    break;
                }
                case "small_group":{
                    if(id && this.props.registeredCourses){
                        if(id.indexOf("+")>=0){
                            let studentID = id.substring(0,id.indexOf("+"));
                            let courseID = id.substring(id.indexOf("+")+1);
                            let {form} = this.props.registeredCourses[studentID].find(({course_id}) => {
                                return course_id === courseID;
                            });
                            prevState = {
                                ...form
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
            prevState["submitPending"] ||
            (id && this.props.computedMatch.params.edit !== "edit")) {
            if (this.props.registrationForm[formType]) {
                this.setState((oldState) => {
                    const formContents = JSON.parse(
                        JSON.stringify(this.props.registrationForm[formType])
                    );
                    let NewState = {
                        ...oldState,
                        "activeSection": formContents.section_titles[0],
                        "form": formType,
                    };
                    let course = null;
                    if (this.props.courses.hasOwnProperty(id)) {
                        const {course_id, title} =
                            this.props.courses[this.props.computedMatch.params.id];
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
        } else if (prevState && !prevState["submitPending"]) {
            if (formType === "tutoring" &&
                this.props.courses.hasOwnProperty(id)) {
                prevState["Tutor Selection"]["Course / Subject"] =
                    this.props.courses[id].title;
            }
            this.setState(prevState);
        }
    }

    componentDidMount() {
        const {id, edit, "type": formType} = this.props.computedMatch.params;
        if (!this.props.isAdmin && (formType === "instructor" || formType === "course_details")) {
            this.props.history.replace("/PageNotFound");
        }
        // this.props.userActions.fetchParents();
        // this.props.userActions.fetchStudents();
        // this.props.userActions.fetchInstructors();
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
                                `/account/student/${id}/`, {
                                "headers": {
                                    "Authorization": `Token ${this.props.token}`,
                                },
                            });
                            // succesful request
                            newAction(types.FETCH_STUDENT_SUCCESSFUL, response);
                            student = updateStudent({}, id, response.data)[id];
                            const parents = await apiActions.instance.get(
                                `/account/parent/`, {
                                "headers": {
                                    "Authorization": `Token ${this.props.token}`,
                                },
                            });
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
                                        "Select Parent":{
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
                                        }: prevState["Parent Information"],
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
                                `/course/catalog/${id}/`, {
                                    "headers": {
                                        "Authorization": `Token ${this.props.token}`,
                                    },
                                });
                            // succesful request
                            newAction(types.FETCH_COURSE_SUCCESSFUL, response);
                            course = updateCourse({}, id, response.data)[id];
                            const instructors = await apiActions.instance.get(
                                `/account/parent/`, {
                                "headers": {
                                    "Authorization": `Token ${this.props.token}`,
                                },
                            });
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
                                this.setState({
                                    "Course Info": {
                                        "Course Name": course.title,
                                        "Description": course.description,
                                        "Instructor":
                                            inst
                                                ? {
                                                    "value": course.instructor_id,
                                                    "label": `${inst.name} - ${inst.email}`,
                                                }
                                                : null,
                                        "Tuition": Math.round(course.tuition),
                                        "Day": numToDay[course.schedule.days[0]],
                                        "Start Date": formatDate(course.schedule.start_date),
                                        "End Date": formatDate(course.schedule.end_date),
                                        "Start Time": formatTime(course.schedule.start_time),
                                        "End Time": formatTime(course.schedule.end_time),
                                        "Capacity": course.capacity,
                                    },
                                    "preLoaded": true,
                                });
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
                                `/account/parent/${id}/`, {
                                    "headers": {
                                        "Authorization": `Token ${this.props.token}`,
                                    },
                                });
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
        })
    }

    getFormObject() {
        return this.props.registrationForm[this.state.form];
    }

    getActiveSection() {
        const section = this.getFormObject()[this.state.activeSection];
        if (Array.isArray(section)) {
            return section;
        } else {
            return section[this.state.conditional];
        }
    }

    onBack = () => {
        // clear session storage
        sessionStorage.removeItem("form");
        this.props.registrationActions.resetSubmitStatus();
    }

    validateSection() {
        let currSectionTitle;
        if(this.state.isSmallGroup){
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
                } else {
                    return false;
                }
            });
        }
        return nextSectionInput;
    }

    // Progresses to next section in registration form
    handleNext() {
        let currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        let section = this.props.registrationForm[this.state.form][this.state.activeSection];
        if(this.state.isSmallGroup){
            currSectionTitle = "Student";
            section = this.props.registrationForm[this.state.form]["Student"];
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
                        if (this.props.computedMatch.params.edit === "edit") {
                            console.log(this.props.computedMatch.params.id);
                            this.props.registrationActions.submitForm(this.state, this.props.computedMatch.params.id);
                        } else if(this.state.form === "small_group") {
                            if(this.state["Group Type"]["Select Group Type"] === "New Small Group"){
                                this.props.apiActions.submitNewSmallGroup(this.state);
                            } else {
                                this.props.registrationActions.submitForm(this.state);
                            }

                        } else {
                            this.props.registrationActions.submitForm(this.state);
                        }
                    }
                    return {
                        submitPending: true,
                    };
                } else {
                    const conditionalField = this.getConditionalFieldFromCurrentSection(),
                        nextActiveStep = oldState.activeStep + 1,
                        nextActiveSection = this.getFormObject().section_titles[nextActiveStep];
                    let newState = {
                        activeStep: nextActiveStep,
                        activeSection: nextActiveSection,
                        conditional: conditionalField ? conditionalField : oldState.conditional,
                        nextSection: false,
                    };
                    if (conditionalField) {
                        let formContents = this.getFormObject(),
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
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    // Regresses to previous section in registration form
    handleBack() {
        this.setState((oldState) => {
            if (oldState.activeStep !== 0 && oldState.activeSection) {
                return {
                    activeStep: oldState.activeStep - 1,
                    activeSection: this.getFormObject().section_titles[oldState.activeStep - 1],
                };
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    handleReset() {
        this.setState({activeStep: 0});
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
                nextSection: this.validateSection(),
            }, () => {
                sessionStorage.setItem("form", JSON.stringify(this.state));
            });
        });
    }

    onSelectChange(value, label, field) {
        if (field.type === "select parent") {
            if (value) {
                this.setState((OldState) => {
                    let NewState = OldState;
                    const selectedParentID = value.value;
                    const parent = this.props.parents[selectedParentID];
                    NewState[label] = {
                        "Select Parent": {
                            value: selectedParentID,
                            label: `${selectedParentID}: ${parent.name} - ${parent.email}`,
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
                    this.setState({nextSection: true});
                });
            } else {
                this.setState((OldState) => {
                    let NewState = OldState;
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
                let NewState = OldState;
                NewState[label][field.name] = value;
                return NewState;
            }, () => {
                this.validateField(this.state.activeSection, field, value);
            });
        }
    }

    renderField(field, label, fieldIndex) {
        const fieldTitle = field.name;
        const disabled = this.state["Parent Information"] && Boolean(this.state["Parent Information"]["Select Parent"]) && this.state.activeSection === "Parent Information";
        switch (field.type) {
            case "select":
                return (
                    <FormControl className="form-control">
                        <InputLabel shrink={Boolean(this.state[label][fieldTitle])}>
                            {fieldTitle}
                        </InputLabel>
                        <Select
                            disabled={disabled}
                            onChange={({"target": {value}}) => {
                                this.onSelectChange(value, label, field);
                            }}
                            value={this.state[label][fieldTitle]}>
                            {
                                field.options.map((option) => (
                                    <MenuItem
                                        key={option}
                                        value={option}>
                                        {option}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                );
            case "course": {
                let courseList;
                if(fieldTitle === "Select Group"){
                    // filter for all of the groups
                    courseList = Object.keys(this.props.courses)
                        .filter((courseID) =>
                            this.props.courses[courseID].capacity >
                            this.props.courses[courseID].roster.length &&
                            this.props.courses[courseID].capacity <= 5
                        )
                        .map((courseID) => ({
                            "value": courseID,
                            "label": this.props.courses[courseID].title,
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
                    <div style={{width: "inherit"}}>
                        <Grid container className={"student-align"} spacing={2000}>
                            <SearchSelect
                                disabled={disabled}
                                value={this.state[label][fieldTitle]}
                                onChange={(value) => {
                                    this.onSelectChange(value, label, field);
                                }}
                                options={courseList}
                                className="search-options" />
                            {
                                (fieldCount > 1) && !disabled &&
                                <RemoveIcon color="primary" aria-label="Add" variant="extended"
                                            className="button-remove-student"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                // deletes answer field from state
                                                this.removeField(fieldIndex);
                                                this.forceUpdate();
                                            }}>
                                </RemoveIcon>
                            }
                        </Grid>
                    </div>
                );
            }
            case "student": {
                let studentList = [];

                if(this.props.currentParent){
                    this.props.currentParent.student_list.forEach((studentID) => {
                        if(this.props.students[studentID]){
                            let {user_id, name, email} = this.props.students[studentID];
                            studentList.push({
                                value: user_id,
                                label: `${name} - ${email}`,
                            });
                        }
                    });
                } else {
                    studentList = Object.values(this.props.students)
                        .map(({user_id, name, email}) => ({
                            value: user_id,
                            label: `${name} - ${email}`,
                        }));
                }


                studentList = this.removeDuplicates(Object.values(this.state[label]), studentList);

                // count # of course fields in current section
                const studentCount = this.getActiveSection()
                    .reduce((total, {type}) => total + (type === "student"), 0);

                return (
                    <div style={{width: "inherit"}}>
                        <Grid container className={"student-align"} spacing={2000}>
                            <SearchSelect
                                disabled={disabled}
                                value={this.state[label][fieldTitle] ? this.state[label][fieldTitle] : ""}
                                onChange={(value) => {
                                    this.onSelectChange(value, label, field);
                                }}
                                options={studentList}
                                className="search-options" />
                            {
                                studentCount > 1 && !disabled &&
                                <RemoveIcon color="primary" aria-label="Add" variant="extended"
                                            className="button-remove-student"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                // deletes answer field
                                                this.removeField(fieldIndex);
                                                this.forceUpdate();
                                            }}>
                                </RemoveIcon>
                            }
                        </Grid>
                    </div>
                );
            }
            case "instructor": {
                let instructorList = this.props.instructors;

                instructorList = Object.values(instructorList).map(({user_id, name, email}) => ({
                    value: user_id,
                    label: `${name} - ${email}`,
                }));
                instructorList = this.removeDuplicates(Object.values(this.state[label]), instructorList);
                return (<div style={{width: "inherit"}}>
                    <Grid container className="student-align">
                        <SearchSelect
                            disabled={disabled}
                            value={this.state[label][fieldTitle] ? this.state[label][fieldTitle] : ""}
                            onChange={(value) => {
                                this.onSelectChange(value, label, field);
                            }}
                            options={instructorList}
                            className="search-options" />
                    </Grid>
                </div>);
            }
            case "select parent": {
                const currParentList = Object.values(this.props.parents)
                    .map(({user_id, name, email}) => ({
                        value: user_id,
                        label: `${name} - ${email}`,
                    }));
                return (
                    <CreatableSelect
                        createOptionPosition="first"
                        className="search-options"
                        isClearable
                        onChange={(value) => {
                            this.onSelectChange(value, label, field);
                        }}
                        onCreateOption={() => {
                            this.onSelectChange(null, label, field);
                        }}
                        value={this.state[label][fieldTitle]}
                        options={currParentList}
                    />
                );
            }
            case "date":
                return <Grid container>
                        <DatePicker
                            animateYearScrolling
                            margin="normal"
                            label={fieldTitle}
                            value={this.state[label][fieldTitle]}
                            onChange={(date) =>{ this.setState((prevState)=>{
                                prevState[label][fieldTitle] = date;
                                return prevState;
                            }) }}
                            openTo={fieldTitle==="Birthday" ? "year" :"day"}
                            error={!this.state[label + "_validated"][field.name]}
                            format="MM/dd/yyyy"
                            views={["year", "month", "date"]}
                        />
                    </Grid>;
            case "time":
                let time;
                if(this.state[label][fieldTitle] && typeof this.state[label][fieldTitle] !== "string"){
                    time = this.state[label][fieldTitle];
                } else if(typeof this.state[label][fieldTitle] === "string"){
                    time = new Date();
                    time.setHours(Number(this.state[label][fieldTitle].substring(0,this.state[label][fieldTitle].indexOf(":"))));
                    time.setMinutes(Number(this.state[label][fieldTitle].substring(this.state[label][fieldTitle].indexOf(":")+1,this.state[label][fieldTitle].indexOf(" "))));
                    time.setSeconds(0);
                }
                return <Grid container>
                    <TimePicker autoOk
                                error={!this.state[label + "_validated"][field.name]}
                                label={fieldTitle}
                                value={time}
                                onChange={(date) =>{ this.setState((prevState)=>{
                                    prevState[label][fieldTitle] = date;
                                    return prevState;
                                }) } }/>
                </Grid>;
            default:
                return <TextField
                    label={field.name}
                    multiline={field.multiline}
                    margin="normal"
                    disabled={disabled}
                    value={this.state[label][field.name]}
                    error={!this.state[label + "_validated"][field.name]}
                    helperText={!this.state[label + "_validated"][field.name] ? field.name + " invalid" : ""}
                    type={field.type === "number" ? "Number" : "text"}
                    required={field.required}
                    InputLabelProps={{
                        "shrink": Boolean(this.state[label][field.name])
                    }}
                    fullWidth={field.full}
                    onChange={(e) => {
                        e.preventDefault();
                        this.handleFieldUpdate.bind(this)(label, field, e.target.value);
                    }}
                    onBlur={(e) => {
                        e.preventDefault();
                        this.validateField.bind(this)(label, field, e.target.value);
                    }}
                />
        }
    }

    // removes duplicates with arr1 from arr2 from search select field
    removeDuplicates(arr1, arr2) {
        let stringValue, stringOtherValue;
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
        let uniqueVals = [...new Set(arr2)], indexOfString = -1;
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
        let param = [this.state.form, this.state.activeSection, fieldIndex];
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
            const currentSectionFields = prevState[prevState["activeSection"]];
            const currentSectionValidationFields = prevState[`${prevState["activeSection"]}_validated`];
            let baseName;
            let newSectionFields = {};
            let newSectionValidationFields = {};
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
                let newFieldName = index === 0 ? baseName : `${baseName} ${index + 1}`;
                newSectionFields[newFieldName] = fieldValue;
                newSectionValidationFields[newFieldName] = currentSectionValidationFields[origFieldKey];
                index++;
            });

            prevState[prevState["activeSection"]] = newSectionFields;
            prevState[`${prevState["activeSection"]}_validated`] = newSectionValidationFields;
            //save to session Storage
            sessionStorage.setItem("form", JSON.stringify(this.state));
            return prevState;
        }, () => {
            //delete field from redux store
            let param = [this.state.form, this.state.activeSection];
            this.props.registrationActions.removeField(param, fieldIndex, this.state.conditional);
            this.forceUpdate();
        });
        this.forceUpdate();
    }

    renderForm() {
        let {activeStep, nextSection} = this.state;
        let currentForm,
            steps;
        if(this.state.isSmallGroup){
            let {form_type, Student} = this.props.registrationForm[this.state.form];
            currentForm = {
                form_type: form_type,
                Student: Student,
            };
            steps = ["Student"];
        } else {
            currentForm = this.props.registrationForm[this.state.form];
            steps = currentForm.section_titles;
        }
        let section = this.getActiveSection();
        return (
            <Stepper
                activeStep={activeStep}
                orientation="vertical"
                className="form-section">
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
                                            <div key={j} className="fields-wrapper" style={{}}>
                                                <Grid container className="student-align">
                                                    {label === this.state.activeSection ? this.renderField(field, label, j) : ""}
                                                </Grid>
                                                <br />
                                                {
                                                    !this.props.computedMatch.params.course && numSameTypeFields < field.field_limit &&
                                                    field === lastFieldOfType &&
                                                    <Fab color="primary" aria-label="Add" variant="extended"
                                                        className="button add-student"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            this.addField(field.field, j);
                                                        }}>
                                                        <AddIcon />
                                                        Add {field.field}
                                                    </Fab>
                                                }

                                            </div>
                                        );
                                    })
                                }
                                <div className="controls">
                                    <Button
                                        disabled={activeStep === 0}
                                        color="secondary"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleBack();
                                        }}
                                        className={`button ${activeStep === 0 ? "hide" : ""}`}>
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!nextSection}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleNext();
                                        }}
                                        className="button primary">
                                        {activeStep === steps.length - 1 ? this.props.submitPending ? "Submitting" : "Submit" : "Next"}
                                    </Button>
                                </div>
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
                margin: "2%",
                padding: "5px",
            }}>
                <Typography align="left" style={{fontSize: "24px"}}>
                    You have successfully registered!
                </Typography>
                <Typography align="left" style={{fontSize: "14px"}}>
                    An email will be sent to you to confirm your registration
                </Typography>
                <Button
                    align="left"
                    component={NavLink}
                    to="/registration"
                    onClick={() => {
                        this.props.registrationActions.resetSubmitStatus();
                    }}
                    style={{margin: "20px"}}
                    className="button">Back to Registration</Button>
                <div className="confirmation-copy">
                    <Typography className="title" align="left">Confirmation Copy</Typography>
                    {
                        steps.map((sectionTitle) => (
                            <div key={sectionTitle}>
                                <Typography
                                    className="section-title"
                                    align="left">
                                    {sectionTitle}
                                </Typography>
                                {
                                    this.getFormObject()[sectionTitle].map(({field, type}) => {
                                        let fieldVal = this.state[sectionTitle][field];
                                        if (fieldVal && fieldVal.hasOwnProperty("value")) {
                                            fieldVal = fieldVal.value;
                                            if (type === "select parent" && typeof fieldVal === "number") {
                                                fieldVal = this.props.parents[fieldVal].first_name;
                                            }
                                        }

                                        return (
                                            <div key={field}>
                                                <Typography className="field-title" align="left">
                                                    {field || ""}
                                                </Typography>
                                                <Typography className="field-value" align="left">
                                                    { typeof fieldVal === "object" ? new Date(fieldVal).toISOString().substring(0,10) :  fieldVal || "N/A"}
                                                </Typography>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }

    renderCourseRegistrationSubmission(){
        if(this.props.registeredCourses){

            let currentStudentID = this.state.Student.Student.value;
            let registeredCourseForm = this.props.registeredCourses[currentStudentID];
            registeredCourseForm = registeredCourseForm[registeredCourseForm.length - 1];

            let currentStudentName = registeredCourseForm.display.student_name;
            let currentCourseTitle = registeredCourseForm.display.course_name;


            return <div>
                <h3>{currentStudentName}</h3>
                <h3>{currentCourseTitle}</h3>
                <Button component={NavLink} to={"/registration"}
                        className={"button"}>Register More</Button>
                <Button component={NavLink} to={"/registration/cart"}
                        className={"button"}>Checkout</Button>
            </div>
        } else {
            // this.props.registrationActions.initializeRegistration();
            return () => {
                let currentStudentID = this.state.Student.Student.value;
                let registeredCourseForm = this.props.registeredCourses[currentStudentID];
                registeredCourseForm = registeredCourseForm[registeredCourseForm.length - 1];

                let currentStudentName = registeredCourseForm.display.student_name;
                let currentCourseTitle = registeredCourseForm.display.course_name;


                return <div>
                    <h3>{currentStudentName}</h3>
                    <h3>{currentCourseTitle}</h3>
                    <Button component={NavLink} to={"/registration"}
                            className={"button"}>Register More</Button>
                    <Button component={NavLink} to={"/registration/cart"}
                            className={"button"}>Checkout</Button>
                </div>
            }
        }

    }

    renderTitle(id, type) {
        let title = "";
        switch (type) {
            case "course": {
                const course = this.props.courses[id];
                title = course ? course.title + " ": "";
                break;
            }
            case "student": {
                const student = this.props.students[id];
                title = student ? student.name + " " : "";
                break;
            }
            case "parent": {
                const parent = this.props.parents[id];
                title = parent ? parent.name + " ": "";
                break;
            }
            case "course_details": {
                const course = this.props.courses[id];
                title = course ? course.title + " " : "";
                break;
            }
            case "tutoring":{
                title = "New ";
                break;
            }
            default:
                title = "";
                break;
        }
        return `${title} ${type.split("_").join(" ")} ${this.props.computedMatch.params.edit === "edit" ? "Edit" : "Registration"}`
    }

    render() {
        if (!this.state.hasLoaded) {
            return "Loading...";
        }
        return (
            <Grid container className="">
                {/* Determine if finished component is displayed. If not, then don't prompt */}
                {this.state.submitPending ? "" : <Prompt message="Are you sure you want to leave?" />}
                <Grid item xs={12}>
                    <Paper className={"registration-form paper"}>
                        <BackButton
                            warn={true}
                            onBack={this.onBack}
                            alertMessage={"Do you want to save your changes?"}
                            alertConfirmText={"Yes, save changes"}
                            confirmAction={"saveForm"}
                            alertDenyText={"No, don't save changes"}
                            denyAction={"default"}
                        />
                        <Typography className="heading" align="left">
                            {this.renderTitle(this.props.computedMatch.params.id, this.state.form)}
                        </Typography>
                        {
                            this.props.submitStatus !== "success" ?
                                this.props.registrationForm[this.state.form] ?
                                    this.renderForm() :
                                    <Typography>
                                        Sorry! The form is unavailable.
                                    </Typography>
                                : this.state.form !== "course"  && this.state.form !== "tutoring"
                                    && this.state.form !== "small_group" ?
                                    this.renderSubmitted() :
                                    this.renderCourseRegistrationSubmission()
                        }
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.existingUser}
                            onClick={(e) => {
                                e.preventDefault();
                                this.setState({existingUser: false})
                            }}>
                            <div className="existing-user-popup">
                                <Typography variant="h6" id="modal-title">
                                    {"The user you are entering already exists in the database! Please enter a new email, and check for spelling."}
                                </Typography>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.setState({existingUser: false})
                                    }}
                                    color="primary"
                                    className="button primary">
                                    {"I will enter a new email"}
                                </Button>
                            </div>
                        </Modal>
                        {/* Error message on failed submit */}
                        <Dialog
                            open={this.props.submitStatus === "fail"}
                            onClose={() => {
                                this.props.registrationActions.resetSubmitStatus();
                                this.setState({
                                    "submitPending": false,
                                }, () => {
                                    sessionStorage.setItem("form", JSON.stringify(this.state));
                                });
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                            <DialogTitle id="alert-dialog-title">Failed to Submit</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    There was an error submitting the form. Check all fields and try again.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {
                                    this.props.registrationActions.resetSubmitStatus();
                                    this.setState({
                                        "submitPending": false,
                                    }, () => {
                                        sessionStorage.setItem("form", JSON.stringify(this.state));
                                    });
                                }} color="primary" autoFocus>
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
    "courses": state.Course["NewCourseList"],
    "courseCategories": state.Course["CourseCategories"],
    "registrationForm": state.Registration["registration_form"],
    "registeredCourses": state.Registration["registered_courses"],
    "currentParent": state.Registration["CurrentParent"],
    "submitStatus": state.Registration["submitStatus"],
    "parents": state.Users["ParentList"],
    "students": state.Users["StudentList"],
    "instructors": state.Users["InstructorList"],
    "requestStatus": state.RequestStatus,
    "token": state.auth.token,
    "isAdmin": state.auth.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
    "userActions": bindActionCreators(userActions, dispatch),
    "apiActions": bindActionCreators(apiActions, dispatch),
    dispatch,
});

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form));
