import dataProvider from "../dataProvider";
import React, { Component } from "react";
import Table from "./table/Table";

class Arduinos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.addFormHandler = this.addFormHandler.bind(this);
    this.updateFormHandler = this.updateFormHandler.bind(this);

    this.tableConfig = {
      listUniqueProperty: "_id",
      fields: [{
        label: "IP address",
        name: "ip",
        type: String
      }, {
        label: "Port",
        name: "port",
        type: Number
      }, {
        label: "Label",
        name: "label",
        type: String
      }, {
        label: "Save log allowed",
        name: "saveEnabled",
        type: Boolean
      }]
    };
  }

  componentDidMount() {
    dataProvider.getArduinos()
      .then(
        (result) => {
          this.setState({
            data: result.data
          });
        }).catch((error) => {
        console.log(error);
      }
    );
  }

  addFormHandler(newItem) {
    return dataProvider.addArduino(newItem)
      .then(result => {
        const data = [...this.state.data, result.data];
        this.setState({
          data: data
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateFormHandler(data, _id) {
    return dataProvider.updateArduino(_id, data).then((response) => {

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



  render() {
    return (
      <div>
        <h2>Arduinos list</h2>
        <Table
          data={this.state.data}
          config={this.tableConfig}
          addFormHandler={this.addFormHandler}
          updateFormHandler={this.updateFormHandler}
        />
      </div>
    );
  }
}

export default Arduinos;