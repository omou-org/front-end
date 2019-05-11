//React
import React from 'react';

//Material UI
//TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
import {CssBaseline} from '@material-ui/core'
// import MenuIcon from '@material-ui/icons/Menu';

//Local Component Imports
import Routes from './components/Routes/rootRoutes'
import Navigation from './components/Navigation/Navigation'
import './App.scss';




function App() {
  return (
        <div className="App">
            <CssBaseline/>
            <Navigation/>
            <Routes/>
        </div>



  );
}

export default App;
