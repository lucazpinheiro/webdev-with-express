const getFortune = require('./fortune')

function home(req, res) {
  res.render('home')
}

function about(req, res) {
  res.render('about', {
    fortune: getFortune()
  })
}

function notFound(req, res) {
  res.render('404')
}

// eslint-disable-next-line node/handle-callback-err
function serverError(err, req, res, next) {
  res.render('500')
}

function newsletterSignup(req, res) {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' })
}
function newsletterSignupProcess(req, res) {
  console.log('Form (from querystring): ' + req.query.form)
  console.log('CSRF token (from hidden form field): ' + req.body._csrf)
  console.log('Name (from visible form field): ' + req.body.name)
  console.log('Email (from visible form field): ' + req.body.email)
  res.redirect(303, '/newsletter-signup/thank-you')
}
function newsletterSignupThankYou(req, res) {
  res.render('newsletter-signup-thank-you')
}

function newsletter (req, res) {
  // we will learn about CSRF later...for now, we just
  // provide a dummy value
  res.render('newsletter', { csrf: 'CSRF token goes here' })
}

const api = {
  newsletterSignup: (req, res) => {
    console.log('CSRF token (from hidden form field): ' + req.body._csrf)
    console.log('Name (from visible form field): ' + req.body.name)
    console.log('Email (from visible form field): ' + req.body.email)
    res.send({ result: 'success' })
  },
  vacationPhotoContestFetch: (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
  }
}

function vacationPhotoContestFetch(req, res) {
  res.render('contest/vacation-photo-fetch', {
    csrf: 'CSRF token goes here',
    year: 2021,
    month: 10
  })
}

function vacationPhotoContest(req, res) {
  res.render('contest/vacation-photo', {
    csrf: 'CSRF token goes here',
    year: 2021,
    month: 10
  })
}

function vacationPhotoContestProcess(req, res, fields, files) {
  console.log('field data: ', fields)
  console.log('files: ', files)
  res.redirect(303, 'contest/vacation-photo-thank-you')
}



module.exports = {
  home,
  about,
  notFound,
  serverError,
  newsletterSignup,
  newsletterSignupProcess,
  newsletterSignupThankYou,
  newsletter,
  api: api,
  vacationPhotoContest,
  vacationPhotoContestProcess,
  vacationPhotoContestFetch
}
