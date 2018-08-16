import React, { Component } from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import LineChart from 'react-linechart'
import '../node_modules/react-linechart/dist/styles.css'
import '../node_modules/react-datepicker/dist/react-datepicker.css'
import './index.css'
import temperatureService from './services/temperature'

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
      temperatureNow: 0
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
          lastHourData: lastTemp.y
        })
      })
    })

    temperatureService.getTempNow().then(data => {
      this.setState({ temperatureNow: data })
    })
  }
  
  handleChange = (date) => {
    this.setState({
      startDate: date
    })
  }
  
  // s moments.js object date to locale 'fi' date 
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
  
  showTooltip = (point) => "<div className='tooltip-div'>" + point.y + " &#8451</div>"
  
  calcDayAverage = () => {
    const temps = this.getTemperatureOf(moment())
    const sum_temp = temps.reduce((a, b) => a + b.y, 0)
    
    //return sum_temp / moment().hours()
    return Number(sum_temp / 5).toFixed(1)
  }
  
  // Returns list of temperatures of the date (moment.js object)
  // If there are no temperature date on the date, empty array is returned
  getTemperatureOf = (date) => {
    const date_obj = this.state.data.find(e => e.date === this.formatDate(date))
    if (typeof date_obj !== 'undefined')
      return date_obj.temperatures
    else return []
  }

  render() {
    const tempToShow = this.getTemperatureOf(this.state.startDate)

    return (
      <div className="App">
        <h2>Lämpötilaseuranta</h2>
        <div id='temp-now-div'>
          Lämpötila nyt: {this.state.temperatureNow} &#8451;
        </div>
        <p/>
        <div id='last-data-div'>
          <div>Viimeisin lämpötila:</div>
          <div>Päivän keskiarvo:</div>
          <div>Tiedot päivittynyt viimeksi:</div>
          <div>{this.state.lastHourData} &#8451; </div>
          <div>{this.state.dayAverage} &#8451;</div>
          <div>{this.state.lastHour}</div>
        </div>
        <p/>
        <div id='day-selector'>
          Minkä päivän lämpötilatiedot haluat nähdä?
          <p/>
          <DatePicker
            className='datepicker'
            selected={this.state.startDate}
            onChange={this.handleChange}
            date="DDMMYYYY"
          />
        </div>
        <div id='line-chart'>
          <LineChart
            width={600}
            height={600}
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
}

export default App;