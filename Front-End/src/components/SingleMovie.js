import React, { useEffect, useState, useContext } from 'react'
import { UserContext, SpotifyContext } from '../UserContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import ReviewForm from './ReviewForm'
import { isLoggedIn } from '../lib/auth'
import moment from 'moment'



const SingleMovie = (props) => {

  const { userInfo, setUserInfo } = useContext(UserContext)
  const { spotifyInfo } = useContext(SpotifyContext)

  const [soundtrackData, setSoundtrackData] = useState({})
  const [added, setAdded] = useState(false)
  const [clickFavourite, setClickFavourite] = useState(false)
  const [reason, setReason] = useState('')
  const [movieData, setMovieData] = useState([])
  const [reviewData, setReviewData] = useState([])
  const [similarMovieData, updateSimilarMovieData] = useState([])
  const [text, setText] = useState('')
  const [rating, setRating] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedText, setUpdatedText] = useState('')
  const [updatedRating, setUpdatedRating] = useState(0)


  function scrollToTop() {
    window.scrollTo(0, 0)
  }

  //* Returning single movie data

  useEffect(() => {
    const movieName = props.match.params.name
    const filmId = props.match.params.id
    const API_KEY = process.env.MOVIE_KEY

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${movieName}&page=1&include_adult=false
    `)
      .then(axiosResp => {
        setMovieData(axiosResp.data.results[0])
        if (userInfo) {
          //! Kianna  - this code is checking to see whether the specified movie already exists inside of the favouriteMovies array
          //! .some() returns a boolean value, used in the ternary operator for the add to favourites button.
          const exists = userInfo.favouriteMovies.some(movie => movie.filmId === axiosResp.data.results[0].id)
          setAdded(exists)
        }
      })
      .catch(err => console.log(err.response))

    axios.get(`https://api.spotify.com/v1/search?q=${movieName}soundtrack&type=playlist`,
      {
        headers: { 'Authorization': `Bearer ${spotifyInfo}` }
      })
      .then(axiosResp => {
        setTimeout(() => {
          setSoundtrackData(axiosResp.data.playlists.items[0].id)
          console.log('hello')
        }, 150)
      })
      .catch(err => console.log(err.response))

    axios.get(`api/movie/reviews/${filmId}`)
      .then(axiosResp => {
        setReviewData(axiosResp.data)

      })

    axios.get(`https://api.themoviedb.org/3/movie/${filmId}/similar?api_key=${API_KEY}&language=en-US`)
      .then(axiosResp => {
        updateSimilarMovieData(axiosResp.data.results)
      })
  }, [userInfo, props.match])


  //* Pushing single movie to favourites(profile) page

  const favourite = () => {
    setClickFavourite(true)
  }

  const submitReason = (event) => {

    setClickFavourite(false)
    event.preventDefault()

    const data = {
      filmId: movieData.id,
      title: movieData.title,
      poster: `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`,
      reason: reason
    }
    axios.post('/api/favourites', data, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => {
        //! Is returning the entire user - back-end is giving the user
        setUserInfo(res.data)
      })
      .catch(err => {
        props.history.push('/login')
        console.log(err.response)
      })
  }

  function handleComment(filmId) {
    const token = localStorage.getItem('token')
    axios.post(`api/movie/reviews/${filmId}`, { text: text, filmId: props.match.params.id, rating: rating, film: movieData }, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((axiosResponse) => {
        setText('')
        //* 0 is when there is no rating yet - the initial state.
        setRating(0)
        const reviews = [...reviewData]
        reviews.push(axiosResponse.data)
        setReviewData(reviews)
      })
  }

  //* Deleting a single review 
  function handleDelete(event) {
    const token = localStorage.getItem('token')
    const reviewId = event.target.value
    axios.delete(`/api/review/${reviewId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUserInfo(res.data)
      })
  }

  //* Editing a single review

  function handleEdit(event) {
    const token = localStorage.getItem('token')
    const reviewId = event.target.value
    axios.put(`/api/review/${reviewId}`, { text: updatedText, rating: updatedRating }, { headers: { Authorization: `Bearer ${token}` } })
      .then((comment) => {
        setUpdatedText('')
        setUpdatedRating(Number)
        setIsEditing(false)
        const updatedReviews = reviewData.map((review, index) => {
          if (comment.data._id === review._id) {
            return comment.data
          } else {
            return review
          }
        })
        setReviewData([...updatedReviews])
        console.log(updatedReviews)
      })
  }


  function handleToggle(event) {

    if (isEditing) {
      setIsEditing(false)
    } else {
      setIsEditing(event.target.value)
    }

  }

  function userCheck(username) {
    return isLoggedIn() && userInfo && userInfo.username === username
  }

  //! Returning soundtrack and single movie data on page

  return <>
    <h1 className="singleMovieTitle">{movieData.title}</h1>
    <p className="singleMovieBio">{movieData.overview}</p>
    {isLoggedIn() && <div className="favouriteMovieButtonContainer">
      {added ? <button title="Disabled button" disabled>Added</button> : <button className="favouriteMovieButton" onClick={favourite}>Favourite</button>}
      {clickFavourite && <form onSubmit={submitReason}><input
        name="text"
        className="reason-input-form"
        //! Needed to record the changes in state - listening for changes, updating reason with changes. State is changing when you type in the box.
        onChange={(event) => setReason(event.target.value)}
        placeholder="Why it is your favourite film?"
        value={reason}
      />
      <button className="reasonButton">Submit</button>
      </form>}
    </div>}

    <div className="singlePageContainer">
      <section className="singleSectionOne">
        {soundtrackData && <div>
          <iframe className="singleIframe" src={`https://open.spotify.com/embed/playlist/${soundtrackData}`} width="250" height="375" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>}
        <div className="singleMovieSection">
          <img className="singleMoviePoster" src={`https://image.tmdb.org/t/p/w500/${movieData.poster_path}`} />
        </div>
      </section>

      <h2 className="singlePageReviews">Reviews</h2>
      <section className="singleSectionTwo">
        {reviewData && reviewData.map((review, index) => {
          return <div key={index} className="singleReviewContainer">
            <h1>{review.user.username} says:</h1>
            <p>&quot;{review.text}&quot;</p>
            <span >{[...Array(review.rating)].map((e, i) => {
              return <span key={i} className="singleMovieStars">★</span>
            })} </span>
            <p>{moment(review.updatedAt).fromNow()} </p>
            <div className="singleReviewButtons">
              {userCheck(review.user.username) && <button onClick={handleDelete} value={review._id} id="singleButton" className="single-delete-button">Delete </button>}
              {userCheck(review.user.username) && <button onClick={handleToggle} value={review._id} id="singleButton" className="single-edit-button">Edit </button>}
            </div>
            {review._id === isEditing && <ReviewForm
              text={updatedText}
              setText={setUpdatedText}
              rating={updatedRating}
              setRating={setUpdatedRating}
            />}
            {(isLoggedIn() && isEditing === review._id && userInfo && userInfo.username === review.user.username) && <button onClick={handleEdit} value={review._id} className="submit-button">Submit</button>}
          </div>
        })}
      </section>

      <section className="singleSectionThree">
        <h3 className="singleLeaveReview">Leave a Review</h3>
        <div className="sectionThreeText">
          {(isLoggedIn() && !isEditing && userInfo) && <ReviewForm
            text={text}
            setText={setText}
            rating={rating}
            setRating={setRating}
          />}
          <div className="button">
            {(isLoggedIn() && !isEditing && userInfo) && <button onClick={handleComment} className="submit-button">Submit</button>}
          </div>
        </div>
      </section>
      
      <h2 className="singleSimilarTitle">Similar Movies</h2>
      <div className="singleSimilarMovieList">
        {similarMovieData && similarMovieData.map((result, index) => {
          if (index < 5) {
            return <div className="singleSimilarContainer" key={index}>
              <Link onClick={scrollToTop} to={`/movie/${result.title}/${result.id}`}>
                <img className="similarMovieItem" src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`} />
              </Link>
            </div>
          }
        })}
      </div>
    </div>
  </>
}


export default SingleMovie
