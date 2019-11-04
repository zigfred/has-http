import React, { Component } from "react";
import Input from "./Input"

class THeadItem extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onInputChange(name, value) {
    this.props.onChangeHandler(name, value);
  }
  onCheckboxChange(e) {
    this.props.onChangeHandler(this.props.field.name, e.target.checked);
  }
// TODO add select for ref type
  input() {
    const {label, type, name, value} = this.props.field;
    const {isSaving} = this.props;

    switch(type) {
      case String:
      case Date:
      case Number:
        return (
          <Input
            placeholder={label}
            onChange={this.onInputChange}
            value={value}
            name={name}
            disabled={isSaving}
          />
        );
      case Boolean:
        return (
          <div className="form-group form-check">
            <input
              onChange={this.onCheckboxChange}
              type="checkbox"
              className="form-check-input"
              id={"checkbox-" + name}
              checked={value}
              disabled={isSaving}
            />
            <label className="form-check-label" htmlFor={"checkbox-" + name}>{label}</label>
          </div>
        );
    }
  }


  render() {

    return (
      <th>
        {this.input()}
      </th>
    );
  }
}

export default THeadItem;