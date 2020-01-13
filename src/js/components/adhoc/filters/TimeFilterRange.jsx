import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import React, { Component } from 'react'



class TimeFilterRange extends Component {


  render() {

    return (
      <div className="col">
        <div>
          <DatePicker
            selected={this.props.startDate}
            onChange={this.props.handleDatePickerStartChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy MMM dd HH:mm"
            timeCaption="time"
            selectsStart
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            shouldCloseOnSelect={false}
          />
        </div>
        <div>
          <DatePicker
            selected={this.props.endDate}
            onChange={this.props.handleDatePickerEndChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy MMM dd HH:mm"
            timeCaption="time"
            selectsEnd
            startDate={this.props.startDate}
            endDate={this.props.endDate}
            shouldCloseOnSelect={false}
          />
        </div>
      </div>
    );
  }
}

export default TimeFilterRange;