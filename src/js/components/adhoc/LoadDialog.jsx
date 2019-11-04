import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import dataProvider from "../../dataProvider";

import {Button, Modal, Table } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class LoadDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleLoad = this.handleLoad.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.loadData = this.loadData.bind(this);

    this.state = {
      filters: []
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.props.show && nextProps.show) {
      this.loadData();
    }
  }

  loadData() {
    dataProvider.getFilters()
      .then(response => {
        if (response.data) {
          this.setState({
            filters: response.data
          });
        }
      });
  }

  handleLoad(e) {
    this.props.onCloseLoad();
    this.props.history.push('/adhoc/' + e.currentTarget.value);
  }

  handleDelete(e) {
    const name = e.currentTarget.value;

    dataProvider.deleteFilter(name)
      .then(() => {
        // TODO notify result
        const filters = this.state.filters.filter(item => {
          return item.name !== name;
        });
        this.setState({
          filters: filters
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <Modal size="lg" show={this.props.show} onHide={this.props.onCloseLoad}>
        <Modal.Header closeButton>
          <Modal.Title>Load filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered responsive>
            <thead>
              <tr>
                <th>X</th>
                <th>Load</th>
                <th>Name</th>
                <th>Filters</th>
              </tr>
            </thead>
            <tbody>
            {this.state.filters.map(filter => {
              return(
                <tr key={filter._id}>
                  <td>
                    <Button variant="danger" value={filter.name} onClick={this.handleDelete}>
                      <FontAwesomeIcon icon="times"/>
                    </Button>
                  </td>
                  <td>
                    <Button variant="success" value={filter.name} onClick={this.handleLoad}>
                      <FontAwesomeIcon icon="upload"/>
                    </Button>
                  </td>
                  <td>
                    {filter.name}
                  </td>
                  <td>
                    <pre>{JSON.stringify(filter.filters, null, 2) }</pre>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  }
}

export default withRouter(LoadDialog);