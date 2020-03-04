import InputBase from '@material-ui/core/InputBase';
import { withStyles } from '@material-ui/core/styles';
import { DayConverter, truncateStrings } from "utils";
import tippy from "tippy.js";
export const BootstrapInput = withStyles(theme => ({
    root: {
        'label + &': {
            marginTop: theme.spacing.unit * 3,
        },
    },
    input: {
        borderRadius: 20,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: 'auto',
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

export const handleToolTip = (info) => {
    function formatDate(start, end) {
        const MonthConverter = {
            "0": "January",
            "1": "February",
            "2": "March",
            "3": "April",
            "4": "May",
            "5": "June",
            "6": "July",
            "7": "August",
            "8": "September",
            "9": "October",
            "10": "November",
            "11": "December",
        };

        const date = new Date(start);
        const dateNumber = date.getDate();
        const dayOfWeek = date.getDay();
        const startMonth = date.getMonth();
        // Gets days
        const Days = DayConverter[dayOfWeek];

        // Gets months
        const Month = MonthConverter[startMonth];

        // Start times and end times variable
        const startTime = new Date(start).toTimeString();
        const endTime = new Date(end).toTimeString();
        // Converts 24hr to 12 hr time
        function timeConverter(time) {
            const Hour = time.substr(0, 2);
            const to12HourTime = (Hour % 12) || 12;
            const ampm = Hour < 12 ? " am" : " pm";
            time = to12HourTime + time.substr(2, 3) + ampm;
            return time;

        }

        const finalTime = `${Days}, ${Month} ${dateNumber} <br> ${timeConverter(startTime)} - ${timeConverter(endTime)}`;

        return finalTime;

    }

    new tippy(info.el, {
        "content":
            `
            <div class="toolTip">
                <div class='title'><h3> ${info.event.title} </h3></div>
                <div class="container">
                    <div class='clock'>
                        <span class='clock_icon icn'>
                            ${formatDate(info.event.start, info.event.end)}
                        </span>
                    </div>
                    <div class='pin_icon icn'>
                        <span class=''>
                            Session ${info.event.extendedProps.is_confirmed ? "IS NOT" : "IS"} confirmed
                        </span>
                    </div>
                    <div class='teacher_icon icn'>
                        <span class=''>
                                ${info.event.extendedProps.instructor
                ? info.event.extendedProps.instructor : "No teacher Yet"}
                        </span>
                    </div>
                    <div class='discription_icon icn'>
                        <span class='description-text'>
                            ${info.el.fcSeg.description
                ? truncateStrings(info.el.fcSeg.description, 88) : "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        `,
        "theme": "light",
        "placement": "right",
        "interactive": true,
    });
}