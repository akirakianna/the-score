const mongoose = require('mongoose')
const User = require('./models/user')
const { dbURI } = require('./config/environment')

mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err, db) => {
    if (err) return console.log(err)

    console.log('Mongoose connected!')
    db.dropDatabase()
      .then(() => {
        return User.create([
          {
            username: 'silkenTofu',
            email: 'tofu@tofu.com',
            password: 'tofu',
            passwordConfirmation: 'tofu'
          },
          {
            username: 'kianna',
            email: 'kianna@kianna.com',
            password: 'kianna',
            passwordConfirmation: 'kianna'
          },
          {
            username: 'shaikh',
            email: 'shaikh@shaikh.com',
            password: 'shaikh',
            passwordConfirmation: 'shaikh'
          },
          {
            username: 'lara',
            email: 'lara@lara.com',
            password: 'lara',
            passwordConfirmation: 'lara'
          }
        ])
      })
      // .then(reviews => {
      //   console.log(`${reviews.length} reviews have been created !`)
      // })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        mongoose.connection.close()
      })
  }
)