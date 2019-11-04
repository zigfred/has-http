import React, { Component } from "react";
import LineChart from "./charts/LineChart"
import Sidebar from "./sidebar/Sidebar"
import dataProvider from "../dataProvider";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";


class Charts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dataPoints: [],
      selectedDataPoints: [],
      chartConfig: {
        startDate: new Date(((new Date()) - 1000 * 60 * 60 * 24)),
        endDate: new Date()
      }
    };

    this.onChangeDataPointSelection = this.onChangeDataPointSelection.bind(this);
    this.handleDatePickerStartChange = this.handleDatePickerStartChange.bind(this);
    this.handleDatePickerEndChange = this.handleDatePickerEndChange.bind(this);
    this.checkboxList = this.checkboxList.bind(this);
    this.formSelectedDataPointsList = this.formSelectedDataPointsList.bind(this);
  }


  componentDidMount() {
    dataProvider.getDataPoints()
      .then(response => {
        this.setState({
          dataPoints: response.data || []
        });
      });
  }

  onChangeDataPointSelection(e) {
    const selectedId = e.target.name;
    const selectedIndex = this.state.selectedDataPoints.indexOf(selectedId);
    const selectedDataPoints = [...this.state.selectedDataPoints];

    if (selectedIndex > -1) {
      selectedDataPoints.splice(selectedIndex, 1);
    } else {
      selectedDataPoints.push(selectedId);
    }

    this.setState({
      selectedDataPoints: selectedDataPoints
    });
  }


  checkboxList() {
    return this.state.dataPoints.map(dataPoint => {
      return(
        <div className="form-check" key={"dataPointSelectionCheckbox-" + dataPoint._id}>
          <input
            className="form-check-input"
            type="checkbox"
            name={dataPoint._id}
            id={"dataPointSelectionCheckbox-" + dataPoint._id}
            checked={this.state.selectedDataPoints.includes(dataPoint._id)}
            onChange={this.onChangeDataPointSelection}
          />
          <label className="form-check-label" htmlFor={"dataPointSelectionCheckbox-" + dataPoint._id}>
            {dataPoint.label}
          </label>
        </div>
      )
    });
  }
  handleDatePickerStartChange(date) {
    this.setState({
      chartConfig: {
        ...this.state.chartConfig,
        startDate: date
      }
    });
  }
  handleDatePickerEndChange(date) {
    this.setState({
      chartConfig: {
        ...this.state.chartConfig,
        endDate: date
      }
    });
  }
  formSelectedDataPointsList() {
    return this.state.dataPoints.reduce((memo, dataPoint) => {
      if (this.state.selectedDataPoints.includes(dataPoint._id)) {
        memo.push(dataPoint);
      }
      return memo;
    }, []);
  }


  render() {
    return(
      <div>
        <Sidebar sidebar={
          <div>
            <div>
              <DatePicker
                selected={this.state.chartConfig.startDate}
                onChange={this.handleDatePickerStartChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy MMM dd hh:mm"
                timeCaption="time"
                selectsStart
                startDate={this.state.chartConfig.startDate}
                endDate={this.state.chartConfig.endDate}
                shouldCloseOnSelect={false}
              />
            </div>
            <div>
              <DatePicker
                selected={this.state.chartConfig.endDate}
                onChange={this.handleDatePickerEndChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy MMM dd hh:mm"
                timeCaption="time"
                selectsEnd
                startDate={this.state.chartConfig.startDate}
                endDate={this.state.chartConfig.endDate}
                shouldCloseOnSelect={false}
              />
            </div>
            <div>{this.checkboxList()}</div>
          </div>
        } content={
          <LineChart
            selectedDataPoints={this.formSelectedDataPointsList()}
            chartConfig={this.state.chartConfig}
          />
        }
        />
      </div>
    );
  }
}

export default Charts;