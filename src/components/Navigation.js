import React from 'react'
import '../index.css'

const Navigation = ({ handleNavClick, handleLoginClick, user }) => {
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <span className="navbar-brand" onClick={(e) => handleNavClick(e, 'frontpage')}>Lämpötilaseuranta</span>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-main" aria-controls="nav-main" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="nav-main">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'livingroom')} data-toggle="collapse" data-target=".navbar-collapse.show">Olohuone</span>
          </li>
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'bedroom')} data-toggle="collapse" data-target=".navbar-collapse.show">Makuuhuone</span>
          </li>
          <li className="nav-item active">
            <span className="nav-link" onClick={(e) => handleNavClick(e, 'outside')}  data-toggle="collapse" data-target=".navbar-collapse.show">Ulkoilma</span>
          </li>
        </ul>
        {/* { user ?
          <div>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link' data-toggle="collapse" data-target=".navbar-collapse.show">Asetukset</span>
              </li>
            </ul>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link' data-toggle="collapse" data-target=".navbar-collapse.show">Kirjaudu ulos</span>
              </li>
            </ul>
          </div>
        :
          <div>
            <ul className="nav navbar-nav ml-auto justify-content-end">
              <li className='nav-item'>
                <span className='nav-link' onClick={(e) => handleLoginClick(e)} data-toggle="collapse" data-target=".navbar-collapse.show">Kirjaudu</span>
              </li>
            </ul>
          </div> } */}
      </div>
    </nav>
  </div>
  )
}

export default Navigation