import React, { Component } from "react";

class THeadItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false
    };
  }



  render() {
    const { field } = this.props;
    return (
      <th>{ field.label }</th>
    );
  }
}

export default THeadItem;