import React, { Component } from "react";
import { TimeSeries, TimeRange } from "pondjs";
import {styler} from "react-timeseries-charts";
import palette from "google-palette"
import LineChartRenderer from "./LineChartRenderer"

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartConfig: {
        charts: {},
        legend: {}
      }
    };

    this.parseViewData = this.parseViewData.bind(this);
  }

  parseViewData() {
    const collectorData = this.props.data;

    const timeSeriesProperties = this.props.selectedDataPoints
      .reduce((result, dataPoint) => {
        result[dataPoint.address] = {
          name: dataPoint.label,
          columns: ["time", dataPoint.address],
          points: []
        };

        return result;
      }, {});

    collectorData.forEach(line => {
      const time = new Date(line.time);

      Object.keys(timeSeriesProperties).forEach((address) => {
        const value = line.data[address];
        if (typeof value !== "undefined") {
          timeSeriesProperties[address].points.push([time, value]);
        }
      });

    });
    const chartConfig = {
      charts: {},
      legend: {
        categories: []
      },
      timerange: new TimeRange([this.props.chartConfig.startDate.getTime(), this.props.chartConfig.endDate.getTime()]),
      styler: null
    };
    const stylerData = [];
    const colorPalette = palette('mpn65', Object.keys(timeSeriesProperties).length);

    Object.keys(timeSeriesProperties).forEach((address) => {

      chartConfig.charts[address] = {
        axisName: "temp",
        series: new TimeSeries(timeSeriesProperties[address]),
        columns: [address]
      };
      chartConfig.legend.categories.push({
        key: address,
        label: timeSeriesProperties[address].name
      });
      stylerData.push({
        key: address,
        color: "#" + colorPalette.shift()
      })
    });
    chartConfig.styler = styler(stylerData);

    return chartConfig;
  }

  render() {
    if (!this.props.data || !this.props.data.length) {
      return null;
    }

    return (
      <LineChartRenderer chartConfig={this.parseViewData(this.props.data)}/>
    );
  }
}

export default LineChart;