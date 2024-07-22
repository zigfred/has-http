import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const activeStyles = "btn btn-outline-secondary";
const inactiveStyles = "btn btn-outline-secondary";
export function ClickableIconState(props) {

  const {
    description,
    state,
    onChange,
    iconTypes,
    isLoading
  } = props;

  const changeHandler = (event) => {
    const { target } = event;
    const { checked } = target;
    onChange(checked);
  }

  const descriptionEl = description ? <span className={"pr-1"}>{description}</span> : null

  let iconType;
  let color;
  switch (true) {
    case (isLoading): {
      color = 'lightgray';
      iconType = 'hourglass';
      break;
    }
    case (state === 0): {
      color = 'green';
      iconType = iconTypes[state];
      break;
    }
    case (state === 1): {
      color = 'red';
      iconType = iconTypes[state];
      break;
    }
    default: {
      color = 'lightgray';
      iconType = 'hourglass';
    }

  }
  return (
    <div className="btn-group btn-group-toggle mx-2">
      <label className={state ? activeStyles : inactiveStyles}>
        {descriptionEl}
        <input type="checkbox" name="viewType" onChange={changeHandler}/>
        <FontAwesomeIcon
          icon={iconType}
          color={color}
        />
      </label>
    </div>
  );
}


export default ClickableIconState;
