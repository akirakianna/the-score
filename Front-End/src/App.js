import React, { useState, useEffect } from 'react'
import { Switch, Route, HashRouter } from 'react-router-dom'
import { UserContext, SpotifyContext } from './UserContext'
import Auth, { isLoggedIn } from './lib/auth'

import NavBar from './components/NavBar'
import HomePage from './components/HomePage'
import Favourites from './components/Favourites'
import WomenMovies from './components/WomenMovies'
import Reviews from './components/Reviews'
import Login from './components/Login'
import Register from './components/Register'
import SingleMovie from './components/SingleMovie'
import Latest from './components/Latest'
import Footer from './components/Footer'

import axios from 'axios'
import './styles/style.scss'

const queryString = require('query-string')

const App = () => {

  const [userInfo, setUserInfo] = useState(null)
  const [spotifyInfo, setSpotifyInfo] = useState(null)

  const SPOTIFY_AUTH = process.env.SPOTIFY_AUTH

  function refreshToken() {
    //! query string is a package we have installed - turns an object into a query string and sorts it in to keys.
    axios.post('https://accounts.spotify.com/api/token', queryString.stringify({ 'grant_type': 'client_credentials' }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${SPOTIFY_AUTH}`
      }
    })
      .then(res => {
        console.log('token refreshed')
        setSpotifyInfo(res.data.access_token)
      })
      .catch(res => {
        console.log(res)
      })
  }

  useEffect(() => {
    if (isLoggedIn()) {
      axios.get('/api/profile', {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
        .then(res => {
          setUserInfo(res.data)
        })
    }
    refreshToken()
    setInterval(refreshToken, (55 * 60000))
  }, [])


  return <HashRouter>
    <NavBar />
    <Switch>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
        <SpotifyContext.Provider value={{ spotifyInfo, setSpotifyInfo }}>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/reviews" component={Reviews} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path='/movie/:name/:id' component={SingleMovie} />
          <Route path="/profile" component={Favourites} />
          <Route path="/latest" component={Latest} />
          <Route path="/women" component={WomenMovies} />
        </SpotifyContext.Provider>
      </UserContext.Provider>
    </Switch>
    <Footer />
  </HashRouter>
}

export default App
