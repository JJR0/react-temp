import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import LineChart from 'react-linechart'
import HamburgerMenu from 'react-hamburger-menu'
import temperatureService from './services/temperature'
import '../node_modules/react-linechart/dist/styles.css'
import '../node_modules/react-datepicker/dist/react-datepicker.css'
import './index.css'

moment.locale('fi')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(),
      data: [],
      lastHour: 0,
      lastHourData: 0,
      dayAverage: 0,
      temperatureNow: 0,
      active: false,
      showHome: true,
      showLogin: false,
      showSettings: false,
      username: '',
      password: ''
    }
  }
  
  componentDidMount() {
    temperatureService.getTempDate(this.formatDate(this.state.startDate)).then(data => {
      this.setState({
        data: data,
        lastHour: moment().hours() + '.00',
      }, () => {
        const temps = this.getTemperatureOf(moment())
        const lastTemp = temps[temps.length-1]
        this.setState({ 
          dayAverage: this.calcDayAverage(),
          lastHourData: 0//lastTemp.y
        })
      })
    })

    temperatureService.getTempNow().then(data => {
      this.setState({ temperatureNow: data })
    })
  }
  
  // Set state when date is change in datepicker
  handleDateChange = (date) => {
    this.setState({
      startDate: date
    })
  }
  
  // formats moments.js object date to locale 'fi' date 
  formatDate = (date) => {
    const date1 = date.date().toString()
    const month = (date.month()+1).toString()
    const year = date.year().toString()
    if (date.month()+1 < 10) {
      return date1 + "0" + month + year
    } else {
      return date1 + month + year
    }
  }
  
  // Describes the html element, which is shown when hovered over data point in chart.
  showTooltip = (point) => "<div className='tooltip-div'>" + point.y + " &#8451</div>"
  
  // Calculates average temperature of the day according to data, which 
  // has been gathered up to that point of the day.
  calcDayAverage = () => {
    const temps = this.getTemperatureOf(moment())
    const sum_temp = temps.reduce((a, b) => a + b.y, 0)
    
    //return sum_temp / moment().hours()
    return Number(sum_temp / 5).toFixed(1)
  }
  
  // Returns list of temperatures of the date (moment.js object)
  // If there are no temperature date on the date, empty array is returned
  getTemperatureOf = (date) => {
    if (this.state.data[0] === [] || typeof this.state.data[0] === 'undefined')
      return []

    const date_obj = this.state.data.find(e => e.date === this.formatDate(date))
    console.log('date_obj: ', date_obj)
    if (typeof date_obj !== 'undefined')
      return date_obj.temperatures
    else return []
  }
  
  // Handles which window is shown, when link has been clicked in navigation bar.
  handleWindow = (window) => {
    switch(window) {
      case 'etusivu':
        this.setState({ showHome: true, showLogin: false, showSettings: false })
        return
      case 'login':
        this.setState({ showHome: false, showLogin: true, showSettings: false })
        return
      case 'settings':
        this.setState({ showHome: false, showLogin: false, showSettings: true })
        return
      default:
        return
    }
  }
  
  handleFieldChange = (e) => this.setState({ [e.target.name]: e.target.value })
  
  login = (event) => {
    event.preventDefault()
    console.log('kirjauduttu!')
  }
  
  navigationMenu = () => {
    return (
      <div id='nav-menu'>
        <div onClick={() => this.handleWindow('etusivu')}>Etusivu</div>
        <div onClick={() => this.handleWindow('login')}>Kirjaudu</div>
        <div onClick={() => this.handleWindow('settings')}>Asetukset</div>
      </div>
    )
  }

  homeScreen = () => {
    const tempToShow = this.getTemperatureOf(this.state.startDate)
    
    return (
      <div id='content'>
        <h2>Lämpötilaseuranta</h2>
        <div id='temp-now-div'>
          Lämpötila nyt: {this.state.temperatureNow} &#8451;
        </div>
        <p/>
        <div id='last-data-div'>
          <div className='info-item'>Viimeisin lämpötila:</div>
          <div className='info-item'>Päivän keskiarvo:</div>
          <div className='info-item'>Tiedot päivittynyt:</div>
          <div className='info-item'>{this.state.lastHourData} &#8451; </div>
          <div className='info-item'>{this.state.dayAverage} &#8451;</div>
          <div className='info-item'>klo: {this.state.lastHour}</div>
        </div>
        <p/>
        <div id='day-selector'>
          Minkä päivän lämpötilatiedot haluat nähdä?
          <br/>
          <DatePicker
            className='datepicker'
            selected={this.state.startDate}
            onChange={this.handleDateChange}
            dateFormat="DD.MM.YYYY"
          />
        </div>
        <div id='line-chart'>
          <h4>Lämpötila tunti tunnilta</h4>
          <LineChart
            className='linechart'
            width={500}
            height={500}
            data={[ {color: 'steelblue', points: tempToShow} ]}
            xMin="0"
            xMax="24"
            yMin="18"
            yMax="28"
            xLabel="Tunnit"
            yLabel="Lämpötila (&#8451;)"
            pointRadius="2"
            onPointHover={(point) => this.showTooltip(point)}
            ticks="24"
          />
        </div>
      </div>
    )
  }
  
  loginScreen = () => {
    return (
      <div id='login-div'>
        <h3>Kirjautuminen</h3>
        <form onSubmit={this.login}>
          <div id='login-grid'>
            <label id='username-label'>Käyttäjätunnus:</label>
            <input
              type='text'
              name='username'
              onChange={(event) => this.handleFieldChange(event)}
              value={this.state.username}
              autoComplete='off'
              />
            <label id='password-label'>Salasana:</label>
            <input
              type='password'
              name='password'
              onChange={(event) => this.handleFieldChange(event)}
              value={this.state.password}
              autoComplete='off'
              />
          </div>
          <button id='login-button' type='submit'>Kirjaudu</button>
        </form>
      </div>
    )
  }
  
  settingsScreen = () => {
    return (
      <div id='settings-div'>
        <h3>Asetukset</h3>
        <div id='settings-grid'>
          
        </div>
      </div>
    )
  }
  
  render() {
    return (
      <div className="App">
        <div id='nav-bar'>
          <HamburgerMenu
            id='hamburger-menu'
            isOpen={this.state.active}
            menuClicked={() => this.setState({ active: !this.state.active })}
            width={24}
            height={18}
            strokeWidth={2}
            rotate={0}
            color='black'
            borderRadius={0}
            animationDuration={0.5}
            />

          {this.state.active ? this.navigationMenu() : null}
        </div>
        
        {this.state.showHome ? this.homeScreen() : null }
        
        {this.state.showLogin ? this.loginScreen() : null }
        
        {this.state.showSettings ? this.settingsScreen() : null }
      </div>
    )
  }
}

export default App;