const express = require('express')
const expressHandlebars = require('express-handlebars')
const getFortune = require('./lib/fortune')

const app = express()
const port = process.env.PORT || 3000

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))

// set handlebards as the templae engine
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

// routes
app.get('/', (req, res) => res.render('home'))
app.get('/about', (req, res) => {
  const randomFortune = getFortune()
  res.render('about', { fortune: randomFortune })
})

// custom 404 page
app.use((req, res) => {
  res.type('text/plain')
  res.status(404)
  res.render('404')
})

// custom 500 page
app.use((err, req, res, next) => {
  console.error(err.message)
  res.type('text/plain')
  res.status(500)
  res.render('500')
})

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`))