import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dataProvider from '../../dataProvider';

class DeviceChecker {
  constructor (params) {
    if (!params) {
      throw new Error('Provide params to create DeviceChecker instance');
    }
    const { address } = params;

    this._address = address;
    this._label = address.replace('ping', '');
  }
}

const statesEnum = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  UNKNOWN: 'unknown',
};
function getStatusColor(params) {
  const { isOnline, lastCheck } = params;
  if (!isOnline) {
    return 'gray';
  }

  if (lastCheck === 1) {
    return 'green';
  }
  if (lastCheck === 0) {
    return 'red';
  }
  return 'gray';
}

export function Heartbeat(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isPowered, setIsPowered] = useState(false);

  const [deviceChecks, setDeviceChecks] = useState([]);

  useEffect(() => {
    pingHost();
    const interval = setInterval(() => {
      pingHost();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function pingHost() {
    if (isLoading) {
      setIsOnline(false);
      return;
    }

    setIsLoading(true);
    dataProvider.heartbeat().then(result => {
      const data = result.data;
      setIsOnline(result.status === 200);

      // detect power by heat pumps
      const isPowered = Object.keys(data).some(address => {
        return address.search(/ping-hp-/) !== -1 && data[address] === 1;
      });
      setIsPowered(isPowered);


      const newState = Object.keys(data).map(address => {
        return {
          title: address.replace(/ping-/, ''),
          lastCheck: data[address]
        }
      });
      setDeviceChecks(newState);

      setIsLoading(false);
    }).catch(() => {
      setIsOnline(false);
      setIsPowered(false);
      setIsLoading(false);
    });
  }

  function renderDeviceChecks() {
    return deviceChecks.map(renderDeviceCheck);
  }

  function renderDeviceCheck(deviceCheck) {
    const { title, lastCheck } = deviceCheck;

    const color = getStatusColor({
      isOnline,
      lastCheck,
    });

    return (
      <span key={'icon-check-' + title} className="pr-1" title={title}>
        <FontAwesomeIcon
          icon='window-maximize'
          color={color}
        />
      </span>
    );
  }

  return(
    <div>
      <span className="pr-1">
        <FontAwesomeIcon
          icon='city'
          color={isOnline ? "green" : "red"}
        />
      </span>
      <span className="pr-1">
        <FontAwesomeIcon
          icon='plug'
          color={isPowered ? "green" : "red"}
        />
      </span>
      {renderDeviceChecks()}
    </div>
  );
}
export default Heartbeat;
