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
          TA/BT top: {lastData['28ff0579b516038c']} // {lastData['2802000781490148']}<br/>
          TA/BT mid: {lastData['28ffcf09b316036a']} // {lastData['281900005906008c']}<br/>
          TA/BT bot: {lastData['28ff74f0b216031c']} // {lastData['28030000761f008d']}<br/>
          BD in-out: {lastData['280200079540012e']} => {lastData['280c0107165d0113']}<br/>
          BD case: {lastData['28ff4b5662180392']}<br/>
          TA wall: {lastData['28ff14170117035e']}<br/>
        </p>
        <table className="table table-bordered table-sm">
          <tbody>
            <tr>
              <td>
                <span className={lastData['bd-heater-pump'] ? enabledClass : disabledClass}>Pump</span>
              </td>
              <td>
                <span className={lastData['bd-heater-run'] ? enabledClass : disabledClass}>Run</span>
              </td>
              <td><span className={lastData['bd-heater-1'] ? enabledClass : disabledClass}>1</span></td>
              <td><span className={lastData['bd-heater-2'] ? enabledClass : disabledClass}>2</span></td>
              <td><span className={lastData['bd-heater-3'] ? enabledClass : disabledClass}>3</span></td>
              <td><span className={lastData['bd-heater-4'] ? enabledClass : disabledClass}>4</span></td>
              <td><span className={lastData['bd-heater-5'] ? enabledClass : disabledClass}>5</span></td>
              <td><span className={lastData['bd-heater-6'] ? enabledClass : disabledClass}>6</span></td>
            </tr>
          <tr>
            <td>{lastData['bd-flow']} pulses</td>
            <td>{lastData['bd-trans-pump']} A</td>
            <td>{lastData['bd-trans-1']} A</td>
            <td>{lastData['bd-trans-2']} A</td>
            <td>{lastData['bd-trans-3']} A</td>
            <td>{lastData['bd-trans-4']} A</td>
            <td>{lastData['bd-trans-5']} A</td>
            <td>{lastData['bd-trans-6']} A</td>
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
