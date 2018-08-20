import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import LineChart from 'react-linechart'
import HamburgerMenu from 'react-hamburger-menu'
import temperatureService from './services/temperature'
import loginService from './services/login'
import '../node_modules/react-linechart/dist/styles.css'
import '../node_modules/react-datepicker/dist/react-datepicker.css'
import './index.css'
import Loginform from './components/Loginform';
import NavigationMenu from './components/Navigation';

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
      password: '',
      user: null,
      updateFreq: null
    }
  }
  
  componentDidMount() {
    temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
      this.setState({
        data: data,
        lastHour: moment().hours() + '.00',
      }, () => {
        const todayTemps = this.getTempOf(moment().format('DDMMYYYY'))
        const lastTemp = todayTemps[todayTemps.length-1]
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
    }, () => {
      temperatureService.getTempDate(this.state.startDate.format('DDMMYYYY')).then(data => {
        this.setState({
          data: data
        })
      })
    })
  }
  
  // Describes the html element, which is shown when hovered over data point in chart.
  showTooltip = (point) => "<div className='tooltip-div'>" + point.y + " &#8451</div>"
  
  // Calculates average temperature of the day according to data, which 
  // has been gathered up to that point of the day.
  calcDayAverage = () => (this.getTempOf(moment().format('DDMMYYYY')).reduce((a, b) => a + b.y, 0) / moment().hours()).toFixed(1)
  
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
  
  // Handles which window is shown, when link has been clicked in navigation bar.
  handleWindow = (window) => {
    switch(window) {
      case 'etusivu':
        this.setState({ showHome: true, showLogin: false, showSettings: false })
        return
      case 'login':
        this.setState({ showHome: false, showLogin: true, showSettings: false })
        return
      default:
        return
    }
  }
  
  handleFieldChange = (e) => this.setState({ [e.target.name]: e.target.value })
  
  login = async (event) => {
    event.preventDefault()
    try{
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })
  
      this.setState({ username: '', password: '', user})
    } catch(exception) {
      this.setState({
        error: 'käyttäjätunnus tai salasana virheellinen',
      })
      setTimeout(() => {
        this.setState({ error: null })
      }, 5000)
    }
  }

  homeScreen = () => {
    const tempToShow = this.getTempOf(this.state.startDate.format('DDMMYYYY'))
    
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
        <Loginform
          login={this.login}
          handleFieldChange={this.handleFieldChange}
          username={this.state.username}
          password={this.state.password}
        />
      </div>
    )
  }
  
  settingsScreen = () => {
    return (
      <div id='settings-div'>
        <h3>Asetukset</h3>

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

          {this.state.active ? <NavigationMenu handleWindow={this.handleWindow} /> : null}
        </div>
        
        {this.state.showHome ? this.homeScreen() : null }
        
        {this.state.showLogin ? this.loginScreen() : null }
        
        {this.state.user ? this.settingsScreen() : null }
      </div>
    )
  }
}

export default App;