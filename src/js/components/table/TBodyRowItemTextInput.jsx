import React, { Component } from "react";

class TBodyRowItemTextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      isSaving: false
    };

    this.startEdit = this.startEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onSave = this.onSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  startEdit() {
    this.setState({
      isEditing: true,
      value: this.props.value
    });
  }
  cancelEdit() {
    this.setState({
      isEditing: false
    });
  }

  onInputChange(e) {
    this.setState({
      value: e.target.value
    });
  }
  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.onSave();
    }
  }

  onSave() {
    let data = {};
    data[this.props.field.name] = this.state.value;

    this.setState({
      isEditing: false,
      isSaving: true
    });

    this.props.updateFormHandler(data).then(() => {

      this.setState({
        isSaving: false
      });
    });
  }

  render() {
    const { field } = this.props;

    const spinner =
      <div className="input-group-append">
        <span className="input-group-text">
          <span className="spinner-border spinner-border-sm" />
        </span>
      </div>;

    const input =
      <input
        type="text"
        className="form-control form-control-sm"
        onChange={this.onInputChange}
        placeholder={field.label}
        value={this.state.value}
        disabled={this.state.isSaving}
        onKeyPress={this.handleKeyPress}
        onBlur={this.cancelEdit}
        autoFocus
      />;

    const text = <span onClick={this.props.updateFormHandler ? this.startEdit : null}>{this.props.value}</span>;

    return (
      <td>
        <div className="input-group">
          {this.state.isEditing || this.state.isSaving ? input : text }
          {this.state.isSaving ? spinner : "" }
        </div>
      </td>
    );
  }
}

export default TBodyRowItemTextInput;