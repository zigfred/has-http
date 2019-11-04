import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TBodyRowItemCheckbox from "./TBodyRowItemCheckbox";
import TBodyRowItemTextInput from "./TBodyRowItemTextInput";
import TBodyRowItemSelection from "./TBodyRowItemSelection";

class TBodyRow extends Component {
  constructor(props) {
    super(props);
    this.updateFormHandler = this.updateFormHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);
    this.renderRemoveColumn = this.renderRemoveColumn.bind(this);
  }

  updateFormHandler(data) {
    return this.props.updateFormHandler(data, this.props.data._id);
  }

  removeHandler() {
    return this.props.removeHandler(this.props.data._id);
  }

  renderRemoveColumn() {
    if (this.props.removeHandler) {
      return(
        <td>
          <button
            type="button"
            className="btn btn-danger btn-sm float-right"
            onClick={this.removeHandler} >
            Del
          </button>
        </td>
      );
    }
  }
  render() {
    const {fields} = this.props;

    return(
      <tr>
        {fields.map(field => {
          let Tag = TBodyRowItemTextInput;

          switch (field.type) {
            case Boolean:
              Tag = TBodyRowItemCheckbox;
              break;

            case Number:
            case Date:
            case String:
              Tag = TBodyRowItemTextInput;
              break;
            case "ref":
              Tag = TBodyRowItemSelection;
              break;
            default:
              return (
                <td key={this.props.data._id + field.name}>
                  {field.name.split('.').reduce((o,i)=>o[i], this.props.data)}
                </td>
              )
          }

          return(
            <Tag
              key={this.props.data._id + field.name}
              value={this.props.data[field.name]}
              field={field}
              updateFormHandler={this.updateFormHandler}
            />
          );
        })}

        {this.renderRemoveColumn()}
      </tr>
    );

  }
}

export default TBodyRow;