import React, { useCallback, useEffect, useMemo, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Link, useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import NoListAlert from "../../../OmouComponents/NoListAlert";





function EnrollmentSessionRow({sessionsData, enrollmentData, highlightSession}) {
    console.log(enrollmentData)
    console.log(enrollmentData.course)
    console.log(enrollmentData.enrollment.course.courseType)
    const {course, id} = enrollmentData.enrollment
return (
    <Grid container spacing={1}> 
                            {sessionsData.sessions.length !== 0 ?
                                sessionsData.sessions.map((session) => {
                                    // const {
                                    //     date,
                                    //     startTime,
                                    //     endTime,
                                    //     hourlyTuition,
                                    //     id,
                                    //     course_id,
                                    //     instructor

                                    
                                    // } = sessionDataParse(session);
                                    
                                
                                    
                                
                                    return (
                                        
                                        <Grid className="accounts-table-row"
                                            component={Link}
                                            item
                                            key={id}
                                            to={
                                                course.courseType === "tutoring"
                                                    ? `/scheduler/view-session/${session.course.id}/${id}/${session.instructor}`
                                                    : `/registration/course/${session.course.id}`
                                            }
                                            xs={12}>
                                            <Paper className={`session-info
                                                ${highlightSession && " active"}
                                                ${
                                                session.id == session.id &&
                                                "upcoming-session"
                                                }`}
                                                component={Grid}
                                                container
                                                square>
                                                <Grid item xs={1} />
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={session.startDate}
                                                            format="M/D/YYYY"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    <Typography align="left">
                                                        <Typography align="left">
                                                            <Moment
                                                                date={session.startDate}
                                                                format="dddd"
                                                            />
                                                        </Typography>
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography align="left">
                                                        <Moment
                                                            date={session.startTime}
                                                            format="h:mm A"
                                                        />
                                                        {" - "}
                                                        <Moment
                                                            date={session.endTime}
                                                            format="h:mm A"
                                                        />
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Typography align="left">${session.hourlyTuition}</Typography>
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {/* MUST FIX STATUS */}
                                                    {/* <SessionPaymentStatusChip enrollment={enrollmentData.enrollment}
                                                        session={session}
                                                        setPos /> */}
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    );

                                })
                            
                                : (
                                    <NoListAlert list="Course" />
                                )}
                        // </Grid>
)}

export default EnrollmentSessionRow;