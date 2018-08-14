import React, { Component } from 'react';
import tempService from './services/temperature'
import './index.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lampotila: null
    }
  }

  componentDidMount() {
    tempService.getTemp().then(lampotila =>
      this.setState({ lampotila })
    )
  }

  render() {
    return (
      <div className="App">
        <h2>Lämpötila</h2>
        {this.state.lampotila}
      </div>
    );
  }
}

export default App;