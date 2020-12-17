import React, { Fragment } from 'react'
import DatePicker from 'react-datepicker';

export function Period (props) {
  const {
    period,
    onChange,
    disabled
  } = props;

  const {
    startTime,
    stopTime
  } = period;

  const onChangeStart = (date) => {
    onChange({
      startTime: date,
      stopTime
    });
  }
  const onChangeStop = (date) => {
    onChange({
      startTime,
      stopTime: date
    });
  }

  return (
    <Fragment>
      <span className={'mr-3'}>
        Start time:
        <DatePicker
          selected={startTime}
          onChange={onChangeStart}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          timeCaption="Start time"
          selectsStart
          shouldCloseOnSelect={true}
          disabled={disabled}
        />
      </span>
      <span className={'mr-3'}>
        Stop time:
        <DatePicker
          selected={stopTime}
          onChange={onChangeStop}
          showTimeSelect
          showTimeSelectOnly
          timeFormat="HH:mm"
          dateFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Stop time"
          selectsStart
          shouldCloseOnSelect={true}
          disabled={disabled}
        />
      </span>
    </Fragment>
  )
}

export default Period