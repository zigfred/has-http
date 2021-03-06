import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dataProvider from '../../dataProvider';

export function Heartbeat(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isPowered, setIsPowered] = useState(false);
  const [isOnlineStationEuroTank, setIsOnlineStationEuroTank] = useState(false);

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
      const data = result.data.data;
      const powerCheck = data && data.powerCheck;
      const stationEuroTankCheck = data && data.stationEuroTankCheck;
      setIsOnline(result.status === 200);
      setIsPowered(powerCheck);
      setIsOnlineStationEuroTank(stationEuroTankCheck);
      setIsLoading(false);
    }).catch(() => {
      setIsOnline(false);
      setIsPowered(false);
      setIsOnlineStationEuroTank(false);
      setIsLoading(false);
    });
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
      <span className="pr-1">
        <FontAwesomeIcon
          icon='window-maximize'
          color={isOnlineStationEuroTank ? "green" : "red"}
        />
      </span>
    </div>
  );
}
export default Heartbeat;
