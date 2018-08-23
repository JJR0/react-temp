import React from 'react'

const NavigationMenu = ({ handleWindow, user, logout }) => {
  return (
    <div id='nav-menu'>
      <ul>
        <li><button onClick={() => handleWindow('etusivu')}>Etusivu</button></li>
        { !user ? <li><button onClick={() => handleWindow('login')}>Kirjaudu</button></li> : null }
        { user ? <li><button onClick={() => handleWindow('settings')}>Asetukset</button></li> : null }
        { user ? <li><button onClick={logout}>Kirjaudu ulos</button></li> : null }
      </ul>
    </div>
  )
}

export default NavigationMenu