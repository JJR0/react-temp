import React from 'react'

const NavigationMenu = ({ handleWindow }) => {
  return (
    <div id='nav-menu'>
      <div onClick={() => handleWindow('etusivu')}>Etusivu</div>
      <div onClick={() => handleWindow('login')}>Kirjaudu</div>
      <div onClick={() => handleWindow('settings')}>Asetukset</div>
    </div>
  )
}

export default NavigationMenu