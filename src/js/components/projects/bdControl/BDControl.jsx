import React, { useState, useEffect } from 'react';
import dataProvider from '../../../dataProvider';
import 'react-datepicker/dist/react-datepicker.css';
import { HeaterCommand } from '../heaterCommand';
import { WeatherTable} from './WeatherTable';

export function BDControl (props) {
  const [lastData, setLastData] = useState({});

  const fetchBRData = () => {
    dataProvider.bdControl.getData().then(result => {
      const { data } = result.data;
      setLastData(data || {});
    });
  }

  useEffect(() => {
    fetchBRData();
    const interval = setInterval(() => {
      fetchBRData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const enabledClass = 'badge badge-success';
  const disabledClass = 'badge badge-secondary';

  return (
    <div>
      <h2>Lower Boiler control</h2>
      <div>
        <p>
          TA top: {lastData['28ff0579b516038c']}<br/>
          TA mid: {lastData['28ffcf09b316036a']}<br/>
          TA bottom: {lastData['28ff74f0b216031c']}<br/>
          BD out: {lastData['28ff69250117054d']}<br/>
          BD case: {lastData['28ff4b5662180392']}<br/>
          TA wall: {lastData['28ff14170117035e']}<br/>
          FLOW: {lastData['bd-flow']}<br/>
        </p>
        <table className="table table-bordered table-sm">
          <tbody>
            <tr>
              <td>
                <span className={lastData['bd-heater-run'] ? disabledClass : enabledClass}>Run</span>
              </td>
              <td><span className={lastData['bd-heater-1'] ? disabledClass : enabledClass}>1</span></td>
              <td><span className={lastData['bd-heater-2'] ? disabledClass : enabledClass}>2</span></td>
              <td><span className={lastData['bd-heater-3'] ? disabledClass : enabledClass}>3</span></td>
              <td><span className={lastData['bd-heater-4'] ? disabledClass : enabledClass}>4</span></td>
              <td><span className={lastData['bd-heater-5'] ? disabledClass : enabledClass}>5</span></td>
              <td><span className={lastData['bd-heater-6'] ? disabledClass : enabledClass}>6</span></td>
            </tr>
          <tr>
            <td>Flow: {lastData['bd-flow']}</td>
            <td>{lastData['bd-trans-1']} A</td>
            <td>{lastData['bd-trans-2']} A</td>
            <td>{lastData['bd-trans-3']} A</td>
          </tr>
          </tbody>
        </table>
        <WeatherTable/>
      </div>
      <div>
        <HeaterCommand alias='bd'/>
      </div>
    </div>
  );
}

export default BDControl