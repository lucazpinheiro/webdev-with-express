// const { pathUtils } = require('path')
// const fs = require('fs')
const db = require('../db')

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

function newsletter(req, res) {
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

// cookie handlers
function cookieSender(req, res) {
  const monster = req.cookies.monster
  const signedMonster = req.signedCookies.signed_monster
  console.log(`cookies monster -> ${monster}`)
  console.log(`cookies signed monster -> ${signedMonster}`)

  res.cookie('monster', 'nom nom')
  res.cookie('signed_monster', 'nom nom', { signed: true })
  res.render('cookies')
}

// session handler
function sessionDemo(req, res) {
  req.session.userName = 'Anonymous'
  const colorScheme = req.session.colorScheme || 'dark'
}

function flashMessageDemoForm(req, res) {
  res.render('flash-demo')
}

function flashMessageDemoRes(req, res) {
  req.session.flash = {
    type: 'danger',
    intro: 'Validation error!',
    message: 'Just to show off.'
  }
  return res.redirect(303, '/flash-messages')
}

// const dataDir = pathUtils.resolve(__dirname, '..', 'data')
// const vacationPhotosDir = pathUtils.join(dataDir, 'vacation-photos')
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir)
// }
// if (!fs.existsSync(vacationPhotosDir)) {
//   fs.mkdirSync(vacationPhotosDir)
// }

// function saveContestEntry(contestName, email, year, month, photoPath) {
//   // TODO...this will come later
// }

// api.vacationPhotoContest = async (req, res, fields, files) => {
//   const photo = files.photo[0]
//   const dir = vacationPhotosDir + '/' + Date.now()
//   const path = dir + '/' + photo.originalFilename
//   await fs.mkdir(dir)
//   await fs.rename(photo.path, path)
//   saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path)
//   res.send({ result: 'success' })
// }

async function listVacations(req, res) {
  const vacations = await db.getVacations({ available: true })
  const context = {
    vacations: vacations.map(vacation => ({
      sku: vacation.sku,
      name: vacation.name,
      description: vacation.description,
      price: '$' + vacation.price.toFixed(2),
      inSeason: vacation.inSeason
    }))
  }
  res.render('vacation', context)
}

function notifyWhenInSeasonForm (req, res) {
  res.render('notify-me-when-in-season', { sku: req.query.sku })
}

async function notifyWhenInSeasonProcess (req, res) {
  const { email, sku } = req.body
  await db.addVacationInSeasonListener(email, sku)
  return res.redirect(303, '/vacations')
}

module.exports = {
  notFound,
  serverError,
  newsletterSignup,
  newsletterSignupProcess,
  newsletterSignupThankYou,
  newsletter,
  api: api,
  vacationPhotoContest,
  vacationPhotoContestProcess,
  vacationPhotoContestFetch,
  cookieSender,
  flashMessageDemoForm,
  flashMessageDemoRes,
  listVacations,
  notifyWhenInSeasonForm,
  notifyWhenInSeasonProcess
}
