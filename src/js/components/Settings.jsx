import dataProvider from "../dataProvider";
import React, { Component } from "react";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      collectionInterval: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    dataProvider.getSettings()
      .then(
        (result) => {
          if (result === null) {
            this.setState({
              isLoaded: true
            });
          } else {
            const {collectionInterval} = result.data;
            this.setState({
              isLoaded: true,
              collectionInterval: collectionInterval
            });
          }
        }).catch((error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    dataProvider.updateSettings( {
      collectionInterval: this.state.collectionInterval
    })
      .then(
        (result) => {
          if (result === null) {
            this.setState({
              isLoaded: true
            });
          } else {
            this.setState({
              isLoaded: true,
              collectionInterval: result.collectionInterval
            });
          }
        }).catch((error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    );
  }

  render() {
    const { error, isLoaded, collectionInterval } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h2>Settings</h2>

          <form>
            <div className="form-group row">
              <label htmlFor="inputCollectionInterval" className="col-sm-2 col-form-label">Collection Interval</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="inputCollectionInterval"
                  placeholder="Collection Interval"
                  name="collectionInterval"
                  value={collectionInterval}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
          </form>
        </div>
      );
    }
  }
}

export default Settings;