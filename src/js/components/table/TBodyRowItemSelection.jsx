import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    "minWidth": "100px"
  })
};

class TBodyRowItemSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false
    };

    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  onSelectionChange(selected) {
    if (this.state.isSaving) return;

    this.setState({
      isSaving: true
    });

    const data = {};
    data[this.props.field.name] = selected.value;

    this.props.updateFormHandler(data).then(() => {
      this.setState({
        isSaving: false
      });
    });
  }



  render() {
    const { value, type, field } = this.props;
    const selectedId = value && value._id;
    const selectedOptions = field.list.map(item => {
      return {
        value: item._id,
        label: item[field.optionLabelProperty]
      }
    });
    const selectedValue = selectedOptions.find(option => (option.value === selectedId));

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
        <Select
          styles={customStyles}
          value={selectedValue}
          isDisabled={this.props.isSaving}
          isLoading={this.props.isSaving}
          placeholder="Select type"
          onChange={this.onSelectionChange}
          options={selectedOptions}
          isSearchable={false}
        />
      </td>
    );
  }
}

export default TBodyRowItemSelection;