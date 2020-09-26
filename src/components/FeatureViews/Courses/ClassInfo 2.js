import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const ClassInfo = ({ description }) => {
  return (
    <Grid container style={{ marginTop: "2.5em" }}>
      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="left"
          style={{ marginBottom: "5em" }}
        >
          {description}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ClassInfo;
