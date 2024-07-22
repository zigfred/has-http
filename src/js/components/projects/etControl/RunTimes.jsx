import React from 'react';
export function RunTimes(props) {

  const {
    lastRunTime,
    lastStopTime
  } = props;

  const timeSinceLastRun = timeSince(new Date(lastRunTime));
  const timeSinceLastStop = timeSince(new Date(lastStopTime));

  const opt = {
    hourCycle: 'h23',
    month: "long",
    day: "numeric",
    hour: 'numeric',
    minute: 'numeric'
  };
  const lastRunText = new Date(lastRunTime).toLocaleString('ua',opt);
  const lastStopText = new Date(lastStopTime).toLocaleString('ua',opt);

  return (
    <div>
      <div>last run time: {timeSinceLastRun} ago ({lastRunText}) </div>
      <div>last run time: {timeSinceLastStop} ago ({lastStopText}) </div>

    </div>
  );
}

export default RunTimes;

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
