import React, { useState, useEffect } from 'react';
import dataProvider from '../../../dataProvider';
import DatePicker from 'react-datepicker';


export function ETControl(props) {
  const [collectorData, setCollectorData] = useState({});
  const [commandData, setCommandData] = useState({});

  const fetchData = () => {
    dataProvider.etControl.getData().then(result => {
      const { collector, command } = result.data;
      setCollectorData(collector.data || {});
      setCommandData(command.settings || {});
    });
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  function updateCommand(data) {
    dataProvider.etControl.command(data).then(result => {
      setCommandData(result.data.settings || {});
    });
  }
  function handleCommandEnableIrrigate() {
    updateCommand({
      enableIrrigate: !commandData.enableIrrigate
    });
  }
  function handleCommandEnableFill() {
    updateCommand({
      enableFill: !commandData.enableFill
    });
  }
  function onChangeStartIrrigateTime(time) {
    setCommandData(oldData => {
      return {
        ...oldData,
        startIrrigateTime: time
      }
    });
    updateCommand({
      startIrrigateTime: time
    });
  }
  function onChangeStartFillTime(time) {
    setCommandData(oldData => {
      return {
        ...oldData,
        startFillTime: time
      }
    });
    updateCommand({
      startFillTime: time
    });
  }

  return (
    <div>
      <h2>Euro Tank control</h2>
      <table className="table mt-3">
        <tbody>
          <tr>
            <td>
              <p>
                Pump run: {collectorData['et-pump-run']}<br/>
                Fill opened: {collectorData['et-fill-opened']}<br/>
                Irrigate opened: {collectorData['et-irrigate-opened']}<br/>
                Tank full: {collectorData['et-tank-full']}<br/>
                Tank empty: {collectorData['et-tank-empty']}<br/>
                Pressure: {collectorData['et-pressure']}<br/>
                Free heap: {collectorData['et-free-heap']}<br/>
              </p>
            </td>
            <td>
              <h5>Timers</h5>
              <div className="col-auto custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={!!commandData['enableIrrigate']}
                  onChange={handleCommandEnableIrrigate}
                  id="customSwitch1"/>
                <label className="custom-control-label mr-1" htmlFor="customSwitch1">
                  Enable irrigate at
                </label>
                <DatePicker
                  selected={new Date(commandData.startIrrigateTime || null)}
                  onChange={onChangeStartIrrigateTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeCaption="Start irrigate time"
                  selectsStart
                  shouldCloseOnSelect={true}
                  disabled={false}
                />
              </div>
              <div className="col-auto custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={!!commandData['enableFill']}
                  onChange={handleCommandEnableFill}
                  id="customSwitch2"/>
                <label className="custom-control-label mr-1" htmlFor="customSwitch2">
                  Enable fill at
                </label>
                <DatePicker
                  selected={new Date(commandData.startFillTime || null)}
                  onChange={onChangeStartFillTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  timeCaption="Start fill time"
                  selectsStart
                  shouldCloseOnSelect={true}
                  disabled={false}
                />
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ETControl;
