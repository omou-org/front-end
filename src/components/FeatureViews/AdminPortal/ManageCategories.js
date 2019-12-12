import PropTypes from "prop-types";
import React, {useState, useEffect, useMemo} from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/styles";
import "./AdminPortal.scss";

import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";
import {connect, useDispatch, useSelector} from "react-redux";
import {Button, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {withRouter} from "react-router-dom";
import Checkbox from "@material-ui/core/Checkbox";
import BackButton from "../../BackButton";
import NavLinkNoDup from "../../Routes/NavLinkNoDup";
import TextField from "@material-ui/core/TextField";
import * as apiActions from "../../../actions/apiActions";
import * as userActions from "../../../actions/userActions";
import {GET, POST} from "../../../actions/actionTypes";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
});

function ManageCategories(props) {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );

    const [anchorEl, setAnchorEl] = useState(null);
    const [categoryName , setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryList, setCategoryList] = useState([]);

    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const requestStatus = useSelector(({RequestStatus}) => RequestStatus);

    useEffect(()=>{
        api.fetchCategories();
    },[api])
    useEffect(()=>{
        if(categories.length > categoryList.length){
            let parsedCategoryList = categories.map((category)=>({
                ...category,
                editing: false,
            }));
            setCategoryList(categories);
        }
    }, [requestStatus.category[GET],requestStatus.category[POST]]);

    const handleChange = (field) => (e) =>{
        switch(field){
            case "name":{
                setCategoryName(e.target.value);
                break;
            }
            case "description":{
                setCategoryDescription(e.target.value);
                break;
            }
        }
    };

    const submitCategory = () => (e) =>{
        e.preventDefault();
        if(categoryName !== ""){
            api.addCategory(categoryName, categoryDescription);
            setCategoryName("");
            setCategoryDescription("");
        }
    }

    const categoryForm = () => {
        return (
                <Paper className={"category-row new-category"}>
                    <Grid container alignItems={"center"}>
                        <Grid item xs={3}>
                            <TextField
                                className={"field"}
                                label="Category Name"
                                value={categoryName}
                                onChange={handleChange("name")}
                                required={true}
                            />
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                className={"field"}
                                multiline={true}
                                label="Category Description"
                                value={categoryDescription}
                                onChange={handleChange("description")}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button className="add-category"
                                    onClick={submitCategory()}>
                                Add Category
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
        )
    };

    const displayCategories = () => {
        return <Grid container>
            <Grid item xs={12}>
                <Grid container className={'accounts-table-heading'}>
                    <Grid item xs={3} md={3}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Name
                        </Typography>
                    </Grid>
                    <Grid item xs={7} md={7}>
                        <Typography align={'left'} style={{color: 'white', fontWeight: '500'}}>
                            Description
                        </Typography>
                    </Grid>
                    <Grid item xs={2} md={2}>
                        <Typography align={'center'} style={{color: 'white', fontWeight: '500'}}>
                            Edit
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={8} alignItems={"center"}>
                    {
                        categoryList.map((category) => {
                                return (<Grid item xs={12} md={12} key={category.id}>
                                    {
                                        category.editing ? editCategoryRow(category) : viewCategoryRow(category)
                                    }
                                </Grid>);
                        })
                    }
                </Grid>
            </Grid>
        </Grid>
    };

    const editCategory = (id) => (e) => {
        e.preventDefault();
        let editingCategory = categoryList.find((category)=>{return category.id === id});
        let categoryToUpload;
        if(editingCategory){ //if we're about to update/we were just editing
            categoryToUpload = {
                id: editingCategory.id,
                name: editingCategory.name,
                description: editingCategory.description,
            }
            api.updateCategory(id, categoryToUpload);
        }
        editingCategory.editing = !editingCategory.editing;
        let updatedCategoryList = categoryList.map((category)=>{
            if(category.id === id){
                return editingCategory;
            } else {
                return category;
            }
        });
        setCategoryList(updatedCategoryList);
    };

    const viewCategoryRow = (category) => {
        return (<Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <Typography align={'left'}>
                        {category.name}
                    </Typography>
                </Grid>
                <Grid item xs={7} md={7}>
                    <Typography align={'left'}>
                        {category.description}
                    </Typography>
                </Grid>
                <Grid item xs={2} md={2}>
                    <Button
                        onClick={editCategory(category.id)}
                        className={"button"}>
                        EDIT
                    </Button>
                </Grid>
            </Grid>
        </Paper>)
    };

    const handleEditCategory = (type, id) => (e) =>{
        let editingCategory = categoryList.find((category)=>{return category.id === id});
        switch(type){
            case "name":
                editingCategory.name = e.target.value;
                break;
            case "description":
                editingCategory.description = e.target.value;
                break;
        }
        let updatedCategoryList = categoryList.map((category)=>{
            if(category.id === id){
                return editingCategory;
            } else {
                return category;
            }
        });
        setCategoryList(updatedCategoryList);
    };

    const editCategoryRow = (category) => {
        return(<Paper square={true} className={"category-row"} >
            <Grid container alignItems={"center"}>
                <Grid item xs={3} md={3} >
                    <TextField
                        value={category.name}
                        defaultValue={category.name}
                        label={"Name"}
                        onChange={handleEditCategory("name",category.id)}
                    />
                </Grid>
                <Grid item xs={7} md={7}>
                    <TextField
                        value={category.description}
                        defaultValue={category.description}
                        label={"Description"}
                        onChange={handleEditCategory("description",category.id)}
                    />
                </Grid>
                <Grid item xs={2} md={2}>
                    <Button
                        onClick={editCategory(category.id)}
                        className={"button"}>
                        UPDATE
                    </Button>
                </Grid>
            </Grid>
        </Paper>)
    }

    return (
        <div>
            <Typography variant={"h4"} align={"left"}>Manage Categories</Typography>
            {
                categoryForm()
            }
            {
                displayCategories()
            }
        </div>
    );
}

ManageCategories.propTypes = {
    // courseTitle: PropTypes.string,
    // admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
    "studentAccounts": state.Users.StudentList,
    "courseList": state.Course.NewCourseList,
    "categories": state.Course.CourseCategories,
});

export default withRouter(connect(
    mapStateToProps
)(ManageCategories));
