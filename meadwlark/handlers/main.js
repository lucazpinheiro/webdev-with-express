const getFortune = require('../lib/fortune')

function home (req, res) {
  res.render('home')
}

function about (req, res) {
  res.render('about', {
    fortune: getFortune()
  })
}

module.exports = {
  home,
  about
}