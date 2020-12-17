import React from 'react';
import { Period } from './Period'

export function Periods(props) {
  const { periods, onChange, onRemove } = props;

  return(
    <div>
      {periods && periods.map((period, index) => {
        return (
          <div key={index}>
            <Period period={period} onChange={data => onChange(data, index)}/>
            <button
              className="btn btn-sm btn-outline-secondary"
              type="button"
              onClick={() => onRemove(index)}>
              Remove
            </button>
          </div>
        )
      })}
    </div>
  )

}

export default Periods;