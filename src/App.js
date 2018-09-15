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
      temperatureNow: 0,
      livingroomNow: 0,
      outsideNow: 0,
      dayAverage: {'bedroom': 0, 'livingroom': 0, 'outside': 0},
      min_temp: {'bedroom': 0, 'livingroom': 0, 'outside': 0},
      max_temp: {'bedroom': 0, 'livingroom': 0, 'outside': 0},
      data_found: true,
      livingroom: false,
      bedroom: true,
      outside: false,
      bedroom_details: true,
      livingroom_details: false,
      outside_details: false,
    }
  }
  
  componentDidMount() {
    temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
      this.setState({
        data: data,
      }, () => {
        this.setState({
          dayAverage: { 'bedroom': this.calcDayAverage('bedroom'), 'livingroom': this.calcDayAverage('livingroom'), 'outside': this.calcDayAverage('outside')},
          min_temp: { 'bedroom': this.calcMin('bedroom'), 'livingroom': this.calcMin('livingroom'), 'outside': this.calcMin('outside')},
          max_temp: { 'bedroom': this.calcMax('bedroom'), 'livingroom': this.calcMax('livingroom'), 'outside': this.calcMax('outside')},
        })
      })
    })

    temperatureService.getTempNow().then(data => {
      this.setState({ temperatureNow: data.toFixed(1) })
    })
  }
  
  handleDateChange = (date) => {
    this.setState({
      startDate: date
    }, () => {
      temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
        this.setState({
          data: data
        }, () => {
          this.setState({ 
            dayAverage: { 'bedroom': this.calcDayAverage('bedroom'), 'livingroom': this.calcDayAverage('livingroom'), 'outside': this.calcDayAverage('outside')},
            min_temp: { 'bedroom': this.calcMin('bedroom'), 'livingroom': this.calcMin('livingroom'), 'outside': this.calcMin('outside')},
            max_temp: { 'bedroom': this.calcMax('bedroom'), 'livingroom': this.calcMax('livingroom'), 'outside': this.calcMax('outside')},
            data_found: true
          })
        })
      }).catch(error => {
        this.setState({
          data: [],
          dayAverage: { 'bedroom': '-', 'livingroom': '-', 'outside': '-'},
          min_temp: { 'bedroom': '-', 'livingroom': '-', 'outside': '-'},
          max_temp: { 'bedroom': '-', 'livingroom': '-', 'outside': '-'},
          data_found: false
        })
      })
    })
  }
  
  showTooltip = (point) => "<div className='tooltip-div'>" + point.y.toFixed(1) + "&#8451<br/>klo " + point.x + "</div>"
  
  calcDayAverage = (location) => {
    const sum = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location).reduce((a, b) => a + b.y, 0)
    const length = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location).length
    return ( sum / length ).toFixed(1)
  }

  calcMin = (location) => {
    const array_temp = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)

    if (array_temp.length === 0)
      return 0

    const minimum = array_temp.reduce((min, temp) => temp.y < min ? temp.y : min, array_temp[0].y)

    if (minimum !== null)
      return minimum.toFixed(1)
    else
      return minimum
  }

  calcMax = (location) => {
    const array_temp = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)

    if (array_temp.length === 0)
      return 0

    const maximum = array_temp.reduce((max, temp) => temp.y > max ? temp.y : max, array_temp[0].y)

    if (maximum !== null)
      return maximum.toFixed(1)
    else
      return maximum
  }
  
  getTempOf = (date, location) => {
    if (this.state.data[0] === [] || typeof this.state.data[0] === 'undefined') return []

    const date_obj = this.state.data.find(e => e.date === date)
    
    if (typeof date_obj !== 'undefined') {
      if (location === 'bedroom')
        return date_obj.temperatures
      else if (location === 'livingroom')
        return date_obj.livingroom_temp
      else if (location === 'outside')
        return date_obj.outside_temp
    } else
      return []
  }

  handleCheckboxChange = (event) => {
    this.setState({ [event.target.name]: event.target.checked })
  }

  handleNavClick = (event, location) => {
    switch (location) {
      case 'bedroom':
        this.setState({
          bedroom_details: true,
          livingroom_details: false,
          outside_details: false,
        })
        break;
      case 'livingroom':
        this.setState({
          bedroom_details: false,
          livingroom_details: true,
          outside_details: false,
        })
        break;
      case 'outside':
        this.setState({
          bedroom_details: false,
          livingroom_details: false,
          outside_details: true,
        })
        break;
      default:
        break;
    }
  }

  locationDetails = () => {
    if (this.state.bedroom_details)
      return [this.state.dayAverage['bedroom'], this.state.min_temp['bedroom'], this.state.max_temp['bedroom']]
    else if (this.state.livingroom_details)
      return [this.state.dayAverage['livingroom'], this.state.min_temp['livingroom'], this.state.max_temp['livingroom']]
    else if (this.state.outside_details)
      return [this.state.dayAverage['outside'], this.state.min_temp['outside'], this.state.max_temp['outside']]
  }

  render() {
    const tempToShow = this.state.bedroom ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'bedroom') : []
    const livingroom_temps = this.state.livingroom ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'livingroom') : []
    const outside_temps = this.state.outside ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'outside') : []


    return (
      <div className="App">
        <nav className="navbar navbar-expand-md navbar-dark fixed-top">
          <span className="navbar-brand">Lämpötilaseuranta</span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active"  onClick={(e) => this.handleNavClick(e, 'livingroom')}>
                <span className="nav-link">Olohuone: <span id='temp-now'>{this.state.livingroomNow} &#8451;</span></span>
              </li>
              <li className="nav-item active"  onClick={(e) => this.handleNavClick(e, 'bedroom')}>
                <span className="nav-link">Makuuhuone: <span id='temp-now'>{this.state.temperatureNow} &#8451;</span></span>
              </li>
              <li className="nav-item active"  onClick={(e) => this.handleNavClick(e, 'outside')}>
                <span className="nav-link">Ulkolämpötila: <span id='temp-now'>{this.state.outsideNow} &#8451;</span></span>
              </li>
            </ul>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item active'>
                <span className='nav-link details'>Keskiarvo: <span>{this.locationDetails()[0]} &#8451;</span></span>
              </li>
              <li className='nav-item active'>
                <span className='nav-link details'>Matalin: <span>{this.locationDetails()[1]} &#8451;</span></span>
              </li>
              <li className='nav-item active'>
                <span className='nav-link details'>Korkein: <span>{this.locationDetails()[2]} &#8451;</span></span>
              </li>
            </ul>
          </div>
        </nav>
        <div className='main'>
          <div id='day-selector'>
            <div id='date-header'>Minkä päivän lämpötilatiedot haluat nähdä?</div>
            <DatePicker
              inline
              className='datepicker'
              selected={this.state.startDate}
              onChange={this.handleDateChange}
              dateFormat="DD.MM.YYYY"
              locale="fi" />
          </div>
          <div id='line-chart'>
            <LineChart
              className='linechart'
              width={500}
              height={400}
              data={[ { name: 'Makuuhuone', color: 'steelblue', points: tempToShow}, { name: 'Olohuone', color: 'navy', points: livingroom_temps}, { name: 'Ulko', color: 'green', points: outside_temps} ]}
              xMin="0"
              xMax="24"
              yMin="21"
              yMax="27"
              xLabel="Kellonaika"
              yLabel="Lämpötila (&#8451;)"
              pointRadius="1"
              onPointHover={(point) => this.showTooltip(point)}
              ticks="12"
              showLegends="true" />
          </div>
          <div id='checkboxes'>
            <input
            name='livingroom'
            type='checkbox'
            checked={this.state.livingroom}
            onChange={this.handleCheckboxChange} />
            <label>Olohuone</label>
            <input
              name='bedroom'
              type='checkbox'
              checked={this.state.bedroom}
              onChange={this.handleCheckboxChange} />
            <label>Makuuhuone</label>
            <input
              name='outside'
              type='checkbox'
              checked={this.state.outside}
              onChange={this.handleCheckboxChange} />
            <label>Ulkolämpötila</label>
          </div>
        </div>
      </div>
    )
  }
}

export default App;