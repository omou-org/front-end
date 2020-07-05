import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

export default function SummaryEntry({title, hours, grade}) {
	return (<TableRow>
		<TableCell>
			{title} - <span style={{fontStyle: "italic", fontWeight: 300}}>{grade}</span>
		</TableCell>
		<TableCell>
			{hours}
		</TableCell>
	</TableRow>)
}