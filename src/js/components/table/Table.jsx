import React, { Component } from "react";
import THead from "./THead";
import TBody from "./TBody";

class Table extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {config, data, isCollapsed, showEmpty} = this.props;

    if (config.hideEmpty && (!data || !data.length)) return null;

    return (
      <table className="table table-sm">
        <THead
          isCollapsed={isCollapsed && data.length}
          fields={config.fields}
          addFormHandler={this.props.addFormHandler}
        />
        <TBody
          isCollapsed={isCollapsed}
          fields={config.fields}
          data={data}
          listUniqueProperty={config.listUniqueProperty}
          updateFormHandler={this.props.updateFormHandler}
          removeHandler={this.props.removeHandler}
        />
      </table>
    );
  }
}

export default Table;