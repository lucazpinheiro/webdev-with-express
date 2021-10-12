const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')
const middleware = require('./lib/middleware')

const app = express()
const port = process.env.PORT || 3000

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

// routes
app.get('/', middleware.weatherMiddleware, handlers.home)
app.get('/about', handlers.about)

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

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).send({ error: err.message })
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})

//upload de arquivos com fetch
app.get('/contest/vacation-photo-fetch', handlers.vacationPhotoContestFetch)
app.post('/api/vacation-photo-contest-fetch', handlers.api.vacationPhotoContestFetch)

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)
  })
} else {
  module.exports = app
}
