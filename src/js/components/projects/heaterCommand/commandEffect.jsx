import { useState, useEffect } from 'react';
import { HeaterCommandPresenter } from './HeaterCommandPresenter'
import dataProvider from '../../../dataProvider'

export function commandEffect(alias) {
  const initCommandState = {
    alias,
    enabled: false,
    settings: {
      periods: [],
      heaters: []
    }
  };
  const initState = new HeaterCommandPresenter({})
  .setCommand(initCommandState)
  .toState();

  const [state, setState] = useState(initState);
  const [serverCommandState, setServerCommandState] = useState(null);

  useEffect(() => {
    const fetchBRCommand = () => {
      dataProvider.command.getCommand(alias).then(result => {
        const newState = new HeaterCommandPresenter(state)
          .setCommand(result.data || {})
          .toState();
        setState(newState);
        setServerCommandState(result.data || {});
      });
    }
    fetchBRCommand();
  }, []);

  const addPeriod = () => {
    const newState = new HeaterCommandPresenter(state)
      .addPeriod()
      .toState();
    setState(newState);
  }

  const removePeriod = (index) => {
    const newState = new HeaterCommandPresenter(state)
      .removePeriod(index)
      .toState();
    setState(newState);
  }

  const updatePeriod = (data, index) => {
    const newState = new HeaterCommandPresenter(state)
      .updatePeriod(data, index)
      .toState();
    setState(newState);
  }

  const addHeater = (power) => {
    const newState = new HeaterCommandPresenter(state)
      .addHeater(power)
      .toState();
    setState(newState);
  }

  const removeHeater = (index) => {
    const newState = new HeaterCommandPresenter(state)
      .removeHeater(index)
      .toState();
    setState(newState);
  }

  const updateHeaters = (data) => {
    const newState = new HeaterCommandPresenter(state)
      .updateHeaters(data)
      .toState();
    setState(newState);
  }

  const setSkynet = () => {
    const newState = new HeaterCommandPresenter(state)
      .toggleSkynet()
      .toState();
    setState(newState);
  }

  const handleCommandEnable = () => {
    const newState = new HeaterCommandPresenter(state)
      .toggleEnabled()
      .toState();
    setState(newState);
  }

  const handleSave = () => {
    const command = new HeaterCommandPresenter(state).toCommand();
    dataProvider.command.setCommand(command).then(() => {
      setServerCommandState(command);
    });
  }

  const isModified = new HeaterCommandPresenter(state).isModified(serverCommandState);

  return [
    {
      ...state,
      isModified
    },
    addPeriod,
    removePeriod,
    updatePeriod,
    addHeater,
    removeHeater,
    updateHeaters,
    setSkynet,
    handleCommandEnable,
    handleSave
  ]

}

export default commandEffect;