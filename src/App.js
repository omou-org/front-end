// React
import React from "react";

// Material UI
import CssBaseline from "@material-ui/core/CssBaseline";

// Local Component Imports
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import "./theme/theme.scss";

const App = () => (
    <div className="App">
        <CssBaseline />
        <Navigation />
    </div>
);

export default App;
