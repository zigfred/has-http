import dataProvider from "../dataProvider";
import React, { Component } from "react";
import Table from "./table/Table";

class DataPoints extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataPoints: [],
      tableConfig: this.tableConfig()
    };
    this.addFormHandler = this.addFormHandler.bind(this);
    this.updateFormHandler = this.updateFormHandler.bind(this);

  }

  tableConfig(dataPointTypes) {
    return {
      listUniqueProperty: "_id",
      fields: [{
        label: "Label",
        name: "label",
        type: String
      }, {
        label: "Address",
        name: "address",
        type: String
      }, {
        label: "Type",
        name: "type",
        type: "ref",
        list: dataPointTypes || [],
        optionLabelProperty: "name"
      }, {
        label: "Time",
        name: "time",
        type: Date
      }, {
        label: "Active",
        name: "isActive",
        type: Boolean
      }]
    }
  }

  componentDidMount() {
    Promise.all([
      dataProvider.getDataPoints(),
      dataProvider.getDataPointTypes()
    ])
      .then((response) => {
        this.setState({
          dataPoints: response[0].data,
          tableConfig: this.tableConfig(response[1].data)
        });
      })
      .catch(error => console.log(error));
  }

  addFormHandler(newItem) {
    return dataProvider.addDataPoint(newItem)
      .then(result => {
        const data = [...this.state.dataPoints, result.data];
        this.setState({
          dataPoints: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateFormHandler(data, _id) {
    return dataProvider.updateDataPoint(_id, data).then((response) => {

      let dataPoints = this.state.dataPoints.slice();
      dataPoints.forEach((item) => {
        if (item._id === _id) {
          Object.assign(item, response.data);
        }
      });
      this.setState({
        dataPoints: dataPoints
      });
    });
  }

  render() {
    return (
      <div>
        <h2>Data Points</h2>
        <Table
          config={this.state.tableConfig}
          data={this.state.dataPoints}
          addFormHandler={this.addFormHandler}
          updateFormHandler={this.updateFormHandler}
        />
      </div>
    );
  }
}

export default DataPoints;