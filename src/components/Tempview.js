import React from 'react'
import '../index.css'

const Tempview = ({ tempNow, handleNavClick, getLastUpdateTime, locationDetails, location, header, details }) => {
  let classUpperDiv = ''
  let classDiv = ''
  let classDetails = ''

  if (details) {
    classUpperDiv = 'temp-view-details'
    classDiv = 'temp-now-details'
    classDetails = 'temp-details'
  } else {
    classUpperDiv = 'col-md-4 temp-div'
    classDiv = 'temp-now'
    classDetails = 'details'
  }

  return (
    <div className={classUpperDiv} onClick={(e) => handleNavClick(e, location)}>
      <h4>{header}</h4>
      { details ? null : <span className={classDiv}>{tempNow} &#8451; <br/></span> }
      { details ? null : <span className={classDetails}>Tänään: {getLastUpdateTime(location)} <br/></span> }
      <span className={classDetails}>Keskiarvo: {locationDetails(location)[0]} &#8451; <br/></span>
      <span className={classDetails}>Matalin: {locationDetails(location)[1]} &#8451; <br/></span>
      <span className={classDetails}>Korkein: {locationDetails(location)[2]} &#8451; <br/></span>
    </div>
  )
}

export default Tempview