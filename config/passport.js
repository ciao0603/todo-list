const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = (app) => {
  // 初始化passport模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { massage: 'That email is not registered.' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or password incorrect.' })
        }
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))
  // 序列化和反序列化
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}