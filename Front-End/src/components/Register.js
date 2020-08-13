import React, { useState } from 'react'
import axios from 'axios'


const Register = (props) => {

  const [formData, updateFormData] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  function handleChange(event) {
    const name = event.target.name
    const data = {
      ...formData,
      [name]: event.target.value
    }
    updateFormData(data)
  }

  function handleSubmit(event) {
    event.preventDefault()

    axios.post('/api/register', formData)
      .then(() => {
        props.history.push('/login')
      })
  }

  return <form className="register-form" onSubmit={handleSubmit}>
    <label className="username-label">Username</label>
    <input
      name="username"
      onChange={handleChange}
      className="form-input"
      type="text"
      placeholder="nicolascage"
      value={formData.username}
    />
    <label className="email-label">Email</label>
    <input
      name="email"
      className="form-input"
      onChange={handleChange}
      type="text"
      placeholder="ncage@thescore.com"
      value={formData.email}
    />

    <label className="password-label">Password</label>
    <input
      name="password"
      className="form-input"
      onChange={handleChange}
      type="password"
      placeholder="********"
      value={formData.password}
    />

    <label className="confirmpassword-label">Confirm password</label>
    <input
      name="passwordConfirmation"
      className="form-input"
      onChange={handleChange}
      type="password"
      placeholder="********"
      value={formData.passwordConfirmation}
    />
    <div className="button-container">
      <button className="register-button">Register</button>
    </div>
  </form>


}

export default Register