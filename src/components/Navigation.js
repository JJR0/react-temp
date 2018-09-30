import React from 'react'
import '../index.css'

const Navigation = ({ handleNavClick, handleLoginClick, user }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <span className="navbar-brand" onClick={(e) => handleNavClick(e, 'frontpage')}>Lämpötilaseuranta</span>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbar">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'livingroom')}>Olohuone</span>
          </li>
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'bedroom')}>Makuuhuone</span>
          </li>
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'outside')}>Ulkoilma</span>
          </li>
        </ul>
        {/* { user ?
          <div>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link'>Asetukset</span>
              </li>
            </ul>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link'>Kirjaudu ulos</span>
              </li>
            </ul>
          </div>
        :
          <div>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link' onClick={(e) => handleLoginClick(e)}>Kirjaudu</span>
              </li>
            </ul>
          </div> } */}
      </div>
    </nav>
  </div>
  )
}

export default Navigation