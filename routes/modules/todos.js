const express = require('express')
const router = express.Router()

const Todo = require('../../models/todo')

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const name = req.body.name

  Todo.create({ name, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId }) //先找出id一樣的todo > 確保屬於目前登入的user
     .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId })
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, done } = req.body
  Todo.findOne({ _id, userId })
    .then(todo => {
      todo.name = name
      todo.done = done === 'on' //true
      return todo.save()
    })
    .then(todo => res.redirect(`/todos/${_id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  Todo.findOne({ _id, userId })
    .then(todo => todo.remove())
    .then(todo => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router