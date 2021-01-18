import React, { Component } from "react";
import dataProvider from "../../dataProvider";

class Project2 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      collector: {},
      command: {},
      missed: {},
      manualValue: 0,
      isManualValueValid: false
    };

    this.getData = this.getData.bind(this);
    this.saveDate = this.saveDate.bind(this);
    this.handleCommandButton = this.handleCommandButton.bind(this);
    this.handleAutoButton = this.handleAutoButton.bind(this);
    this.handleManualButton = this.handleManualButton.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.getData();
    setInterval(this.getData, 1000);
  }

  getData() {
    dataProvider.project2.get({})
    .then(result => {
      const { collector, command } = result.data;

      const keys = Object.keys(this.state.collector);
      const missed = keys.reduce((result, key, ) => {
        if (!collector.data || (typeof collector.data[key] === undefined)) {
          result[key] = (this.state.missed[key] + 1) || 1;
        } else {
          result[key] = 0;
        }
        return result;
      }, {});

      this.setState({
        collector: {
          ...this.state.collector,
          ...collector.data
        },
        command: {
          ...this.state.command,
          ...command
        },
        missed
      });
    });
  }

  saveDate(data) {
    dataProvider.project2.set(data).then(result => {
      this.setState({
        command: {
          ...this.state.command,
          ...data
        }
      });
    });
  }

  handleCommandButton() {
    this.saveDate({
      enabled: !this.state.command.enabled
    });
  }
  handleAutoButton() {
    this.saveDate({
      isManualMode: false
    });
  }
  convertValue(value) {
    switch(true) {
      case value > 155:
        return 155;
      case value < 1:
        return 1;
      default:
        return Math.round(value);
    }
  }
  validateManualValue(value) {
    const convertedValue = this.convertValue(value);
    return !isNaN(convertedValue);
  }
  handleManualButton() {
    if (!this.state.isManualValueValid) {
      return false;
    }
    const convertedValue = this.convertValue(this.state.manualValue);
    this.saveDate({
      isManualMode: true,
      manualValue: convertedValue
    });
    this.setState({
      manualValue: convertedValue
    })
  }

  handleInputChange(event) {
    const { value } = event.target;
    this.setState({
      manualValue: value,
      isManualValueValid: this.validateManualValue(value)
    });
  }

  render() {
    const { collector, command, manualValue, logTime, missed } = this.state;
    const connectionError =
      <div className="alert alert-danger" role="alert">
        Can't connect to the specific uri.
      </div>;
    return (
      <div>
        <h2>TT test control <span className={'badge badge-' + (command.enabled ? 'primary' : 'light')}>
            Command: {command.enabled ? 'Enabled' : 'Disabled'}
          </span> <span className={'badge badge-' + (command.isManualMode ? 'success' : 'warning')}>
            Mode: {command.isManualMode ? 'Manual' : 'Auto'}
          </span>
        </h2>
        <form className={'form-inline'}>
          <div className="input-group input-group-sm mb-3 mr-5">
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              onClick={this.handleCommandButton}>
              {command.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          <div className="input-group input-group-sm mb-3 mr-5">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-secondary"
                type="button"
                disabled={!this.state.isManualValueValid}
                onClick={this.handleManualButton}>
                {'Set manual servo pos.'}
              </button>
            </div>
            <input
              type="text"
              className={"form-control form-control-sm" + (this.state.isManualValueValid ? '' : ' is-invalid')}
              onChange={this.handleInputChange}
              value={manualValue}/>
          </div>

          <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Auto calculated angle: </span>
            </div>
            <input
              type="text"
              className="form-control"
              readOnly
              value={command.autoValue || 0}/>

            {command.isManualMode && (
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.handleAutoButton}>
                  Enable auto
                </button>
              </div>
            )}

          </div>

        </form>
        <div>
          Manual servo position: open 0 - 155 close.
        </div>
        {!Object.keys(collector).length && (
          <div className="alert alert-danger" role="alert">
            No data from TT arduino!
          </div>
        )}
        <table className="table table-sm table-bordered">
          <tbody>
          {Object.entries(collector).map(([key, val]) => {
            return (
              <tr key={key}>
                <td>
                  {key}
                  <div className="float-right">
                    <span className="badge badge-warning">
                      {missed[key] || null}
                    </span>
                  </div>
                </td>
                <td>{val}</td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Project2;