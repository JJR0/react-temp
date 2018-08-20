import React from 'react'

const NavigationMenu = ({ handleWindow, user }) => {
  return (
    <div id='nav-menu'>
      <div onClick={() => handleWindow('etusivu')}>Etusivu</div>
      <div onClick={() => handleWindow('login')}>Kirjaudu</div>
        {user ? <div onClick={() => handleWindow('settings')}>Asetukset</div> : null}
    </div>
  )
}

export default NavigationMenu