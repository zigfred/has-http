import React, { Fragment } from 'react'
import DatePicker from 'react-datepicker';
import HeaterSwitcher from './HeaterSwitcher'

export function Period (props) {
  const {
    period,
    onChange,
    disabled
  } = props;

  const {
    startTime,
    stopTime,
    heaterSwitcher,
    run,
    cost
  } = period;

  const onChangeStart = (date) => {
    onChange({
      ...period,
      startTime: date
    });
  }
  const onChangeStop = (date) => {
    onChange({
      ...period,
      stopTime: date
    });
  }

  const onChangeHeaterSwitcher = (heaterSwitcher) => {
    onChange({
      ...period,
      heaterSwitcher
    });
  }

  const toggleRun = () => {
    onChange({
      ...period,
      run: !run
    });
  }

  return (
    <Fragment>
      <td>
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
      </td>
      <td>
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
      </td>
      <td>
        <div className="d-inline-block btn-group-toggle" data-toggle="buttons">
          <label className={run ? 'btn btn-sm btn-success' : 'btn btn-sm btn-outline-secondary'}>
            <input type="checkbox" onChange={() => toggleRun(0)}/> Run
          </label>
        </div>
      </td>
      <td>
        <HeaterSwitcher
          heaterSwitcher={heaterSwitcher}
          onChange={onChangeHeaterSwitcher}/>
      </td>
        <td>
          {cost}
        </td>
    </Fragment>
  )
}

export default Period