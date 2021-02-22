import React, { Fragment, useEffect, useState } from 'react'
import dataProvider from '../../../dataProvider';

export function WeatherTable(props) {
  const [data, setData] = useState([]);

  const fetchData = () => {
    dataProvider.wf.owm.getData().then(result => {
      const { data } = result;
      setData(data || []);
    });
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  function formatDate(dateZ) {
    const date = new Date(dateZ);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  }

  function format2Digits(temp) {
    return temp.toFixed(2);
  }

  return(
    <table className="table table-bordered table-sm text-right">
      <tbody>
      <tr>
        <th>
          Date
        </th>
        {data && data.map(item => {
          const { date } = item;
          return(
            <td colSpan="2" key={"td-date-" + date}>
              {formatDate(date)}
            </td>
          );
        })}
      </tr>
      <tr>
        <th>
          Temp Feels Like
        </th>
        {data && data.map(item => {
          const { date, data: { avgTFL, heatLossTFL }} = item;
          return(
            <Fragment key={"td-fr1-" + date}>
              <td>
                {format2Digits(avgTFL)} &#8451;
              </td>
              <td className="text-primary">
                {format2Digits(heatLossTFL)} kW
              </td>
            </Fragment>
          );
        })}
      </tr>
      <tr>
        <th>
          Temp
        </th>
        {data && data.map(item => {
          const { date, data: { avgTemp, heatLossTemp }} = item;
          return(
            <Fragment key={"td-fr2-" + date}>
              <td>
                {format2Digits(avgTemp)} &#8451;
              </td>
              <td>
                {format2Digits(heatLossTemp)} kW
              </td>
            </Fragment>
          );
        })}
      </tr>
      </tbody>
    </table>
  );
}

export default WeatherTable;