import React from 'react'
import '../index.css'

const Tempview = ({ tempNow, handleNavClick, getLastUpdateTime, locationDetails, location, header, details }) => {
  if (details) {
    return (
      <div className='temp-view-details'>
        <h4>{header}</h4>
        <span className='temp-details'>Korkein: {locationDetails(location)[2]} &#8451; <br/></span>
        <span className='temp-details'>Keskiarvo: {locationDetails(location)[0]} &#8451; <br/></span>
        <span className='temp-details'>Matalin: {locationDetails(location)[1]} &#8451; <br/></span>
      </div>
    )
  } else {
    return (
      <div className='col-md-4 temp-div' onClick={(e) => handleNavClick(e, location)}>
        <h4>{header}</h4>
        <span className='temp-now'>{tempNow} &#8451; <br/></span>
        <span className='details'>Tänään: klo {getLastUpdateTime(location)} <br/></span>
        <span className='details'>Korkein: {locationDetails(location)[2]} &#8451; <br/></span>
        <span className='details'>Keskiarvo: {locationDetails(location)[0]} &#8451; <br/></span>
        <span className='details'>Matalin: {locationDetails(location)[1]} &#8451; <br/></span>
      </div>
    )
  }
}

export default Tempview