const handlers = require('../handlers')

it('should render home page', () => {
  const req = {}
  const res = { render: jest.fn() }

  handlers.home(req, res)
  expect(res.render.mock.calls[0][0]).toBe('home')
})


it('shoould render about page with fortune', () => {
  const req = {}
  const res = { render: jest.fn() }

  handlers.about(req, res)

  // check if render function from handler 'about' is called one time
  expect(res.render.mock.calls.length).toBe(1)

  // check if first call of render function had 'about' string as first argument
  expect(res.render.mock.calls[0][0]).toBe('about')

  // check if first call of render function had a object with a fortune property as second argument
  expect(res.render.mock.calls[0][1])
    .toEqual(expect.objectContaining({
      fortune: expect.stringMatching(/\W/),
    }))
})


it('404 handler renders', () => {
  const req = {}
  const res = { render: jest.fn() }

  handlers.notFound(req, res)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('404')
})

it('500 handler renders', () => {
  const err = new Error('some error')
  const req = {}
  const res = { render: jest.fn() }
  const next = jest.fn()

  handlers.serverError(err, req, res, next)
  expect(res.render.mock.calls.length).toBe(1)
  expect(res.render.mock.calls[0][0]).toBe('500')
})