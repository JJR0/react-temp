import React from 'react'
import DatePicker from 'react-datepicker'
import LineChart from 'react-linechart'
import '../../node_modules/react-linechart/dist/styles.css'
import '../../node_modules/react-datepicker/dist/react-datepicker.css'
import '../index.css'

const Tempdetails = ({ startDate, handleDateChange, tempToShow, showTooltip, header, min_range, max_range }) => {

  const isMobile = window.innerWidth <= 500
  console.log(isMobile)

  return (
    <div id='temp-details'>

      { !isMobile ? 
        <div id='day-selector'>
          <div id='date-header'>Minkä päivän lämpötilatiedot haluat nähdä?</div>
          <DatePicker
            className='datepicker'
            selected={startDate}
            onChange={handleDateChange}
            dateFormat="DD.MM.YYYY"
            locale="fi" />
        </div>
        :
        <div id='day-selector'>
          <div id='date-header'>Minkä päivän lämpötilatiedot haluat nähdä?</div>
          <input type='date' value={startDate} onChange={handleDateChange} />
        </div>
      }
      <div id='line-chart'>
        <LineChart
          className='linechart'
          width="400"
          height="400"
          data={[ { color: 'black', points: tempToShow} ]}
          xMin="0"
          xMax="24"
          yMin={min_range}
          yMax={max_range}
          xLabel="Kellonaika"
          yLabel="Lämpötila (&#8451;)"
          pointRadius="1"
          onPointHover={(point) => showTooltip(point)}
          ticks="12" />
      </div>
    </div>
  )
}

export default Tempdetails