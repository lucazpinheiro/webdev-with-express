const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const multiparty = require('multiparty')
const morgan = require('morgan')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const middleware = require('./lib/middleware')
require('./db')

const app = express()
require('./routes')(app)

const port = process.env.PORT || 3000
const { credentials } = require('./config')

switch (app.get('env')) {
  case 'development':
    app.use(morgan('dev'))
    break
  case 'production':
    const stream = fs.createWriteStream('./var/log' + '/access.log', { flags: 'a' })
    app.use(morgan('combined', { stream }))
    break
}

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))

// set handlebards as the templae engine
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, '/public')))

// set bodyParser middleware
app.use(bodyParser.urlencoded({ extended: true }))

// set bodyParser to parse json bodies
app.use(bodyParser.json())

// set cookieParser middleware
app.use(cookieParser(credentials.cookieSecret))

// set sessions middleware
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret
}))

// set custom flash middleware
app.use(middleware.flash)

// routes
// exemplo de headers que são enviados na requisição para o servidor
// app.get('/headers', (req, res) => {
//   res.type('text/plain')
//   const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
//   res.send(headers.join('\n'))
// })

// handler "tradicional" para formularios html
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

// handler para fetch
app.get('/newsletter', handlers.newsletter)
app.post('/api/newsletter-signup', handlers.api.newsletterSignup)

// upload de arquivos
app.get('/contest/vacation-photo', handlers.vacationPhotoContest)

app.get('/fail', (req, res) => {
  throw new Error('Nope')
})

app.get('/epic-fail', (req, res) => {
  process.nextTick(() => {
    throw new Error('Nope')
  })
})

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ error: err.message })
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})

// upload de arquivos com fetch
app.get('/contest/vacation-photo-fetch', handlers.vacationPhotoContestFetch)
app.post('/api/vacation-photo-contest-fetch', handlers.api.vacationPhotoContestFetch)

// cookie testing route
app.get('/cookies', handlers.cookieSender)

// vacations
app.get('/vacations', handlers.listVacations)
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm)
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess)

// session and flash messages route
app.get('/flash-demo', handlers.flashMessageDemoForm)
app.post('/flash-messages', handlers.flashMessageDemoRes)
app.get('/flash-messages', (req, res) => {
  res.render('flash-messages')
})

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

if (require.main === module) {
  app.listen(port, () => {
    console.log(app.get('env'))
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app
}
