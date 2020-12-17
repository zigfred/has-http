import React, { useState, useEffect } from 'react';
import dataProvider from '../../../dataProvider';
import 'react-datepicker/dist/react-datepicker.css';
import { commandEffect } from './commandEffect';
import { Periods } from './Periods';


export function BRControl (props) {
  const [lastData, setLastData] = useState({});

  const [
    { commandEnabled, periods, isModified, isInvalid, isNotOptimal },
    addPeriod,
    removePeriod,
    updatePeriod,
    handleCommandEnable,
    handleSave
  ] = commandEffect();

  const fetchBRData = () => {
    dataProvider.brControl.getData().then(result => {
      const { data } = result.data;
      setLastData(data);
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBRData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);


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
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id="inlineCheckbox1"
              checked={!!commandEnabled}
              onChange={handleCommandEnable}
              disabled={isInvalid}/>
            <label className="form-check-label" htmlFor="inlineCheckbox1">Enabled</label>
          </div>
          {isModified && <button
            className="btn btn-sm btn-primary mr-3"
            type="button"
            disabled={isInvalid || !isModified}
            onClick={handleSave}>
            Save
          </button>}
        </h5>
        <div>
          Validation:
          {isInvalid
          && <span className="badge badge-danger">Range is invalid</span>}
          {isNotOptimal
          && <span className="badge badge-warning">Range is not optimal</span>}
        </div>
        <Periods
          periods={periods}
          onChange={updatePeriod}
          onRemove={removePeriod}/>
        <button
          className="btn btn-sm btn-outline-info"
          type="button"
          onClick={addPeriod}>
          Add period
        </button>
      </div>
    </div>
  );
}

export default BRControl