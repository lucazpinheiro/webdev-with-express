const getFortune = require('./fortune')

function home (req, res) {
  res.render('home')
}

function about (req, res) {
  res.render('about', {
    fortune: getFortune()
  })
}

function notFound (req, res) {
  res.render('404')
}

// eslint-disable-next-line node/handle-callback-err
function serverError (err, req, res, next) {
  res.render('500')
}

module.exports = {
  home,
  about,
  notFound,
  serverError
}
