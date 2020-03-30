import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";

import AsyncCreatableSelect from "react-select/async-creatable";
import {components} from "react-select";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";
import {makeStyles} from "@material-ui/core/styles";

import "./Search.scss";
import {GET_ACCOUNT_SEARCH_QUERY_SUCCESS, GET_COURSE_SEARCH_QUERY_SUCCESS,} from "actions/actionTypes";
import {isFail, useSearchParams} from "actions/hooks";
import {instance} from "actions/apiActions";

const useStyles = makeStyles({
  navSelect: {
    height: "41px",
    border: "1px solid #eee",
    background: "#ffffff",
    borderRadius: "3px,0px,0px,3px",
  },
  dropdownStyle: {
    borderRadius: "10px !important",
  },
});

const getPlaceholder = () =>
    window.innerWidth < 800 ? "Search" : "Search for a course or account";

const noOptionsMessage = () => "Keep searching...";

const { DropdownIndicator } = components;

const searchIcon = (props) => (
    <DropdownIndicator {...props}>
      <SearchIcon className="search-icon-main"/>
    </DropdownIndicator>
);

const formatCreateLabel = (inputValue) => `Search for "${inputValue}"`;

const styles = {
  control: (base) => ({
    ...base,
    border: 0,
    boxShadow: "none",
  }),
  option: (provided, {isFocused}) => ({
    ...provided,
    backgroundColor: isFocused ? "#43B5D9" : provided.backgroundColor,
  }),
};

const Search = ({
                  onMobileType = () => {
                  }
                }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [mobileSearching, setMobileSearching] = useState(false);
  const [placeholder, setPlaceholder] = useState(getPlaceholder());

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setPlaceholder(getPlaceholder());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const searchParams = useSearchParams();

  const classes = useStyles();

  // update filter if it was changed externally
  useEffect(() => {
    const URLfilter = searchParams.get("filter");
    if (URLfilter === "account" || URLfilter === "course") {
      setFilter(URLfilter);
    } else {
      setFilter("all");
    }
  }, [searchParams]);

  const handleChange = useCallback(
      (input) => {
        if (input) {
          setQuery(input);
          setMobileSearching(windowWidth < 800);
          onMobileType(windowWidth < 800);
        } else {
          setMobileSearching(false);
          onMobileType(false);
        }
      },
      [onMobileType, windowWidth]
  );

  const submitSearch = useCallback(
      (input) => {
        if (input) {
          const params = new URLSearchParams({
            query: input,
          });
          if (filter !== "all") {
            params.set("filter", filter);
          }
          history.push({
            pathname: "/search/",
            search: params.toString(),
          });
        }
      },
      [filter, history]
  );

  const handleItemSelect = useCallback(
      ({label}) => {
        submitSearch(label);
      },
      [submitSearch]
  );

  const handleSubmit = useCallback(
      (event) => {
        event.preventDefault();
        submitSearch(query);
      },
      [query, submitSearch]
  );

  const changeFilter = useCallback(({target: {value}}) => {
    setFilter(value);
  }, []);

  const searchAccounts = useCallback(
      async (input) => {
        const response = await instance.get("/search/account/", {
          params: {
            page: 1,
            query: input,
          },
        });
        if (isFail(response.status)) {
          return [];
        }
        dispatch({
          payload: {
            noChangeSearch: true,
            response,
          },
          type: GET_ACCOUNT_SEARCH_QUERY_SUCCESS,
        });
        return response.data.results.map(
            ({user: {id, first_name, last_name}}) => ({
              label: `${first_name} ${last_name}`,
              value: id,
            })
        );
      },
      [dispatch]
  );

  const searchCourses = useCallback(
      async (input) => {
        const response = await instance.get("/search/course/", {
          params: {
            page: 1,
            query: input,
          },
        });
        if (isFail(response.status)) {
          return [];
        }
        dispatch({
          payload: {
            noChangeSearch: true,
            response,
          },
          type: GET_COURSE_SEARCH_QUERY_SUCCESS,
        });
        return response.data.results.map(({id, subject}) => ({
          label: subject,
          value: id,
        }));
      },
      [dispatch]
  );

  const loadOptions = useCallback(
      async (input) => {
        switch (filter) {
          case "account":
            return searchAccounts(input);
          case "course":
            return searchCourses(input);
          default:
            return [
              ...(await searchAccounts(input)),
              ...(await searchCourses(input)),
            ];
        }
      },
      [filter, searchAccounts, searchCourses]
  );

  return (
      <Grid className="search" container>
        {!mobileSearching && <Grid item xs={2}/>}
        <Grid item xs={mobileSearching ? 12 : 10}>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid item>
                <FormControl
                    className="search-selector"
                    required
                    variant="outlined"
                >
                  <Select
                      className={`select-primary-filter ${classes.navSelect}`}
                      disableunderline="true"
                      inputProps={{
                        id: "primary-filter",
                        name: "primary-filter",
                      }}
                      onChange={changeFilter}
                      value={filter}
                      MenuProps={{classes: {paper: classes.dropdownStyle}}}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="account">Account</MenuItem>
                    <MenuItem value="course">Course</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={10} xs={mobileSearching ? 9 : 7}>
                <AsyncCreatableSelect
                    allowCreateWhileLoading
                    cacheOptions
                    className="search-input"
                    classNamePrefix="main-search"
                    components={{DropdownIndicator: searchIcon}}
                    createOptionPosition="first"
                    formatCreateLabel={formatCreateLabel}
                    loadOptions={loadOptions}
                    noOptionsMessage={noOptionsMessage}
                    onChange={handleItemSelect}
                    onInputChange={handleChange}
                    placeholder={placeholder}
                    styles={styles}
                    value={query}
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
  );
};

Search.propTypes = {
  onMobileType: PropTypes.func,
};

export default Search;
