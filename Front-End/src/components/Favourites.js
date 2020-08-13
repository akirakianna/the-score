import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'
import axios from 'axios'
import Auth from '../lib/auth'


const Favourites = () => {
  const [movieData, setMovieData] = useState([])
  const { userInfo, setUserInfo } = useContext(UserContext)

  useEffect(() => {
    axios.get('/api/profile', {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        const newData = res.data
        setMovieData(newData)
      })
      .catch(error => console.log(error))
  }, [userInfo])

  //! Checking the value of the button matches the filmId 
  const deleteFavourite = (event) => {
    const filmId = event.target.value
    axios.delete(`/api/favourites/${filmId}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        setUserInfo(res.data)
      })
      .catch(error => console.log(error))
  }

  return <section className="favouritesPage">
    <h1 className="favouritePageTitle">FAVOURITES</h1>
    {/* First time page loads, the user info is undefined - so need to make sure it exists.  */}
    <div className="favouriteCardContainer">{userInfo && userInfo.favouriteMovies.map((movie, index) => {
      return <div key={index} className="favourites-card">
        <Link to={`/movie/${movie.title}/${movie.filmId}`}> <img className="favouriteImage" src={movie.poster} />
        </Link>
        <div className="favourites-text">
          <h1 className="favouriteMovieTitle">{movie.title}</h1>
          <p>&quot;{movie.reason}&quot;</p>
          <button className="favouriteDeleteButton" value={movie.filmId} onClick={deleteFavourite}>Delete</button>
        </div>
      </div>
    })}
    </div>
  </section>
}

export default Favourites