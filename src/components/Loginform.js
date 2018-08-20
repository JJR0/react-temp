import React from 'react'

const Loginform = ({ login, handleFieldChange, username, password }) => {
  return(
    <div>
      <form onSubmit={login}>
        <div id='login-grid'>
          Käyttäjätunnus:
          <input
            type='text'
            name='username'
            onChange={(event) => handleFieldChange(event)}
            value={username}
            autoComplete='off'
            />
          Salasana:
          <input
            type='password'
            name='password'
            onChange={(event) => handleFieldChange(event)}
            value={password}
            autoComplete='off'
            />
        </div>
        <button id='login-button' type='submit'>Kirjaudu</button>
      </form>
    </div>
  )
}

export default Loginform