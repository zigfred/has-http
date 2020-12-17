import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Heartbeat from "./monitor/Heartbeat";
import Home from "./Home";
import DataPoints from "./DataPoints";
import DataPointTypes from "./DataPointTypes";
import Arduinos from "./Arduinos";
import Settings from "./Settings";
import Charts from "./Charts";
import Adhoc from "./adhoc/Adhoc";
import Project1 from './projects/Project1';
import Project2 from './projects/Project2';
import BRControl from './projects/brControl/BRControl';

class Main extends Component {
  render() {
    return (
      <HashRouter>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className={"nav-link"} exact to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"}  to="/dataPoints">Data Points</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"}  to="/dataPointTypes">Data Point Types</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"}  to="/arduinos">Arduinos</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"} to="/settings">Settings</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"} to="/adhoc">Ad hoc</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"} to="/projects/project1">Project 1</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"} to="/projects/project2">TT control</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={"nav-link"} to="/projects/BRControl">BR</NavLink>
              </li>
              <li className="nav-item">
                <Heartbeat/>
              </li>
            </ul>
          </nav>
          <div className="content container-fluid">
            <Route exact path="/" component={Home}/>
            <Route path="/dataPoints" component={DataPoints}/>
            <Route path="/dataPointTypes" component={DataPointTypes}/>
            <Route path="/arduinos" component={Arduinos}/>
            <Route path="/settings" component={Settings}/>
            <Route path="/adhoc/:filter?" component={Adhoc}/>
            <Route path="/projects/project1" component={Project1}/>
            <Route path="/projects/project2" component={Project2}/>
            <Route path="/projects/BRControl" component={BRControl}/>
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;