import React, {useCallback, useEffect, useState} from "react";
import Forms from "../../Form/FormFormats";
import Form from "../../Form/Form";
import CourseRegistrationReceipt from "./CourseRegistrationReceipt";
import {Redirect, useParams} from "react-router-dom"
import RegistrationActions from "./RegistrationActions";
import Grid from "@material-ui/core/Grid";

export default function RegistrationForm() {
	const {type, id} = useParams();
	const {form, load, submit, title} = Forms[type];
	const [initialData, setInitialData] = useState();
	const onSubmit =
		useCallback((formData) => submit(formData, id), [id, submit]);
	useEffect(() => {
		if (id) {
			let abort = false;
			(async () => {
				const data = await load(id);
				if (!abort) {
					setInitialData(data);
				}
			})();
			return () => {
				abort = true;
			};
		}
	}, [id, load]);

	const withDefaultData = form.reduce((data, {name, fields}) => ({
		...data,
		[name]: {
			...fields.filter((field) => typeof field.default !== "undefined")
				.reduce((sectionData, field) => ({
					...sectionData,
					[field.name]: field.default,
				}), {}),
			...initialData?.[name],
		},
	}), {});

	if (!form || (id && initialData === null)) {
		return <Redirect to="/PageNotFound"/>;
	}
	
	return (
		<>
			<Grid container>
				<RegistrationActions/>
			</Grid>
			<Form base={form} initialData={withDefaultData} onSubmit={onSubmit}
				  title={`${title} ${id ? "Editing" : "Registration"}`}
				  receipt={CourseRegistrationReceipt}
			/>
		</>
	);
}