import React from "react";
import {
  ChartContainer,
  ChartRow,
  Charts,
  YAxis,
  AreaChart,
  LineChart,
  ScatterChart,
  Resizable,
  Legend,
  styler
} from "react-timeseries-charts";

class ChartAll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracker: null
    };
  }

  render() {
    const {stylerData, dataPoints} = this.props;
    return (
      <div>

        <div className="row">
          <div className="col-md-10">
            <Resizable>
              <ChartContainer
                timeRange={dataPoints.in38Series.timerange()}
                showGridPosition="under"
                trackerPosition={this.state.tracker}
                trackerTimeFormat="%X"
                onTrackerChanged={tracker => this.setState({ tracker })}
              >
                <ChartRow height="600">
                  <Charts>
                    <LineChart
                      axis="temp"
                      series={dataPoints.in38Series}
                      columns={["temp-in38"]}
                      style={stylerData}
                    />
                    <LineChart
                      axis="temp"
                      series={dataPoints.out22Series}
                      columns={["temp-out22"]}
                      style={stylerData}
                    />
                    <LineChart
                      axis="temp"
                      series={dataPoints.inbfSeries}
                      columns={["temp-inbf"]}
                      style={stylerData}
                    />
                    <LineChart
                      axis="temp"
                      series={dataPoints.out2eSeries}
                      columns={["temp-out2e"]}
                      style={stylerData}
                    />
                  </Charts>
                  <YAxis
                    id="temp"
                    label="Temperature (°C)"
                    labelOffset={5}
                    style={stylerData.axisStyle("temp-in38")}
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
              style={stylerData}
              categories={[
                { key: "temp-in38", label: "Temperature in 38" },
                { key: "temp-out22", label: "Temperature out 22" },
                { key: "temp-inbf", label: "Temperature in bf" },
                { key: "temp-out2e", label: "Temperature out 2e" }
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
}

// Export example
export default ChartAll;