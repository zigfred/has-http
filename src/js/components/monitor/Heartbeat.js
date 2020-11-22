import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dataProvider from '../../dataProvider';

export function Heartbeat(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
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
      setIsOnline(result.status === 200);
      setIsLoading(false);
    }).catch(() => {
      setIsOnline(false);
      setIsLoading(false);
    });
  }

  return(
    <div>
      <FontAwesomeIcon
        icon='city'
        color={isOnline ? "green" : "red"}
      />
    </div>
  );
}
export default Heartbeat;