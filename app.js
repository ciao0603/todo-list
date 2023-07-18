// 載入 express 並建構應用程式伺服器
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')

require('./config/mongoose')

const app = express()
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true 
}))

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 設定路由
app.use(routes)

const PORT = process.env.PORT || 3000
// 設定 port 3000
app.listen(PORT, () => {
console.log(`App is running on http://localhost:${PORT}`)
})