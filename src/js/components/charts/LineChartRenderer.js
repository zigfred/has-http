import React from "react";
import {
  ChartContainer,
  ChartRow,
  Charts,
  YAxis,
  LineChart,
  Resizable,
  Legend
} from "react-timeseries-charts";
import { format } from "d3-format";
import CrossHairs from "./CrossHairs"

class LineChartRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracker: null,
      x: null,
      y: null
    };
    this.createCharts = this.createCharts.bind(this);
    this.handleTrackerChanged = this.handleTrackerChanged.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  createCharts(chartsConfig) {
    return Object.keys(chartsConfig).map(address => {
      return (
        <LineChart
          key={chartsConfig[address].axisName}
          axis={chartsConfig[address].axisName}
          series={chartsConfig[address].series}
          columns={chartsConfig[address].columns}
          style={this.props.chartConfig.styler}
        />
      );
    });
  }

  handleTrackerChanged(tracker) {
    if (!tracker) {
      this.setState({ tracker, x: null, y: null });
    } else {
      this.setState({ tracker });
    }
  };
  handleMouseMove(x, y) {
    this.setState({
      x: x,
      y: y
    });
  };


  render() {
    const f = format(",.1f");
    const {chartConfig} = this.props;
    if (!chartConfig || !Object.keys(chartConfig.charts).length) return null;

    const charts = this.createCharts(chartConfig.charts);

    if (this.state.tracker) {
      chartConfig.legend.categories.forEach((category => {
        const index = chartConfig.charts[category.key].series.bisect(this.state.tracker);
        const trackerEvent = chartConfig.charts[category.key].series.at(index);
        trackerEvent && (category.value = `°C ${f(trackerEvent.get(category.key))}`);
      }));
    }

    return (
      <div>

        <div className="row">
          <div className="col-md-10">
            <Resizable>
              <ChartContainer
                timeRange={chartConfig.timerange}
                showGridPosition="under"
                onTrackerChanged={this.handleTrackerChanged}
                onMouseMove={this.handleMouseMove}
              >
                <ChartRow height="600">
                  <Charts>
                    {charts}
                    <CrossHairs x={this.state.x} y={this.state.y} />
                  </Charts>
                  <YAxis
                    id="temp"
                    label="Temperature (°C)"
                    labelOffset={5}
                    //style={stylerData.axisStyle("temp-in38")}
                    min={5}
                    max={90}
                    width="80"
                    type="linear"
                    format=",.1f"
                  />
                </ChartRow>
              </ChartContainer>
            </Resizable>
          </div>
          <div className="col-md-2">
            <Legend
              type="line"
              align="right"
              stack={true}
              style={chartConfig.styler}
              categories={chartConfig.legend.categories}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Export example
export default LineChartRenderer;