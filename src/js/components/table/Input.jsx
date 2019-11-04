import React, { Component } from "react";

class Input extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

  }

  handleChange(e) {
    this.props.onChange(this.props.name, e.target.value);
  }

  render() {

    return (
      <input
        type="text"
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.props.value}
        name={this.props.name}
      />
    );
  }
}

export default Input;