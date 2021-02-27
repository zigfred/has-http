import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dataProvider from '../../dataProvider';

export function Heartbeat(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isPowered, setIsPowered] = useState(false);

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
      const { data : { data: powerCheck }} = result;
      setIsOnline(result.status === 200);
      setIsPowered(powerCheck);
      setIsLoading(false);
    }).catch(() => {
      setIsOnline(false);
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
    </div>
  );
}
export default Heartbeat;