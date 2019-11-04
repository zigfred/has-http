import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import dataProvider from "../../dataProvider";
import SaveDialog from './SaveDialog';
import LoadDialog from './LoadDialog';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Select from 'react-select';
import {Button, ButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const VIEW_TYPE_TABLE = "table";
const VIEW_TYPE_CHART = "chart";


class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSaveDialog: false,
      showLoadDialog: false,

      dataPoints: this.props.dataPoints,
      startDate: new Date(((new Date()) - 1000 * 60 * 60 * 24 * 5)),
      endDate: new Date(),
      reports: []
    };

    this.loadFilter(this.props.loadFilter);

    this.handleDatePickerStartChange = this.handleDatePickerStartChange.bind(this);
    this.handleDatePickerEndChange = this.handleDatePickerEndChange.bind(this);
    this.checkboxList = this.checkboxList.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.openSaveDialog = this.openSaveDialog.bind(this);
    this.closeSaveDialog = this.closeSaveDialog.bind(this);
    this.onSave = this.onSave.bind(this);
    this.openLoadDialog = this.openLoadDialog.bind(this);
    this.closeLoadDialog = this.closeLoadDialog.bind(this);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      dataPoints: nextProps.dataPoints,
      pauseFilters: nextProps.pauseFilters
    });

    if (this.props.loadFilter !== nextProps.loadFilter) {
      this.loadFilter(nextProps.loadFilter);
    }
  }

  loadFilter(filter) {
    if (filter !== undefined) {
      dataProvider.getFilter(filter)

        .then(response => {
          const selectedIds = response.data.filters.dataPoints;
          const dataPoints = this.state.dataPoints.map(item => {
            item.selected = selectedIds.includes(item._id);
            return item;
          });

          this.setState({
            dataPoints: dataPoints,
            startDate: new Date(response.data.filters.startDate),
            endDate: new Date(response.data.filters.endDate),
          });

        });
    }
  }

  onApplyFilters() {
    this.props.onApplyFilters({
      selectedDataPoints: this.state.dataPoints.filter(item => item.selected),
      startDate: this.state.startDate,
      endDate: this.state.endDate
    });
  }

  onSelectionChange(selected) {
    const selectedIds = selected.map(item => item.value);
    const dataPoints = this.state.dataPoints.map(item => {
      item.selected = selectedIds.includes(item._id);
      return item;
    });
    this.setState({
      dataPoints: dataPoints
    });
  }

  checkboxList() {
    let selectOptions = [];
    let selectedOptions = [];
    this.state.dataPoints.forEach(item => {
      const option = {
        value: item._id,
        label: item.label
      };

      selectOptions.push(option);

      if (item.selected) {
        selectedOptions.push(option)
      }
    });

    return (<Select
      isMulti={true}
      isSearchable={true}
      value={selectedOptions}
      closeMenuOnSelect={false}
      onChange={this.onSelectionChange}
      options={selectOptions}
    />);
  }
  handleDatePickerStartChange(date) {
    this.setState({
      startDate: date
    });
  }
  handleDatePickerEndChange(date) {
    this.setState({
      endDate: date
    });
  }

  openSaveDialog() {
    this.setState({
      showSaveDialog: true
    });
  }
  closeSaveDialog() {
    this.setState({
      showSaveDialog: false
    });
  }

  onSave(name) {
    this.setState({
      showSaveDialog: false
    });

    dataProvider.saveFilters({
      name: name,
      filters: {
        dataPoints: this.state.dataPoints.filter(item => item.selected).map(item => item._id),
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      }
    })
      .then(() => {
        // TODO notify result
        this.props.history.push('/adhoc/' + name);
      })
      .catch(err => {
        console.log(err);
      });
  }

  openLoadDialog() {
    this.setState({
      showLoadDialog: true
    });
  }
  closeLoadDialog() {
    this.setState({
      showLoadDialog: false
    });
  }


  render() {
    const pauseFilters = this.props.pauseFilters;
    const activeStyles = "btn btn-primary active";
    const inactiveStyles = "btn btn-outline-primary";
    const isChartActive = this.props.viewType === VIEW_TYPE_CHART;
    const isTableActive = this.props.viewType === VIEW_TYPE_TABLE;


    return(

      <div className="row">
        <SaveDialog
          keyboard={true}
          show={this.state.showSaveDialog}
          onSave={this.onSave}
          onCloseSave={this.closeSaveDialog}
          name={this.props.loadFilter}
        />
        <LoadDialog
          keyboard={true}
          show={this.state.showLoadDialog}
          onDelete={this.onDeleteFilters}
          onCloseLoad={this.closeLoadDialog}
        />
        <div className="col-md-auto">
          <DatePicker
            selected={this.state.startDate}
            onChange={this.handleDatePickerStartChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy MMM dd hh:mm"
            timeCaption="time"
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            shouldCloseOnSelect={false}
          />
        </div>
        <div className="col-md-auto">
          <DatePicker
            selected={this.state.endDate}
            onChange={this.handleDatePickerEndChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy MMM dd hh:mm"
            timeCaption="time"
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            shouldCloseOnSelect={false}
          />
        </div>
        <div className="col">{this.checkboxList()}</div>
        <div className="col-md-auto">
          <Button
            variant="outline-primary"
            disabled={pauseFilters}
            onClick={!pauseFilters ? this.onApplyFilters : null}
          >
            {pauseFilters ? 'Loading…' : 'Apply'}
          </Button>
        </div>
        <div className="col-md-auto">
          <div className="btn-group btn-group-toggle">
            <label className={isChartActive ? activeStyles : inactiveStyles}>
              <input type="radio" name="viewType" value={VIEW_TYPE_CHART} onChange={this.props.onChangeViewType}/>
              <FontAwesomeIcon
                icon="chart-line"
                color={isChartActive ? "white" : "gray"}
              />
            </label>
            <label className={isTableActive ? activeStyles : inactiveStyles}>
              <input type="radio" name="viewType" value={VIEW_TYPE_TABLE} onChange={this.props.onChangeViewType}/>
              <FontAwesomeIcon
                icon="table"
                color={isTableActive ? "white" : "gray"}
              />
            </label>
          </div>
        </div>
        <div className="col-md-auto">
          <ButtonGroup>
            <Button variant="info" onClick={this.openSaveDialog}>
              <FontAwesomeIcon icon="save"/>
            </Button>
            <Button variant="info" onClick={this.openLoadDialog}>
              <FontAwesomeIcon icon="folder"/>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default withRouter(Filters);