import React from 'react';
import { Period } from './Period'

export function Periods(props) {
  const { periods, onChange, onRemove } = props;

  return(
    <table className="table mt-3">
      <thead>
        <tr>
          <th>Start time</th>
          <th>Stop time</th>
          <th>Run</th>
          <th>Heaters</th>
          <th>Cost</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>

      {periods && periods.map((period, index) => {
        return (
          <tr key={index}>
            <Period
              period={period}
              onChange={data => onChange(data, index)}/>

            <td>
              <button
                className="btn btn-sm btn-outline-danger"
                type="button"
                onClick={() => onRemove(index)}>
                Remove
              </button>
            </td>
          </tr>
        )
      })}
      </tbody>
    </table>
  );
}

export default Periods;