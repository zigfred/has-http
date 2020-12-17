import { useState, useEffect } from 'react';
import { BRCommandPresenter } from './BRCommandPresenter'
import dataProvider from '../../../dataProvider'

const initCommandState = {
  enabled: false,
  settings: {
    periods: []
  }
}
export function commandEffect() {
  const [state, setState] = useState(initCommandState);
  const [serverCommandState, setServerCommandState] = useState(null);

  useEffect(() => {
    const fetchBRCommand = () => {
      dataProvider.brControl.getCommand().then(result => {
        const newState = new BRCommandPresenter(state)
          .setCommand(result.data)
          .toState();
        setState(newState);
        setServerCommandState(result.data);
      });
    }
    fetchBRCommand();
  }, []);

  const addPeriod = () => {
    const newState = new BRCommandPresenter(state)
      .addPeriod()
      .toState();
    setState(newState);
  }
  const removePeriod = (index) => {
    const newState = new BRCommandPresenter(state)
      .removePeriod(index)
      .toState();
    setState(newState);
  }
  const updatePeriod = (data, index) => {
    const newState = new BRCommandPresenter(state)
      .updatePeriod(data, index)
      .toState();
    setState(newState);
  }
  const handleCommandEnable = () => {
    const newState = new BRCommandPresenter(state)
      .toggleEnabled()
      .toState();
    setState(newState);
  }
  const handleSave = () => {
    const command = new BRCommandPresenter(state).toCommand();
    dataProvider.brControl.setCommand(command).then(() => {
      setServerCommandState(command);
    });
  }

  const isModified = new BRCommandPresenter(state).isModified(serverCommandState);

  return [
    {
      ...state,
      isModified
    },
    addPeriod,
    removePeriod,
    updatePeriod,
    handleCommandEnable,
    handleSave
  ]

}

export default commandEffect;