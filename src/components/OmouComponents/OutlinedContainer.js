import React from "react";
import {outlineGrey} from "../../theme/muiTheme";

export default function OutlinedContainer({children, ...rest}) {
	return (<div
		style={{border: "solid 1px " + outlineGrey, borderRadius: "10px", padding: "3%", ...rest?.styles}} {...rest}>
		{children}
	</div>)
}