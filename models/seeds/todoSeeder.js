const bcrypt = require('bcryptjs')

const db = require('../../config/mongoose')
const Todo = require('../todo') // 載入 todo model
const User = require('../user')

const SEED_USER = {
  name: 'EX',
  email: 'ex@example.com',
  password: '123456789'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash,
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 10 },
        (_, i) => Todo.create({ name: `name-${i}`, userId })))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})