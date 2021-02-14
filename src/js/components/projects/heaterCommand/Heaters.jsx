import React, { useState } from 'react'

export function Heaters(props) {
  const {
    heaters,
    onChange,
    onRemove,
    onAdd
  } = props;

  const [editingHeater, setEditingHeater] = useState(false);
  const [editHeaterPower, setEditHeaterPower] = useState(1000);


  const saveHeater = () => {
    if (editingHeater === heaters.length) {
      onAdd(editHeaterPower);
    } else {
      const newHeaters = [...heaters];
      newHeaters[editingHeater] = editHeaterPower;
      onChange(newHeaters);
    }
    setEditingHeater(false);
  }

  const addHeaterBtn = (
    <button
      className="btn btn-sm btn-outline-info"
      type="button"
      disabled={editingHeater}
      onClick={() => setEditingHeater(heaters.length)}>
      Add heater
    </button>
  );
  const editHeaterInput = (
    <div key="key-input" className="input-group input-group-sm">
      <input
        type="number"
        value={editHeaterPower}
        onChange={event => setEditHeaterPower(event.target.value)}
        className="form-control" />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button" onClick={saveHeater}>Add
        </button>
      </div>
    </div>
  );

  return (
    <div className="row mt-3">
      <div className="col-auto"><h5>Heaters:</h5></div>
      <div className="col">
      {heaters && heaters.map((heater, index) => {
        if (editingHeater === index) {
          return editHeaterInput;
        } else {
          return (
            <div key={index} className="d-inline-block">
              <span
                onClick={() => {
                  setEditHeaterPower(heater);
                  setEditingHeater(index);
                }}
                className="badge badge-dark ml-2 cursor-pointer">
               {heater} W
              </span>
              <span
                onClick={() => onRemove(index)}
                className="badge badge-danger ml-1 cursor-pointer">
                X
              </span>
            </div>
          );
        }
      })}
      </div>
      <div className="col-3">
        {editingHeater === heaters.length ? editHeaterInput : addHeaterBtn}
      </div>
    </div>
  );

}

export default Heaters;