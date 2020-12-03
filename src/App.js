import React, {useEffect, useState} from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import Moment from "react-moment";
import momentTimezone from "moment-timezone";
import moment from "moment";
import Navigation from "./components/Navigation/Navigation";

import "./theme/theme.scss";
import MuiPickersUtilsProvider from "@material-ui/pickers/MuiPickersUtilsProvider";
import MomentUtils from "@date-io/moment";
import axios from "axios";


import {GoogleLogin, GoogleLogout} from "react-google-login";
import creds from "./credentials.json";
import gapi from "gapi";
console.log(gapi);

Moment.globalMoment = momentTimezone;
Moment.globalTimezone = "America/Los_Angeles";

const responseGoogle = (response) => {
    console.log(response);
};

const App = () => {
    const [status, setStatus] = useState();

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState({});
    const onSuccess = (response) => {
        setStatus(response);
    };
    // status.tokenObj.accessToken
    const onlogoutsuccess = () => {
        setStatus();
    };

    const loadTeacher = (id) => async () => {
        try {
            const resp = await axios.get(`https://classroom.googleapis.com/v1/courses/${id}/teachers`, {
                "headers": {
                    "Authorization": `Bearer ${status.tokenObj.access_token}`,
                },
            });
            console.log(resp)
            setTeachers((prev) => ({
                ...prev,
                [id]: resp.data.teachers
            }));
        } catch {
            alert("Error loading teacher")
        }
    };

    useEffect(() => {
        if (status) {
            (async () => {
                try {
                    const resp = await axios.get("https://classroom.googleapis.com/v1/courses", {
                        "params": {
                            "studentId": status.profileObj.googleID,
                        },
                        "headers": {
                            "Authorization": `Bearer ${status.tokenObj.access_token}`,
                        },
                    });
                    setCourses(resp.data.courses);
                } catch {
                    alert("Error loading courses!");
                }
            })();
        }
    }, [status]);
    console.log(teachers);
    return (
        <div>
            {status ?
                <GoogleLogout
                    clientId="1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com"
                    onLogoutSuccess={onlogoutsuccess} /> :
                <GoogleLogin
                    buttonText="Login"
                    clientId="1059849289788-0tpge112i2bfe5llak523fdopu8foul7.apps.googleusercontent.com"
                    isSignedIn
                    onFailure={responseGoogle}
                    onSuccess={onSuccess}
                    scope="https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly" />}
            Status: {
            status?.profileObj.name || "logged out"
            }
            {courses.length > 0 &&
                courses.map(({name, id}) => <div key={id} onClick={loadTeacher(id)}>
                    Course: {name}
                    {teachers[id] && (
                        <div>
                            Teachers <br />
                            <ul>
                                {teachers[id].map(({profile}) => (
                                    <li>
                                        {profile.name.fullName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>)}
        </div>
    );
};

export default App;
