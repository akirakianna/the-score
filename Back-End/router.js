const router = require('express').Router()
const reviewsController = require('./controllers/reviewsController')
const userController = require('./controllers/userController')
const secureRoute = require('./lib/secureRoute')

//* Reviews routes *//

router.route('/reviews')
  .get(reviewsController.index)
  .post(secureRoute, reviewsController.create)

router.route('/review/:id')
  .get(reviewsController.getOneReview)
  .delete(secureRoute, reviewsController.remove)
  .put(secureRoute, reviewsController.update)

router.route('/movie/reviews/:filmId')
  .get(reviewsController.getMovieReviews)
  .post(secureRoute, reviewsController.createMovieReview)

//* Comments for reviews routes (not implemented) *//

router.route('/review/:id/comments')
  .post(secureRoute, reviewsController.createComment)

router.route('/review/:id/comment/:commentId')
  .delete(secureRoute, reviewsController.removeComment)
  .put(secureRoute, reviewsController.updateComment)

//* User register and login *//

router.route('/register')
  .post(userController.register)

router.route('/login')
  .post(userController.login)

//* User profile route *//

router.route('/profile')
  .get(secureRoute, userController.getProfile)

//* Favourited film routes *//

router.route('/favourites')
  .post(secureRoute, userController.addFavourite)

router.route('/favourites/:filmId')
  .delete(secureRoute, userController.deleteFavourite)

module.exports = router