import { Button } from 'react-bootstrap'
import React from 'react'
import TimeFilterRange from './TimeFilterRange'
import TimeFilterRelative from './TimeFilterRelative'


export default function TimeFilterContainer (props) {
  const { isRelativeDate } = props;
  return(

    <div className="col-md-auto">
      <div className="form-row">
        <div className="col-md-auto">
        <Button
          variant="outline-primary"
          onClick={props.switchFilterType}>
          {isRelativeDate ? 'Relative' : 'Range'}
        </Button>
      </div>
        {isRelativeDate ? <TimeFilterRelative {...props} /> : <TimeFilterRange {...props} />}
      </div>
    </div>

  )
}
