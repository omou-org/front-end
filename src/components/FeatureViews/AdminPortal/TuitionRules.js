import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import CheckCircle from "@material-ui/icons/CheckCircle";
import Edit from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "./AdminPortal.scss";
import * as adminActions from "actions/adminActions";
import * as hooks from "actions/hooks";
import {academicLevelParse, courseTypeParse,} from "reducers/registrationReducer";
import Loading from "components/Loading";
import NoListAlert from "components/NoListAlert";

const academicLevelList = [
	"College",
	"Middle School",
	"Elementary School",
	"High School",
];
const classSize = ["Tutoring", "Small Group"];

const TuitionRules = () => {
	const dispatch = useDispatch();
	const api = useMemo(() => bindActionCreators(adminActions, dispatch), [
		dispatch,
	]);
	const [tuitionRules, setTuitionRules] = useState([]);
	const priceRules = useSelector(({Admin: {PriceRules}}) => PriceRules);
	const categories = useSelector(
		({Course: {CourseCategories}}) => CourseCategories
	);
	hooks.useCategory();
	const priceRuleStatus = adminActions.usePriceRules();

	useEffect(() => {
		setTuitionRules((prevRules) =>
			priceRules.map((price) => {
				const prevRule = prevRules.find(({id}) => id === price.id);
				return {
					...price,
					academic_level: academicLevelParse[price.academic_level],
					course_type: courseTypeParse[price.course_type],
					editing: prevRule ? prevRule.editing : false,
				};
			})
		);
	}, [categories, priceRules, api]);

	const editTuition = useCallback(
		(id) => () => {
			const editingRule = tuitionRules.find((rule) => rule.id === id);
			// if we're about to update/we were just editing
			if (editingRule.editing) {
				const ruleToUpload = {
					...editingRule,
					academic_level: academicLevelParse[editingRule.academic_level],
					category: editingRule.category,
					course_type: courseTypeParse[editingRule.course_type],
					hourly_tuition: Number(editingRule.hourly_tuition),
				};
				delete ruleToUpload.editing;
				api.updatePriceRule(id, ruleToUpload);
			}
			editingRule.editing = !editingRule.editing;
			const updatedRuleList = tuitionRules.map((rule) => ({
				...rule,
				editing: rule.id === id ? !rule.editing : rule.editing,
			}));
			setTuitionRules(updatedRuleList);
		},
		[api, tuitionRules]
	);

	const viewTuitionRow = ({
								id,
								category,
								hourly_tuition,
								academic_level,
								course_type,
							}) => {
		const reduxCategory = categories.find((cat) => cat.id === category);
		return (
			<Paper className="category-row" square>
				<Grid alignItems="center" container>
					<Grid item xs={3}>
						<Typography align="left">
							{reduxCategory && reduxCategory.name}
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography align="left">{academic_level}</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography align="left">{course_type}</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography align="left">${hourly_tuition}</Typography>
					</Grid>
					<Grid item xs={1}>
						<IconButton disabled={!categories} onClick={editTuition(id)}>
							<Edit/>
						</IconButton>
					</Grid>
				</Grid>
			</Paper>
		);
	};

	const handleRuleChange = (tuitionID, field) => (event) => {
		setTuitionRules((oldRules) =>
			oldRules.map((tuitionRule) =>
				tuitionRule.id === tuitionID
					? {
						...tuitionRule,
						[field]: event.target.value,
					}
					: tuitionRule
			)
		);
	};

	const editTuitionRow = ({
								id,
								category,
								hourly_tuition,
								academic_level,
								course_type,
							}) => (
		<Paper className="category-row" square>
			<Grid alignItems="center" container>
				<Grid item xs={3}>
					<Select
						className="tuition-field"
						onChange={handleRuleChange(id, "category")}
						value={category}
					>
						{categories.map((cat) => (
							<MenuItem key={cat.id} value={cat.id}>
								{cat.name}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid item xs={3}>
					<Select
						className="tuition-field"
						onChange={handleRuleChange(id, "academic_level")}
						value={academic_level}
					>
						{academicLevelList.map((grade) => (
							<MenuItem key={grade} value={grade}>
								{grade}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid item xs={3}>
					<Select
						className="tuition-field"
						onChange={handleRuleChange(id, "course_type")}
						value={course_type}
					>
						{classSize.map((size) => (
							<MenuItem key={size} value={size}>
								{size}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid item xs={2}>
					<TextField
						className="tuition-field"
						onChange={handleRuleChange(id, "hourly_tuition")}
						type="number"
						value={hourly_tuition}
						variant="outlined"
					/>
				</Grid>
				<Grid item xs={1}>
					<IconButton onClick={editTuition(id)}>
						<CheckCircle/>
					</IconButton>
				</Grid>
			</Grid>
		</Paper>
	);

	return (
		<div className="manage-tutition-wrapper">
			<Typography align="left" gutterBottom variant="h5">
				Manage Tuition
			</Typography>
			<Grid container>
				<Grid
					className="accounts-table-heading table-header"
					container
					item
					xs={12}
				>
					<Grid item xs={3}>
						<Typography align="left" className="table-header">
							Category
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography align="left" className="table-header">
							Grade
						</Typography>
					</Grid>
					<Grid item xs={3}>
						<Typography align="left" className="table-header">
							Course Size
						</Typography>
					</Grid>
					<Grid item xs={2}>
						<Typography align="left" className="table-header">
							Hourly Tuition
						</Typography>
					</Grid>
				</Grid>
				<Grid alignItems="center" container item spacing={1} xs={12}>
					{tuitionRules.length > 0 ? (
						tuitionRules.map(
							(tuition) =>
								tuition && (
									<Grid item key={tuition.id} xs={12}>
										{tuition.editing
											? editTuitionRow(tuition)
											: viewTuitionRow(tuition)}
									</Grid>
								)
						)
					) : hooks.isLoading(priceRuleStatus) ? (
						<Loading/>
					) : (
						<NoListAlert list="Tuition Rules"/>
					)}
				</Grid>
			</Grid>
		</div>
	);
};

TuitionRules.propTypes = {};

export default TuitionRules;
