import React, { useState, useEffect } from 'react';
import dataProvider from '../../../dataProvider';
import { HeaterCommand } from '../heaterCommand'


export function BRControl (props) {
  const [lastData, setLastData] = useState({});

  const fetchBRData = () => {
    dataProvider.brControl.getData().then(result => {
      const { data } = result.data;
      setLastData(data || {});
    });
  }

  useEffect(() => {
    fetchBRData();
    const interval = setInterval(() => {
      fetchBRData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <h2>Reserve Boiler control</h2>
      <div>
        <p>
          Forced: {lastData['br-force-enabled']}<br/>
          t IN: {lastData['28ffd44f40170322']}<br/>
          t OUT: {lastData['28ffec3d0117042e']}<br/>
          t case: {lastData['28ff6b82011704bf']}<br/>
          FLOW: {lastData['br-flow']}<br/>
          T1: {lastData['br-trans-1']}<br/>
          T2: {lastData['br-trans-2']}<br/>
          T3: {lastData['br-trans-3']}<br/>
        </p>
      </div>
      <HeaterCommand alias='br'/>
    </div>
  );
}

export default BRControl;