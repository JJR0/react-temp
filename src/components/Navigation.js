import React from 'react'

const NavigationMenu = ({ handleWindow, user, logout, name }) => {
  return (
    <div id={name}>
      <ul>
        <li><span onClick={() => handleWindow('etusivu')}>Etusivu</span></li>
        { !user ? <li><span onClick={() => handleWindow('settings')}>Asetukset</span></li> : null }
        { !user ? <li><span onClick={() => handleWindow('login')}>Kirjaudu</span></li> : null }
        { user ? <li><span onClick={logout}>Kirjaudu ulos</span></li> : null }
      </ul>
    </div>
  )
}

export default NavigationMenu