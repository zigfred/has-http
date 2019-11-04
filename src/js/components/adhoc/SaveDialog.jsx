import React, { Component } from "react";

import {Button, Modal, InputGroup, FormControl } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class SaveDialog extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSave = this.handleSave.bind(this);
    this.handleInput = this.handleInput.bind(this);

    this.state = {
      name: this.props.name
    };
  }

  handleSave() {
    this.props.onSave(this.state.name);
  }

  handleInput(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onCloseSave}>
        <Modal.Header closeButton>
          <Modal.Title>Save filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              placeholder="Filters name"
              defaultValue={this.state.name}
              onChange={this.handleInput}
            />
            <InputGroup.Append>
              <Button variant="success" onClick={this.handleSave}>
                <FontAwesomeIcon icon="save"/>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

export default SaveDialog;