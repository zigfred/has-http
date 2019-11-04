import React, { Component } from "react";
import TBodyRow from "./TBodyRow";

class TBody extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {fields, data, listUniqueProperty, isCollapsed} = this.props;
    if (!data || !data.length) return null;
    const dataToRender = isCollapsed ? data.slice().splice(1) : data;
    return(
      <tbody>
      { dataToRender.map(row => {
        return (
          <TBodyRow
            key={row[listUniqueProperty]}
            fields={fields}
            data={row}
            updateFormHandler={this.props.updateFormHandler}
            removeHandler={this.props.removeHandler}
          />
        );
      })}
      </tbody>
    );
  }
}

export default TBody;