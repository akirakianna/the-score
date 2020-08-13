const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')

function register(req, res) {
  User
    .create(req.body)
    .then(user => {
      res.status(201).send(user)
    })
    .catch(error => res.send(error))
}

function login(req, res) {
  console.log(req.body)
  User
    .findOne({ email: req.body.email })
    .then(user => {
      console.log(user)
      if (!user) return res.status(400).send({ message: 'User not found' })

      if (!user.validatePassword(req.body.password)) {
        return res.status(401).send({ message: 'Unauthorized' })
      }
      const token = jwt.sign({ sub: user._id }, secret, { expiresIn: '72h' })
      res.status(202).send({ message: `Welcome back ${user.username}`, token, user })
    })
    .catch(error => res.send(error))
}

//* Favourite Logic

function addFavourite(req, res) {
  //! Front-end
  const favourite = req.body
  User
  //! req.currentUser from secure route, untangling the the token
  //! Have the current user, as they exist in database, user has favouritemovies key, push this new fav movie from request into user favourites.
  //! User object has favourites on it
    .findById(req.currentUser)
    .then(user => {
      user.favouriteMovies.push(favourite)
      return user.save()
    })

    .then(user => res.status(201).json(user))
    .catch(err => res.status(401).send(err))
}

function deleteFavourite(req, res) {
  const favouriteId = parseInt((req.params.filmId))
  User
  //! This comes from secureRoute
    .findById(req.currentUser)
    .then(user => {
      const filteredFavourites = user.favouriteMovies.filter(movie => favouriteId !== movie.filmId)
      user.favouriteMovies = [...filteredFavourites]
      //! Doesn't mutate, so have to save
      return user.save()
    })
    .then(user => res.status(201).json(user))
    .catch(err => res.status(401).send(err))
}

function getProfile(req, res) {
  User
    .findById(req.currentUser)
    .then(user => {
      res.send(user)
    })
}

module.exports = {
  register,
  login,
  addFavourite,
  deleteFavourite,
  getProfile
}