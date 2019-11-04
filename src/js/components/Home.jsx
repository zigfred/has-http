import React, { Component } from "react";

import Cookies from 'universal-cookie';
import axios from "axios";

const cookies = new Cookies();
const uriReg = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


class Home extends Component {
  constructor(props) {
    super(props);

    let uri = cookies.get('restUri') || '';

    this.state = {
      isEditing: !uri,
      isSaving: false,
      connectionError: false,
      validationError: false,
      uri: uri
    };
    this.startEdit = this.startEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  startEdit() {
    this.setState({
      isEditing: true,
      uri: this.state.uri
    });
  }
  cancelEdit() {
    if (!cookies.get('restUri')) {
      return;
    }
    this.setState({
      isEditing: false,
      uri: cookies.get('restUri')
    });
  }

  handleInputChange(e) {
    this.setState({
      uri: e.target.value,
      connectionError: false,
      validationError: !uriReg.test(e.target.value)
    });
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSave();
    }
  }

  onSave() {
    if (this.state.validationError) {
      return;
    }

    let uri = this.state.uri.replace(/\/$/, "");

    this.setState({
      isEditing: false,
      isSaving: true
    });

    axios.get(uri + "/settings").then(() => {

      cookies.set("restUri", uri);
      this.setState({
        isSaving: false,
        uri: uri
      });
    }, () => {
      this.setState({
        isEditing: !cookies.get('restUri'),
        isSaving: false,
        error: 'Can\'t connect to the specified uri'
      });
    });
  }

  render() {
    const error =
      <div className="alert alert-danger" role="alert">
        Can't connect to the specific uri.
      </div>;

    const spinner =
      <div className="input-group-append">
        <span className="input-group-text">
          <span className="spinner-border spinner-border" />
        </span>
      </div>;
    const input =
      <input
        type="text"
        className={"form-control" + (this.state.validationError ? " border border-danger" : "")}
        id="restUriInput"
        placeholder="Path to REST service"
        name="collectionInterval"
        value={this.state.uri}
        onChange={this.handleInputChange}
        disabled={this.state.isSaving}
        onKeyPress={this.handleKeyPress}
        onBlur={this.cancelEdit}
        autoFocus
    />;
    const text = <span onClick={this.startEdit}>{this.state.uri}</span>;


    return (
      <div>
        <h2>HAS</h2>
        <form>
          <div className="form-group row">
            <label htmlFor="restUriInput" className="col-sm-2 col-form-label">Path to REST service</label>
            <div className="col-sm-10">
              {this.state.isEditing || this.state.isSaving ? input : text }
              {this.state.isSaving ? spinner : "" }
              {this.state.connectionError ? error : "" }
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Home;