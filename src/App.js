// react
import React from "react";

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
