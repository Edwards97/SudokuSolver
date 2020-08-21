import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import Home from './Tabs/home';
import About from './Tabs/about';
import UserInstructions from "./Tabs/instructions";


function App() {
  return (
   
      <BrowserRouter>
      
      <Switch>
            <Route path="/" component={Home} exact/>
            <Route path="/home" component={Home} exact/>
            <Route path="/About" component={About}/>
            <Route path="/instructions" component={UserInstructions}/>
      </Switch>
      
      
      </BrowserRouter>
    
    
    

  );
}

export default App;
