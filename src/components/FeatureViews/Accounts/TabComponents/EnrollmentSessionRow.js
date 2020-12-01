import React, { useCallback, useEffect, useMemo, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Link, useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import NoListAlert from "../../../OmouComponents/NoListAlert";
import SessionPaymentStatusChip from "components/OmouComponents/SessionPaymentStatusChip";
import moment from "moment";



function EnrollmentSessionRow({session, enrollmentData, highlightSession}) {
    const {course, id} = enrollmentData.enrollment
    const tuitionStartTime = moment(session.startDatetime).format('hh')
    const tuitionEndTime = moment(session.endDatetime).format('hh')
    const tuition = session.course.hourlyTuition * (tuitionEndTime - tuitionStartTime)

            return (
                <Grid className="accounts-table-row"
                    component={Link}
                    item
                    data-cy="view-session-link"
                    key={id}
                    to={
                        `/scheduler/view-session/${course.id}/${session.id}/${course.instructor.user.id}`
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
                                                date={session.startDatetime}
                                                format="M/D/YYYY"
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography align="left">
                                            <Typography align="left">
                                                <Moment
                                                    date={session.startDatetime}
                                                    format="dddd"
                                                />
                                            </Typography>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography align="left">
                                            <Moment                          
                                                date={session.startDatetime}
                                                format="h:mm A"
                                            />
                                            {" - "}
                                            <Moment
                                                date={session.endDatetime}
                                                format="h:mm A"
                                            />
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1}>
                                        {/* hourly rate * endtime-starttime */}
                                        <Typography align="left">${tuition}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <SessionPaymentStatusChip enrollment={enrollmentData.enrollment}
                                            session={session}
                                            setPos />
                                            
                                </Grid>
                        </Paper>
                </Grid>
            );
}

export default EnrollmentSessionRow;