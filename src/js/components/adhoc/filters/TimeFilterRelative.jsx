import React, { Component } from 'react'

class TimeFilter extends Component {
  constructor () {
    super();

    this.onInputChange = this.onInputChange.bind(this);
  }

  onInputChange(e) {
    const data = {};
    data[e.target.name] = e.target.value;
    this.props.onRelativeFilterChange(data);
  }


  render() {
    return (
      <div className="col ">
          <div className="input-group input-group-sm relative-date">
            <input
              type="number"
              className="form-control"
              name='days'
              onChange={this.onInputChange}
              value={this.props.relativeDate.days}
            />
            <div className="input-group-append">
              <span className="input-group-text">days</span>
            </div>
          </div>
          <div className="input-group input-group-sm relative-date">
            <input
              type="number"
              className="form-control"
              name='hours'
              onChange={this.onInputChange}
              value={this.props.relativeDate.hours}
            />
            <div className="input-group-append">
              <span className="input-group-text">hours</span>
            </div>
          </div>
          <div className="input-group input-group-sm relative-date">
            <input
              type="number"
              className="form-control"
              name='minutes'
              onChange={this.onInputChange}
              value={this.props.relativeDate.minutes}
            />
            <div className="input-group-append">
              <span className="input-group-text">minutes</span>
            </div>
          </div>
      </div>
    );
  }
}

export default TimeFilter;