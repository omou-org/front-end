import InputBase from "@material-ui/core/InputBase";
import { withStyles } from "@material-ui/core/styles";
import { startAndEndDate, truncateStrings } from "utils";
import { formatDate } from "../../Form/FormUtils";
import tippy from "tippy.js";

export const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 20,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 20,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

export const OutlinedSelect = withStyles((theme) => ({
  root: {
    "label + &": {
		marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 10,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

export const handleToolTip = (info) => {

  if (info.event.extendedProps.ooo_id) {
    new tippy(info.el, {
      content: `
            <div class="toolTip">
                <div class='title'><h3> ${info.event.title} </h3></div>
                <div class="container">
                    <div class='clock'>
                        <span class='clock_icon icon'>
                        ${
        info.event.allDay
          ? startAndEndDate(info.event.start, info.event.end)
          : formatDate(info.event.start, info.event.end)
        }
                        </span>
                    </div>
                </div>
            </div>
        `,
      theme: "light",
      placement: "right",
      interactive: true,
    });
  } else if (info.view.type === 'listWeek') {
    //  To display no tooltip on list view
  } else {
    new tippy(info.el, {
      content: `
            <div class="toolTip">
                <div class='title'><h3> ${info.event.title} </h3></div>
                <div class="container">
                    <div class='clock'>
                        <span class='clock_icon icon'>
                        
                        ${
        info.event.allDay
          ? startAndEndDate(info.event.start, info.event.end)
          : formatDate(info.event.start, info.event.end)
        }
                        </span>
                    </div>
                    <div class='pin_icon icon'>
                        <span class=''>
                            Session ${
        info.event.extendedProps.is_confirmed
          ? "IS NOT"
          : "IS"
        } confirmed
                        </span>
                    </div>
                    <div class='teacher_icon icon'>
                        <span class=''>
                                ${
        info.event.extendedProps.instructor
          ? info.event.extendedProps.instructor
          : "No teacher Yet"
        }
                        </span>
                    </div>
                    <div class='discription_icon icon'>
                        <span class='description-text'>
                            ${
        info.el.fcSeg.description
          ? truncateStrings(info.el.fcSeg.description, 88)
          : "N/A"
        }
                        </span>
                    </div>
                </div>
            </div>
        `,
      theme: "light",
      placement: "right",
      interactive: true,
    });
  }
};

/** * @description: This is for transforming instructor organized redux to an array of sessions
 * @param sessions
 * @returns {unknown[]}
 */
export const sessionArray = (sessions) =>
  Object.keys(sessions).length > 0 &&
  Object.values(sessions)
    .map((instructorSessions) => Object.values(instructorSessions))
    .reduce((allSessions, instructorSessions) =>
      allSessions.concat(instructorSessions)
    );
