import React, { useState, useEffect } from 'react';
import dataProvider from '../../../dataProvider';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ClickableIconState from './ClikableIconState';

export function ETControl(props) {
  const [collectorData, setCollectorData] = useState({});
  const [commandData, setCommandData] = useState({});
  const [toggleFillLoading, setToggleFillLoading] = useState(false);
  const [togglePumpLoading, setTogglePumpLoading] = useState(false);

  const fetchData = () => {
    dataProvider.etControl.getData().then(result => {
      const { collector, command } = result.data;
      //setCollectorData(collector.data || {});
      setCommandData(command.settings || {});
    });
  }
  const fetchDirectData = () => {
    dataProvider.etControl.executeCommand('getData').then(result => {
      const { data } = result.data;
      setCollectorData(data || {});
    });
  }

  useEffect(() => {
    fetchData();
    fetchDirectData();
    const interval = setInterval(() => {
      fetchData();
      fetchDirectData();
    }, 3000);
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

  async function toggleFill(newState) {
    setToggleFillLoading(true);
    const command = newState ? 'openFill' : 'closeFill';
    const result = await dataProvider.etControl.executeCommand(command);
    const { data } = result.data;
    setCollectorData(data);
    setToggleFillLoading(false);
  }
  async function togglePump(newState) {
    setTogglePumpLoading(true);
    const command = newState ? 'runPump' : 'stopPump';
    const result = await dataProvider.etControl.executeCommand(command);
    const { data } = result.data;
    setCollectorData(data);
    setTogglePumpLoading(false);
  }
  async function toggleIrrigation() {
    const command = collectorData['et-pump-run'] ? 'stopIrrigation' : 'startIrrigation';
    const result = await dataProvider.etControl.executeCommand(command);
    const { data } = result.data;
    setCollectorData(data);
  }
  async function toggleIrrigate1(newState) {
    const command = newState ? 'openIrrigate1' : 'closeIrrigate1';
    const result = await dataProvider.etControl.executeCommand(command);
    const { data } = result.data;
    setCollectorData(data);
  }
  async function toggleIrrigate2(newState) {
    const command = newState ? 'openIrrigate2' : 'closeIrrigate2';
    const result = await dataProvider.etControl.executeCommand(command);
    const { data } = result.data;
    setCollectorData(data);
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
                Irrigate1 opened: {collectorData['et-irrigate1-opened']}<br/>
                Irrigate2 opened: {collectorData['et-irrigate2-opened']}<br/>
                Tank full: {collectorData['et-tank-full']}<br/>
                Tank empty: {collectorData['et-tank-empty']}<br/>
                Tank empty control: {collectorData['et-tank-empty-control']}<br/>
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
              <h5>Control</h5>

              <h6>
              <div className="btn-group btn-group-toggle">
                <div className="input-group-prepend">
                  <ClickableIconState
                    description={"Fill"}
                    title={"Fill valve"}
                    state={collectorData['et-fill-opened']}
                    onChange={toggleFill}
                    iconTypes={['lock', 'lock-open']}
                    isLoading={toggleFillLoading}
                  />
                </div>
                <div className="input-group-prepend cursor-pointer">
                  <span className="input-group-text btn" onClick={toggleIrrigation}>
                      {collectorData['et-pump-run'] ? "Stop" : "Start"} irrigation
                  </span>
                </div>
                <ClickableIconState
                  description={"Pump"}
                  state={collectorData['et-pump-run']}
                  onChange={togglePump}
                  iconTypes={['lock', 'lock-open']}
                  isLoading={togglePumpLoading}
                />
                <ClickableIconState
                  description={"V1"}
                  state={collectorData['et-irrigate1-opened']}
                  onChange={toggleIrrigate1}
                  iconTypes={['lock', 'lock-open']}
                />
                <ClickableIconState
                  description={"V2"}
                  state={collectorData['et-irrigate2-opened']}
                  onChange={toggleIrrigate2}
                  iconTypes={['lock', 'lock-open']}
                />
              </div>
              </h6>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ETControl;
