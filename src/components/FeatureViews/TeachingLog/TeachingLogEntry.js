import React, {useState} from "react";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Moment from "react-moment";
import moment from "moment";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

export default function TeachingLogEntry({session: {title, endDatetime, startDatetime, id}}) {
	const [open, setOpen] = useState(false);
	const classes = useRowStyles();

	return (<>
		<TableRow className={classes.root}>
			<TableCell>{id}</TableCell>
			<TableCell><Moment date={startDatetime} format="MM/DD/YYYY"/></TableCell>
			<TableCell>{title}</TableCell>
			<TableCell>
				<Moment date={startDatetime} format="h:mm a"/>-
				<Moment date={endDatetime} format="h:mm a"/>
			</TableCell>
			<TableCell>
				{moment.duration(moment(endDatetime).diff(moment(startDatetime))).asHours()}
			</TableCell>
			<TableCell>
				<IconButton aria-label="expand teaching log" size="small" onClick={() => setOpen(!open)}>
					{open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
				</IconButton>
			</TableCell>
		</TableRow>
		<TableRow>
			<TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box margin={1}>
						<Typography>Students</Typography>
						<Typography>Course Dates</Typography>
					</Box>
				</Collapse>
			</TableCell>
		</TableRow>
	</>)
}