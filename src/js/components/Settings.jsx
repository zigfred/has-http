import dataProvider from "../dataProvider";
import React, { useState, useEffect } from "react";

function Settings(props) {
  const [settings, setSettings] = useState({
    collectionInterval: 0,
    heatTargetTemp: 0,
    heatLossHourlyByDegree: 0
  });

  useEffect(() => {
    async function fetchData() {
      const result = await dataProvider.getSettings();
      setSettings(result.data);
    }
    fetchData();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    const result = await dataProvider.updateSettings(settings);
    setSettings(result.data);
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setSettings({
      [name]: value
    });
  }

  const {
    collectionInterval,
    heatTargetTemp,
    heatLossHourlyByDegree
  } = settings;

  return(
    <div>
      <h2>Settings</h2>

      <form>
        <div className="form-group row">
          <label htmlFor="inputCollectionInterval" className="col-sm-2 col-form-label">Collection Interval, s</label>
          <div className="col-sm-10">
            <input
              type="number"
              min="1"
              max="60"
              className="form-control"
              id="inputCollectionInterval"
              name="collectionInterval"
              placeholder="Loading..."
              value={collectionInterval}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputHeatTargetTemp" className="col-sm-2 col-form-label">Heat Target Temp, &#8451;</label>
          <div className="col-sm-10">
            <input
              type="number"
              min="5"
              max="30"
              className="form-control"
              id="inputHeatTargetTemp"
              name="heatTargetTemp"
              placeholder="Loading..."
              value={heatTargetTemp}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputHeatLossHourlyByDegree" className="col-sm-2 col-form-label">Heat loss hourly by degree, W</label>
          <div className="col-sm-10">
            <input
              type="number"
              min="100"
              max="300"
              className="form-control"
              id="inputHeatLossHourlyByDegree"
              name="heatLossHourlyByDegree"
              placeholder="Loading..."
              value={heatLossHourlyByDegree}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
      </form>
    </div>
  );
}

export default Settings;