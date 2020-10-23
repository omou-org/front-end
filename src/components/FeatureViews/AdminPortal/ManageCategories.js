import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { ResponsiveButton } from 'theme/ThemedComponents/Button/ResponsiveButton';

import "./AdminPortal.scss";
import * as adminActions from "actions/adminActions";
import * as hooks from "actions/hooks";
import Loading from "components/OmouComponents/Loading";
import NoListAlert from "components/OmouComponents/NoListAlert";
import BackgroundPaper from "../../OmouComponents/BackgroundPaper";


const ManageCategories = () => {
	const dispatch = useDispatch();
	const api = useMemo(() => bindActionCreators(adminActions, dispatch), [
		dispatch,
	]);

	const [categoryName, setCategoryName] = useState("");
	const [categoryDescription, setCategoryDescription] = useState("");
	const [categoryList, setCategoryList] = useState([]);

	const categories = useSelector(
		({Course: {CourseCategories}}) => CourseCategories
	);
	const categoryStatus = hooks.useCategory();

	useEffect(() => {
		if (categories.length !== categoryList.length) {
			const parsedCategoryList = categories.map((category) => ({
				...category,
				editing: false,
			}));
			setCategoryList(parsedCategoryList);
		}
	}, [categories, categoryList]);

	const handleChange = (setter) => ({target}) => {
		setter(target.value);
	};

	const submitCategory = useCallback(() => {
		api.addCategory(categoryName, categoryDescription);
		setCategoryName("");
		setCategoryDescription("");
	}, [api, categoryName, categoryDescription]);

	const categoryForm = () => (
		<BackgroundPaper className="category-row new-category">
			<Grid alignItems="center" container>
				<Grid item xs={3}>
					<TextField
						className="field"
						label="Category Name"
						onChange={handleChange(setCategoryName)}
						required
						value={categoryName}
					/>
				</Grid>
				<Grid item xs={7}>
					<TextField
						className="field"
						label="Category Description"
						multiline
						onChange={handleChange(setCategoryDescription)}
						value={categoryDescription}
					/>
				</Grid>
				<Grid item xs={2}>
					<ResponsiveButton
						className="add-category"
						color="primary"
						disabled={categoryName === ""}
						onClick={submitCategory}
						variant="contained"
					>
						Add Category
					</ResponsiveButton>
				</Grid>
			</Grid>
		</BackgroundPaper>
	);

	const displayCategories = () => (
		<Grid container>
			<Grid item xs={12}>
				<Grid className="accounts-table-heading" container>
					<Grid item xs={3}>
						<Typography align="left" className="table-header">
							Category Name
						</Typography>
					</Grid>
					<Grid item xs={7}>
						<Typography align="left" className="table-header">
							Description
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography align="center" className="table-header">
							Edit
						</Typography>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<Grid alignItems="center" container spacing={1}>
					{categoryList.length > 0 ? (
						categoryList
							.sort((categoryA, categoryB) => categoryB.id - categoryA.id)
							.map((category) => (
								<Grid item key={category.id} xs={12}>
									{category.editing
										? editCategoryRow(category)
										: viewCategoryRow(category)}
								</Grid>
							))
					) : (
						<NoListAlert list="Course Categories"/>
					)}
				</Grid>
			</Grid>
		</Grid>
	);

	const editCategory = (id) => () => {
		const editingCategory = categoryList.find((category) => category.id === id);
		if (editingCategory) {
			api.updateCategory(id, {
				description: editingCategory.description,
				id: editingCategory.id,
				name: editingCategory.name,
			});
		}
		editingCategory.editing = !editingCategory.editing;
		const updatedCategoryList = categoryList.map((category) => {
			if (category.id === id) {
				return editingCategory;
			}
			return category;
		});
		setCategoryList(updatedCategoryList);
	};

	const viewCategoryRow = ({name, description, id}) => (
		<Paper elevation={2} className="category-row" square>
			<Grid alignItems="center" container>
				<Grid item xs={3}>
					<Typography align="left">{name}</Typography>
				</Grid>
				<Grid item xs={7}>
					<Typography align="left">{description}</Typography>
				</Grid>
				<Grid item xs={2}>
					<IconButton onClick={editCategory(id)}>
						<EditIcon/>
					</IconButton>
				</Grid>
			</Grid>
		</Paper>
	);

	const handleEditCategory = (type, id) => ({target}) => {
		const editingCategory = categoryList.find((category) => category.id === id);
		editingCategory[type] = target.value;
		setCategoryList(
			categoryList.map((category) =>
				category.id === id ? editingCategory : category
			)
		);
	};

	const editCategoryRow = ({name, id, description}) => (
		<Paper elevation={2} className="category-row" square>
			<Grid alignItems="center" container>
				<Grid item xs={3}>
					<TextField
						defaultValue={name}
						fullWidth
						label="Name"
						onChange={handleEditCategory("name", id)}
						value={name}
					/>
				</Grid>
				<Grid item xs={7}>
					<TextField
						defaultValue={description}
						fullWidth
						label="Description"
						onChange={handleEditCategory("description", id)}
						value={description}
					/>
				</Grid>
				<Grid item xs={2}>
					<ResponsiveButton className="button" onClick={editCategory(id)}>
						UPDATE
					</ResponsiveButton>
				</Grid>
			</Grid>
		</Paper>
	);

	if (hooks.isLoading(categoryStatus)) {
		return <Loading/>;
	}

	return (
		<div>
			<Typography align="left" variant="h4">
				Manage Categories
			</Typography>
			{categoryForm()}
			{displayCategories()}
		</div>
	);
};

export default ManageCategories;
