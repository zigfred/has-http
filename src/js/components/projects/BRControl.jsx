import React, { useState, useEffect } from 'react';
import dataProvider from '../../dataProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function BRControl (props) {
  const [lastData, setLastData] = useState({});
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [rangeIsInvalid, setRangeIsInvalid] = useState(true);
  const [rangeIsInRush, setRangeIsInRush] = useState(false);

  useEffect(() => {
    const fetchBRData = () => {
      dataProvider.brControl.get().then(result => {
        const { collector, command } = result.data;
        setLastData(collector.data);
        setScheduleEnabled(command.enabled);
        if (command.settings.startTime) {
          const parsedStartDate = new Date(command.settings.startTime);
          setStartTime(parsedStartDate);
        }
        if (command.settings.stopTime) {
          const parsedStopDate = new Date(command.settings.stopTime);
          setStopTime(parsedStopDate);
        }

      });
    }
    fetchBRData()
  }, []);

  useEffect(() => {
    if (!startTime) {
      return;
    }
    dataProvider.brControl.set({
      settings: {
        startTime
      }
    });
  }, [startTime]);
  useEffect(() => {
    if (!stopTime) {
      return;
    }
    dataProvider.brControl.set({
      settings: {
        stopTime
      }
    });
  }, [stopTime]);

  useEffect(() => {
    if (!startTime || !stopTime || startTime >= stopTime) {
      setRangeIsInvalid(true);
      setRangeIsInRush(false);
      return;
    }
    setRangeIsInvalid(false);

    const startHours = startTime.getHours();
    const isStartInNotOptimal = [8, 9, 20, 21, 22].includes(startHours);
    const stopHours = stopTime.getHours();
    const stopMinutes = stopTime.getMinutes();
    const isStopInNotOptimal = [9, 21, 22].includes(stopHours)
      || ([8, 20].includes(stopHours) && stopMinutes > 0)
      || startHours < 8 && stopHours > 8
      || startHours < 20 && stopHours > 20;

    if (isStartInNotOptimal || isStopInNotOptimal) {
      setRangeIsInRush(true);
      return;
    }

    setRangeIsInRush(false);
  }, [startTime, stopTime]);

  const handleCommandButton = () => {
    //todo validate schedule
    if (rangeIsInvalid) {
      return;
    }
    dataProvider.brControl.set({
      enabled: !scheduleEnabled
    }).then(result => {
      setScheduleEnabled(!scheduleEnabled);
    });
  };

  return (
    <div>
      <h2>Reserve Boiler control</h2>
      <div>
        <p>
          Forced: {lastData['br-force-enabled']}<br/>
          t IN: {lastData['28ffd44f40170322']}<br/>
          t OUT: {lastData['28ffec3d0117042e']}<br/>
          t case: {lastData['28ff6b82011704bf']}<br/>
          FLOW: {lastData['br-flow']}<br/>
          T1: {lastData['br-trans-1']}<br/>
          T2: {lastData['br-trans-2']}<br/>
          T3: {lastData['br-trans-3']}<br/>
        </p>
      </div>
      <div>
        <h5>
          <span className={'mr-3'}>Schedule {scheduleEnabled ? 'Enabled' : 'Disabled'}</span>
          {rangeIsInvalid
          && <span className="badge badge-danger">Range is invalid</span>}
          {rangeIsInRush
          && <span className="badge badge-warning">Range is not optimal</span>}
        </h5>
        <div>
          <span className={'mr-3'}>
            Start time:
            <DatePicker
              selected={startTime}
              onChange={setStartTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeCaption="Start time"
              selectsStart
              shouldCloseOnSelect={true}
              disabled={scheduleEnabled}
            />
          </span>
          <span className={'mr-3'}>
            Stop time:
            <DatePicker
              selected={stopTime}
              onChange={setStopTime}
              showTimeSelect
              showTimeSelectOnly
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Stop time"
              selectsStart
              shouldCloseOnSelect={true}
              disabled={scheduleEnabled}
            />
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            disabled={rangeIsInvalid}
            onClick={handleCommandButton}>
            {scheduleEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BRControl