const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
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
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.get('/', middleware.weatherMiddleware, handlers.home)
app.get('/about', handlers.about)

// exemplo de headers que são enviados na requisição para o servidor
// app.get('/headers', (req, res) => {
//   res.type('text/plain')
//   const headers = Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`)
//   res.send(headers.join('\n'))
// })

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
