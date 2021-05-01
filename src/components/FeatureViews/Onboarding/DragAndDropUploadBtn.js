import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
	uploadField: {
		border: '2px dashed #28ABD5',
		borderRadius: '10px',
	},
	uploadFieldText: {
		color: '#28ABD5',
	},
}));
export default function DragAndDropUploadBtn(props) {
	const classes = useStyles();
	return (<Box
		className={classes.uploadField}
		display='flex'
		width={200}
		height={144}
		alignItems='center'
		justifyContent='center'
		{...props}
	>
		<Typography className={classes.uploadFieldText}>
			Drag & Drop Files Here <br/>
			<Link>
				Or Click to Browse.
			</Link>
		</Typography>

	</Box>)
}