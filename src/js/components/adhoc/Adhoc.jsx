import React, { Component } from "react";
import Filters from "./filters/Filters"
import LineChart from "../charts/LineChart"
import dataProvider from "../../dataProvider";
import ProgressBar from "react-bootstrap/ProgressBar";
import Table from "../table/Table";


const VIEW_TYPE_TABLE = "table";
const VIEW_TYPE_CHART = "chart";


class Adhoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isViewLoading: false,
      viewType: VIEW_TYPE_CHART,
      viewData: [],
      dataPoints: [],
      selectedDataPoints: [],
      startDate: new Date(),
      endDate: new Date(),
      reports: [],
      isDataPointsLoaded: false
    };

    this.onApplyFilters = this.onApplyFilters.bind(this);
    this.onChangeViewType = this.onChangeViewType.bind(this);
    this.onSaveClicked = this.onSaveClicked.bind(this);
    this.onViewLoadingChange = this.onViewLoadingChange.bind(this);
  }

  componentDidMount() {
    dataProvider.getDataPoints()
      .then(response => {
        if (response.data) {
          this.setState({
            dataPoints: response.data,
            isDataPointsLoaded: true
          });
        }
      });
  }

  onApplyFilters(filters) {
    const oldFilters = {
      selectedDataPoints: this.state.selectedDataPoints,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      relativeDate: this.state.relativeDate,
      isRelativeDate: this.state.isRelativeDate
    };

    if (JSON.stringify(oldFilters) !== JSON.stringify(filters)) {
      console.log("update");

      this.loadData(filters);
      this.setState({
        ...filters
      });
    }
  }

  onChangeViewType(e) {
    this.setState({
      viewType: e.target.value
    });
  }

  onViewLoadingChange(isViewLoading) {
    this.setState({
      isViewLoading: isViewLoading
    });
  }

  onSaveClicked() {
    console.log("save");
  }

  loadData(filters) {
    if (!filters.selectedDataPoints.length) {
      this.setState({
        viewData: []
      });
    } else {
      this.setState({
        isViewLoading: true
      });
      dataProvider.getCollectorsData({
        address: filters.selectedDataPoints.map(dataPoint => dataPoint.address),
        startDate: filters.startDate,
        endDate: filters.endDate,
        relativeDate: filters.relativeDate,
        isRelativeDate: filters.isRelativeDate
      })
        .then(response => {
          this.setState({
            isViewLoading: false,
            viewData: response.data
          });
        })
        .catch(err => {
          this.setState({
            isViewLoading: false
          });
        });
    }
  }

  renderView() {
    switch(this.state.viewType) {
      case VIEW_TYPE_TABLE:
        const tableConfig = {
          listUniqueProperty: "_id",
          hideEmpty: true,
          fields: this.state.selectedDataPoints.map(dataPoint => {
            return {
              label: dataPoint.label,
              name: "data." + dataPoint.address
            }
          })
        };
        tableConfig.fields.unshift({
          label: "Time",
          name: "time"
         });
        return (
          <Table
            data={this.state.viewData}
            config={tableConfig}
          />
        );
      case VIEW_TYPE_CHART:
        return(
          <LineChart
            data={this.state.viewData}
            selectedDataPoints={this.state.selectedDataPoints}
            chartConfig={{
              startTime: calcStartTime(this.state),
              endTime: this.state.isRelativeDate ? +new Date() : this.state.endDate.getTime()
            }}
          />
        );
    }
  }

  render() {
    return(
      <div className="mt-1">
        {this.state.isDataPointsLoaded ? <Filters
          loadFilter={this.props.match.params.filter}
          dataPoints={this.state.dataPoints}
          onApplyFilters={this.onApplyFilters}
          viewType={this.state.viewType}
          onChangeViewType={this.onChangeViewType}
          pauseFilters={this.state.isViewLoading}
        /> : ""}
        <div className="">
          <ProgressBar
            className={"my-1 progress-chart " + (this.state.isViewLoading ? "visible" : "invisible")}
            animated
            now={100}
          />
          {this.renderView()}
        </div>
      </div>
    );
  }
}

export default Adhoc;

function calcStartTime ({ startDate, isRelativeDate, relativeDate }) {
  if (startDate && !isRelativeDate) {
    return startDate.getTime();
  } else {
    const { days, hours, minutes } = relativeDate;
    let shiftMs = 0;
    if (minutes) {
      shiftMs += minutes * 60 * 1000;
    }
    if (hours) {
      shiftMs += hours * 60 * 60 * 1000;
    }
    if (days) {
      shiftMs += days * 24 * 60 * 60 * 1000;
    }
    if (!shiftMs) {
      shiftMs = 24 * 60 * 60 * 1000; // one day milliseconds
    }
    return +(new Date()) - shiftMs;
  }
}