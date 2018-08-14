import React, { Component } from 'react';
import axios from 'axios'
import './index.css'

class App extends Component {
  constructor(props) {
    super(props) {
      this.state = {
        lampotila: null
      }
    }
  }

  render() {
    return (
      <div className="App">
        <h2>Lämpötila</h2>
        
      </div>
    );
  }
}

export default App;
