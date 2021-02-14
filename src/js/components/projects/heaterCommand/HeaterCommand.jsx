import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './heaterCommand.css';
import { commandEffect } from './commandEffect';
import Periods from './Periods';
import Heaters from './Heaters'


export function HeaterCommand(props) {
  const { alias } = props;

  const [
    {
      enabled,
      periods,
      heaters,
      isModified,
      isInvalidPeriod,
      isInvalidHeaterSwitcher,
      isNotOptimal,
      totalCost
    },
    addPeriod,
    removePeriod,
    updatePeriod,
    addHeater,
    removeHeater,
    updateHeaters,
    handleCommandEnable,
    handleSave
  ] = commandEffect(alias);

  return (
    <div className='heaterCommand'>
      <div>
        <div className="row">
          <div className="col-auto"><h5>Control:</h5></div>
          <div className="col-auto custom-control custom-switch">
            <input
              type="checkbox"
              className="custom-control-input"
              checked={!!enabled}
              onChange={handleCommandEnable}
              disabled={isInvalidPeriod || isInvalidHeaterSwitcher}
              id="customSwitch1"/>
              <label className="custom-control-label" htmlFor="customSwitch1">Enabled</label>
          </div>
          <div className="col-auto custom-control custom-switch">
            Total cost: {totalCost}
          </div>
          <div className="col">
            {isModified && <button
              className="btn btn-sm btn-primary"
              type="button"
              disabled={isInvalidPeriod || isInvalidHeaterSwitcher || !isModified}
              onClick={handleSave}>
              Save
            </button>}
          </div>
          <div className="col">
            {isInvalidHeaterSwitcher
            && <span className="badge badge-danger">Heaters are invalid</span>}
            {isInvalidPeriod
            && <span className="badge badge-danger">Range is invalid</span>}
            {isNotOptimal
            && <span className="badge badge-warning">Range is not optimal</span>}
          </div>
        </div>
      </div>

      <Heaters
        heaters={heaters}
        onChange={updateHeaters}
        onRemove={removeHeater}
        onAdd={addHeater}/>

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
  );
}

export default HeaterCommand;