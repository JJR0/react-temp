import React, { Component } from 'react'
import moment from 'moment'
import temperatureService from './services/temperature'
import loginService from './services/login'
import 'moment/locale/fi'
import Tempdetails from './components/Tempdetails'
import Navigation from './components/Navigation'
import Tempview from './components/Tempview'
import Loginscreen from './components/Loginscreen'

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
      bedroom_details: false,
      livingroom_details: false,
      outside_details: false,
      chartheight: 400,
      chartwidth: 500,
      min_range: "19",
      max_range: "25",
      lastTimeUpdate: {'bedroom': '', 'livingroom': '', 'outside': ''},
      loginScreen: false,
      user: null,
      username: '',
      password: '',
      error: null,
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
        this.getLastTemp('livingroom')
        this.getLastTemp('outside')
      }, () => {
        this.calcRanges()
      })
    })

    temperatureService.getTempNow().then(data => {
      this.setState({ temperatureNow: data.toFixed(1) })
    })

    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      this.setState({ user })
    }
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

  showTooltip = (point) => "<div className='tooltip-div'>" + point.y + "&#8451<br/>klo " + point.x + "</div>"
  
  calcDayAverage = (location) => {
    const sum = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location).reduce((a, b) => parseFloat(a) + parseFloat(b.y), 0)
    const length = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location).length
    
    if (length === 0)
      return '-'
    else
      return parseFloat( sum / length ).toFixed(1)
  }

  calcMin = (location) => {
    const array_temp = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)

    if (array_temp.length === 0)
      return '-'

    const minimum = array_temp.reduce((min, temp) => parseFloat(temp.y) < min ? parseFloat(temp.y) : min, parseFloat(array_temp[0].y))

    if (minimum !== null)
      return parseFloat(minimum).toFixed(1)
    else
      return minimum
  }

  calcMax = (location) => {
    const array_temp = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)

    if (array_temp.length === 0)
      return '-'

    const maximum = array_temp.reduce((max, temp) => parseFloat(temp.y) > max ? parseFloat(temp.y) : max, parseFloat(array_temp[0].y))

    if (maximum !== null)
      return parseFloat(maximum).toFixed(1)
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

  getLastUpdateTime = (location) => {
    const array_temp = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)

    if (array_temp.length === 0)
      return
    
    const maximum = array_temp.reduce((max, temp) => temp.x > max ? temp.x : max, array_temp[0].x)
    return maximum
  }

  handleNavClick = (event, location) => {
    switch (location) {
      case 'bedroom':
        this.setState({
          bedroom_details: true,
          livingroom_details: false,
          outside_details: false,
          loginScreen: false,
          startDate: moment()
        })
        this.handleDateChange(moment())
        break;
      case 'livingroom':
        this.setState({
          bedroom_details: false,
          livingroom_details: true,
          outside_details: false,
          loginScreen: false,
          startDate: moment()
        })
        this.handleDateChange(moment())
        break;
      case 'outside':
        this.setState({
          bedroom_details: false,
          livingroom_details: false,
          outside_details: true,
          loginScreen: false,
          startDate: moment()
        })
        this.handleDateChange(moment())
        break;
      case 'frontpage':
        this.setState({
          bedroom_details: false,
          livingroom_details: false,
          outside_details: false,
          loginScreen: false,
          startDate: moment()
        })
        this.handleDateChange(moment())
        break;
      default:
        break;
    }
  }

  locationDetails = (location) => {
    return [this.state.dayAverage[location], this.state.min_temp[location], this.state.max_temp[location]]
  }

  getLastTemp = (location) => {
    const array = this.getTempOf(this.state.startDate.format('DDMMYYYY'), location)
    
    if (array === undefined) return '-'
    if (array.length === 0) return '-'
    if (array[array.length-1] === undefined) return '-'

    if (location === 'livingroom') {
      this.setState({ livingroomNow: array[array.length-1].y })
    } else if (location === 'outside') {
      this.setState({ outsideNow: array[array.length-1].y })
    }
  }

  calcRanges = () => {
    let step = 2

    // let bedroom_min = this.state.min_temp['bedroom']
    // let bedroom_max = this.state.max_temp['bedroom']
    // let livingroom_min = this.state.min_temp['livingroom']
    // let livingroom_max = this.state.max_temp['livingroom']
    let outside_min = this.state.min_temp['outside']
    console.log(outside_min)
    let outside_max = this.state.max_temp['outside']
    console.log(outside_max)

    if (this.state.outside_details && !this.state.bedroom_details && !this.state.livingroom_details && outside_min !== '-' && outside_max !== '-') {
      if ((outside_max - outside_min) + 2 < 6) {
        step = Math.round((6 - (outside_max - outside_min))/2)
      } else {
        step = 1
      }
      return { 'min_range': Math.floor(outside_min - step), 'max_range': Math.round(outside_max + step) }
     } else {
      return { 'min_range': 19,'max_range': 25}
    }
  }

  handleLoginClick = () => {
    this.setState({ loginScreen: true })
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  
  login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: this.state.username,
        password: this.state.password
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      this.setState({ username: '', password: '', user})
    } catch (exception) {
      this.setState({ error: 'unsuccess' })
      setTimeout(() => {
        this.setState({ error: null })
      }, 3000);
    }
  }

  logout = () => {
    window.localStorage.removeItem('loggedUser')
    this.setState({ user: null })
  }

  render() {
    const tempToShow = this.state.bedroom_details ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'bedroom') : []
    const livingroom_temps = this.state.livingroom_details ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'livingroom') : []
    const outside_temps = this.state.outside_details ? this.getTempOf(this.state.startDate.format('DDMMYYYY'), 'outside') : []

    if (!this.state.livingroom_details && !this.state.bedroom_details && !this.state.outside_details && !this.state.loginScreen) {
      return (
        <div className="App">
          <Navigation
            handleNavClick={this.handleNavClick}
            handleLoginClick={this.handleLoginClick}
            user={this.state.user} />

          <div id='main-temp' className='container'>
            <div className='row'>
              <Tempview
                tempNow={this.state.livingroomNow}
                handleNavClick={this.handleNavClick}
                getLastUpdateTime={this.getLastUpdateTime}
                locationDetails={this.locationDetails}
                location='livingroom'
                header='Olohuone'
                details={false} />
              <Tempview
                tempNow={this.state.temperatureNow}
                handleNavClick={this.handleNavClick}
                getLastUpdateTime={this.getLastUpdateTime}
                locationDetails={this.locationDetails}
                location='bedroom'
                header='Makuuhuone'
                details={false} />
              <Tempview
                tempNow={this.state.outsideNow}
                handleNavClick={this.handleNavClick}
                getLastUpdateTime={this.getLastUpdateTime}
                locationDetails={this.locationDetails}
                location='outside'
                header='Ulkoilma'
                details={false} />
            </div>
          </div>

          <div id='text-div'>
            <i>Näytä tarkemmat lämpötilatiedot klikkaamalla lämpötilaa.</i>
          </div>

        </div>
      )
    }

    if (this.state.bedroom_details) {
      return (
        <div className="App">
          <Navigation
            handleNavClick={this.handleNavClick}
            handleLoginClick={this.handleLoginClick}
            user={this.state.user} />

          <Tempview
            tempNow={this.state.temperatureNow}
            handleNavClick={this.handleNavClick}
            getLastUpdateTime={this.getLastUpdateTime}
            locationDetails={this.locationDetails}
            location='bedroom'
            header='Makuuhuone'
            details={true} />

          <Tempdetails
            startDate={this.state.startDate}
            handleDateChange={this.handleDateChange}
            tempToShow={tempToShow}
            showTooltip={this.showTooltip}
            header='Makuuhuone'
            min_range={this.calcRanges()['min_range']}
            max_range={this.calcRanges()['max_range']} />
        </div>
      )
    } else if (this.state.livingroom_details) {
      return (
        <div className="App">
          <Navigation
            handleNavClick={this.handleNavClick}
            handleLoginClick={this.handleLoginClick}
            user={this.state.user} />

          <Tempview
            tempNow={this.state.livingroomNow}
            handleNavClick={this.handleNavClick}
            getLastUpdateTime={this.getLastUpdateTime}
            locationDetails={this.locationDetails}
            location='livingroom'
            header='Olohuone'
            details={true} />

          <Tempdetails
            startDate={this.state.startDate}
            handleDateChange={this.handleDateChange}
            tempToShow={livingroom_temps}
            showTooltip={this.showTooltip}
            header='Olohuone'
            min_range={this.calcRanges()['min_range']}
            max_range={this.calcRanges()['max_range']} />
        </div>
      )
    } else if (this.state.outside_details) {
      return (
        <div className="App">
          <Navigation
            handleNavClick={this.handleNavClick}
            handleLoginClick={this.handleLoginClick}/>
  
          <Tempview
            tempNow={this.state.outsideNow}
            handleNavClick={this.handleNavClick}
            getLastUpdateTime={this.getLastUpdateTime}
            locationDetails={this.locationDetails}
            location='outside'
            header='Ulkoilma'
            details={true} />

          <Tempdetails
            startDate={this.state.startDate}
            handleDateChange={this.handleDateChange}
            tempToShow={outside_temps}
            showTooltip={this.showTooltip}
            header='Ulkoilma'
            min_range={this.calcRanges()['min_range']}
            max_range={this.calcRanges()['max_range']} />
        </div>
      )
    } else if (this.state.loginScreen) {

      return (
        <div className="App">
          <Navigation
            handleNavClick={this.handleNavClick}
            handleLoginClick={this.handleLoginClick}
            user={this.state.user} />

          <div id='login-wrapper'>
            <Loginscreen
              login={this.login}
              username={this.state.username}
              password={this.state.password}
              handleFieldChange={this.handleFieldChange}
              />
          </div>
        </div>
      )
    }
  }
}

export default App;
