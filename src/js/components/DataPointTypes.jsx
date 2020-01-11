import dataProvider from "../dataProvider";
import React, { Component } from "react";
import Table from "./table/Table";

class DataPointTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.addFormHandler = this.addFormHandler.bind(this);
    this.updateFormHandler = this.updateFormHandler.bind(this);
    this.removeHandler = this.removeHandler.bind(this);

    this.tableConfig = {
      listUniqueProperty: "_id",
      isRemoveAllowed: true,
      fields: [{
        label: "Name",
        name: "name",
        type: String
      }, {
        label: "Units",
        name: "units",
        type: String
      }, {
        label: "Type",
        name: "type",
        type: String
      }, {
        label: "Data range min",
        name: "dataRangeMin",
        type: String
      }, {
        label: "Data range max",
        name: "dataRangeMax",
        type: String
      }]
    };
  }

  componentDidMount() {
    dataProvider.getDataPointTypes()
      .then(
        (result) => {
          this.setState({
            data: result.data
          });
        });
  }

  addFormHandler(newItem) {
    return dataProvider.addDataPointType(newItem)
      .then(result => {
        const data = [...this.state.data, result.data];
        this.setState({
          data: data
        });
      });
  }

  updateFormHandler(data, _id) {
    return dataProvider.updateDataPointType(_id, data).then((response) => {

      let data = this.state.data.slice();
      data.forEach((item) => {
        if (item._id === _id) {
          Object.assign(item, response.data);
        }
      });
      this.setState({
        data: data
      });
    });
  }

  removeHandler(_id) {
    return dataProvider.deleteDataPointType(_id)
      .then(result => {
        const data = this.state.data.filter(item => (item._id !== _id));
        this.setState({
          data: data
        });
      });
  }


  render() {
    return (
      <div>
        <h2>Data point types list</h2>
        <Table
          data={this.state.data}
          config={this.tableConfig}
          addFormHandler={this.addFormHandler}
          updateFormHandler={this.updateFormHandler}
          removeHandler={this.removeHandler}
        />
      </div>
    );
  }
}

export default DataPointTypes;