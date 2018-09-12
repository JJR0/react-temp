import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import LineChart from 'react-linechart'
import temperatureService from './services/temperature'
import '../node_modules/react-linechart/dist/styles.css'
import '../node_modules/react-datepicker/dist/react-datepicker.css'
import './index.css'
import 'moment/locale/fi'

moment.locale('fi')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(),
      data: [],
      lastHour: 0,
      lastHourData: 0,
      tempCount: 0,
      dayAverage: 0,
      temperatureNow: 0,
      active: false,
      min_temp: 0,
      max_temp: 0,
      average_temp: 0,
    }
  }
  
  componentDidMount() {
    temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
      this.setState({
        data: data,
      }, () => {
        const todayTemps = this.getTempOf(moment().format('DDMMYYYY'))
        this.setState({ 
          tempCount: todayTemps.length
        }, () => {
          this.setState({ dayAverage: this.calcDayAverage() })
          this.setState({ min_temp: this.calcMin() })
          this.setState({ max_temp: this.calcMax() })
        })
      })
    })

    temperatureService.getTempNow().then(data => {
      this.setState({ temperatureNow: data.toFixed(1) })
    })
  }
  
  // Set state when date is change in datepicker
  handleDateChange = (date) => {
    this.setState({
      startDate: date
    }, () => {
      temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
        this.setState({
          data: data
        })
      })
    })
  }
  
  // Describes the html element, which is shown when hovered over data point in chart.
  showTooltip = (point) => "<div className='tooltip-div'>" + point.y + "&#8451<br/>klo " + point.x + "</div>"
  
  // Calculates average temperature of the day according to data, which 
  // has been gathered up to that point of the day.
  calcDayAverage = () => {
    const sum = this.getTempOf(moment().format('DDMMYYYY')).reduce((a, b) => a + b.y, 0)
    return ( sum / this.state.tempCount).toFixed(1)
  }

  calcMin = () => {
    const array_temp = this.getTempOf(moment().format('DDMMYYYY'))
    return array_temp.reduce((min, temp) => temp.y < min ? temp.y : min, array_temp[0].y).toFixed(1)
  }

  calcMax = () => {
    const array_temp = this.getTempOf(moment().format('DDMMYYYY'))
    return array_temp.reduce((max, temp) => temp.y > max ? temp.y : max, array_temp[0].y).toFixed(1)
  }
  
  // Returns list of temperatures of the date (moment.js object)
  // If there are no temperature date on the date, empty array is returned
  getTempOf = (date) => {
    if (this.state.data[0] === [] || typeof this.state.data[0] === 'undefined') return []

    const date_obj = this.state.data.find(e => e.date === date)
    
    if (typeof date_obj !== 'undefined')
      return date_obj.temperatures
    else
      return []
  }

  homeScreen = () => {
    const tempToShow = this.getTempOf(this.state.startDate.format('DDMMYYYY'))

    return [
        <div id='day-selector'>
          <div id='date-header'>Minkä päivän lämpötilatiedot haluat nähdä?</div>
          <DatePicker
            inline
            className='datepicker'
            selected={this.state.startDate}
            onChange={this.handleDateChange}
            dateFormat="DD.MM.YYYY"
            locale="fi"
          />
        </div>,
        <div id='line-chart'>
          <LineChart
            className='linechart'
            width={500}
            height={400}
            data={[ {color: 'steelblue', points: tempToShow} ]}
            xMin="0"
            xMax="24"
            yMin="21"
            yMax="27"
            xLabel="Kellonaika"
            yLabel="Lämpötila (&#8451;)"
            pointRadius="1"
            onPointHover={(point) => this.showTooltip(point)}
            ticks="12"
          />
        </div>,
        <div id='last-data-div'>
          <div className='info-item'>Päivän keskiarvo:</div>
          <div className='info-item'>Matalin lämpötila:</div>
          <div className='info-item'>Korkein lämpötila:</div>
          <div className='info-item'>{this.state.dayAverage} &#8451;</div>
          <div className='info-item'>{this.state.min_temp} &#8451;</div>
          <div className='info-item'>{this.state.max_temp} &#8451;</div>
        </div>,
      ]
  }
  
  render() {
    return (
      <div className="App">
        <div className='header'>
          <h2>Lämpötilaseuranta</h2>
          <div id='temp-now-div'>
            Lämpötila nyt: <span id='temp-now'>{this.state.temperatureNow} &#8451;</span>
          </div>
        </div>
        <div className='main'>
          {this.homeScreen()}
        </div>
      </div>
    )
  }
}

export default App;