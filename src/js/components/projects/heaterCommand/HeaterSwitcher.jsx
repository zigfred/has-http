import React from 'react';

export function HeaterSwitcher(props) {
  const {
    heaterSwitcher,
    onChange
  } = props;

  const enabledClass = 'btn btn-sm btn-success';
  const disabledClass = 'btn btn-sm btn-outline-secondary';

  const onHeaterSwitcherClick = (heaterIndex) => {
    const newHeaterSwitcher = [...heaterSwitcher];
    newHeaterSwitcher[heaterIndex] = !newHeaterSwitcher[heaterIndex];
    onChange(newHeaterSwitcher);
  };

  return(
    <div className="d-inline-block btn-group-toggle" data-toggle="buttons">
      {heaterSwitcher.map((switcher, index) => {
        return(
          <label key={'heater-switcher-' + index} className={(switcher) ? enabledClass : disabledClass}>
            <input
              type="checkbox"
              onChange={() => onHeaterSwitcherClick(index)}/>{index+1}
          </label>
        );
      })}
    </div>
  );
}

export default HeaterSwitcher;
