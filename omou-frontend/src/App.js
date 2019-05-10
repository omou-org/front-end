import React from 'react';
import logo from './logo.svg';
import './App.scss';
import ReduxExample from './components/reduxExample'
import Main from './components/Dashboard/Dashboard'
//TODO: import each component individually (i.e. '@material-ui/core/AppBar') to reduce bundle size
import {AppBar,Toolbar, Typography} from '@material-ui/core'
import { Route, Switch } from "react-router-dom";

function App() {
  return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="title" color="inherit">
                        Omou Init
                    </Typography>
                </Toolbar>
            </AppBar>
            <Switch>
                <Route exact path="/" component={Main}/>
                <Route path="/reduxexample" component={ReduxExample}/>
            </Switch>
        </div>



  );
}

export default App;
