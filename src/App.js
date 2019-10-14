// react
import React from "react";

/*
 * Material UI
 * TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
 */
import CssBaseline from "@material-ui/core/CssBaseline";

// local component import
import Navigation from "./components/Navigation/Navigation";

// css import
import "./App.scss";
import "./theme/theme.scss";

const App = () => (
    <div className="App">
        <CssBaseline />
        <Navigation />
    </div>
);

export default App;
