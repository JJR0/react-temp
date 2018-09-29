import React from 'react'

const Loginscreen = ({ login, username, password, handleFieldChange }) => {
  return (
    <div>
      <h3>Kirjaudu sisään</h3>
      <form id='login-form' onSubmit={login}>
        <div>
          <span className='login-label'>Käyttäjänimi:</span>
          <br/>
          <input
            type='text'
            name='username'
            value={username}
            onChange={handleFieldChange}
          />
        </div>
        <div>
          <span className='login-label'>Salasana:</span>
          <br/>
          <input
            type='password'
            name='password'
            value={password}
            onChange={handleFieldChange}
          />
        </div>
        <button id='login-button' type='submit'>Kirjaudu</button>
      </form>
    </div>
  )
}

export default Loginscreen