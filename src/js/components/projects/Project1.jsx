import dataProvider from "../../dataProvider";
import Cookies from 'universal-cookie';

import React, { Component } from "react";

const cookies = new Cookies();

class Project1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      connectionError: false,
      loadDescription: '',
      data: [],
      totalPoints: 0,
      runCounter: 0,
      isRunning: false,
      stop: true,
      projectUri: cookies.get("project1Uri")
    };
    this.onArduinoUriChange = this.onArduinoUriChange.bind(this);
    this.onLoadDescriptionChange = this.onLoadDescriptionChange.bind(this);
    this.onRun = this.onRun.bind(this);
    this.onStop = this.onStop.bind(this);

  }


  onArduinoUriChange(e) {
    const projectUri = e.target.value;
    this.setState({
      projectUri
    });
    cookies.set("project1Uri", projectUri);
  }
  onLoadDescriptionChange(e) {
    this.setState({
      loadDescription: e.target.value
    });
  }
  onRun() {
    this.setState({
      stop: false,
      connectionError: false,
      isRunning: true
    });
    this.run();
  }
  onStop() {
    this.setState({
      stop: true
    });
  }

  run() {
    this.setState({
      runCounter: this.state.runCounter + 1
    });
    const { projectUri } = this.state;
    dataProvider.getProject1({
      params: {
        projectUri
      }
    })
    .then((res) => {
      const data = res.data;
      data.data = Object.values(data.data);
      data.loadDescription = this.state.loadDescription;

      this.setState({
        connectionError: false,
        data: [
          ...this.state.data,
          data
        ],
        isRunning: !this.state.stop,
        runCounter: this.state.stop ? 0 : this.state.runCounter
      });

      if (!this.state.stop) {
        this.onRun();
      }



    })
    .catch((err) => {
      this.setState({
        connectionError: true,
        isRunning: false
      });
      console.error(err)
    });
  }

  render() {
    const { isRunning, projectUri, loadDescription, runCounter } = this.state;
    const connectionError =
      <div className="alert alert-danger" role="alert">
        Can't connect to the specific uri.
      </div>;
    return (
      <div>
        <h2>Project 1</h2>
        {this.state.connectionError ? connectionError : "" }
        <div className="input-group input-group-sm">
          <input
            type="text"
            className="form-control"
            name="arduinoUri"
            onChange={this.onArduinoUriChange}
            value={projectUri}
            placeholder="Arduino Uri"/>
          <input
            type="text"
            className="form-control"
            name="loadDescription"
            onChange={this.onLoadDescriptionChange}
            value={loadDescription}
            placeholder="Load description"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={isRunning ? this.onStop : this.onRun}>
              {isRunning ? (runCounter + ' | Stop') : 'Start'}
            </button>
          </div>
        </div>
        <table className="table table-sm">
          <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Description</th>
            <th scope="col">Voltage</th>
            {this.state.data.length && this.state.data[0].data.map((i, key) => <th scope="col">{key+1}</th>) || ""}
          </tr>
          </thead>
          <tbody>
          {this.state.data.map((row, key) => {
            return (
              <tr>
                <th scope="row">{key+1}</th>
                <td>{row.loadDescription}</td>
                <td>{row.V}</td>
                {row.data.map(current => <td>{current}</td>)}
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Project1;