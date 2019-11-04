import React, { Component } from "react";
import THeadItem from "./THeadItem";
import THeadItemInput from "./THeadItemInput";

class THead extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();

    this.showForm = this.showForm.bind(this);
    this.onSaveHandler = this.onSaveHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }
  initialState() {
    return {
      showForm: false,
      isSaving: false,
      fields: this.props.fields.map((field) => {
        if (!field.type || field.type === "mongoId" || field.type === "ref") {
          return {...field};
        } {
          return {
            ...field,
            value: new (field.type)()
          }
        }
      })
    };
  }

  showForm() {
    this.setState({
      showForm: true
    });
  }
  onChangeHandler(name, value) {
    let fields = this.state.fields.map(field => {
      if(field.name === name) {
        field.value = value;
      }
      return field;
    });
    this.setState({
      fields: fields
    });
  }
  onSaveHandler() {
    let newItem = {};
    this.state.fields.forEach(field => {
      newItem[field.name] = field.value;
    });
    this.setState({
      isSaving: true
    });

    this.props.addFormHandler(newItem)
      .then(() => {
        this.setState(this.initialState());
      });
  }
  renderAddCell() {
    if (this.props.addFormHandler) {
      return (
        <th>
          <button type="button" className="btn btn-primary btn-sm float-right" onClick={this.showForm}>Add</button>
        </th>
      );
    }
  }

  render() {
    const { fields, isCollapsed } = this.props;
    const { isSaving } = this.state;

    if (isCollapsed) return null;

    let saveButton = <button type="button" className="btn btn-primary btn-sm float-right" onClick={this.onSaveHandler}>Save</button>;
    let savingButton = (
      <button className="btn btn-primary" type="button" disabled >
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>
        Saving...
      </button>
    );

// TODO add onEnter event
// TODO add focus on first field form

    if (this.state.showForm) {
      return (
        <thead>
        <tr>
          {fields.map((field) => {
            return (
              <THeadItemInput
                key={field.name}
                field={field}
                onChangeHandler={this.onChangeHandler}
                isSaving={isSaving}
              />);
          })}
          <th>
            { isSaving ? savingButton : saveButton}
          </th>
        </tr>
        </thead>
      );
    } else {
      return (
        <thead>
        <tr>
          {fields.map(function(field){
            return (<THeadItem key={field.name} field={field}/>);
          })}
          {this.renderAddCell()}
        </tr>
        </thead>
      );
    }
  }
}

export default THead;