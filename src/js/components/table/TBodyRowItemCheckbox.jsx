import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class TBodyRowItemCheckbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.state.isSaving) return;

    this.setState({
      isSaving: true
    });

    let data = {};
    data[this.props.field.name] = !this.props.value;

    this.props.updateFormHandler(data).then(() => {
      this.setState({
        isSaving: false
      });
    });
  }


  render() {
    const { value, type, field } = this.props;

    const spinner = <span
      className="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
    />;
    const icon = <FontAwesomeIcon
      onClick={this.onClick}
      icon={value ? "check-circle" : "times-circle"}
      color={value ? "green" : "red"}
    />;

    return (
      <td>

        {this.state.isSaving ? spinner : icon}
      </td>
    );
  }
}

export default TBodyRowItemCheckbox;