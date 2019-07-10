'use strict'
const util = require('../lib/helpers')
const assert = require('assert')

describe('helpers.stringifyQuery', function () {
  it('supports primitive types', function () {
    let actual = util.stringifyQuery({type: 'apples', count: 420, bbq: true, veggies: false})
    // note how veggies is omitted entirely
    assert.equal(actual, 'type=apples&count=420&bbq=true')
  })
  it('supports top-level arrays', function () {
    let actual = util.stringifyQuery({foo: ['x'], bar: ['y', 'z']})
    assert.equal(actual, 'foo=x&bar=y&bar=z')
  })
})

describe('helpers.merge', function () {
  it('joins multiple sets', function () {
    let actual = util.merge({foo: true}, {bar: true}, {baz: true})
    assert.deepEqual(actual, {
      foo: true,
      bar: true,
      baz: true
    })
  })
  it('ignores "undefined"', function () {
    let actual = util.merge({x: 1, y: 2}, {x: undefined, y: 3})
    assert.deepEqual(actual, {
      x: 1,
      y: 3
    })
  })
})

describe('helpers.mergeHeaders', function () {
  it('returns lowercase headers names', function () {
    let actual = util.mergeHeaders({}, {
      'x-my-hEaDeR': true,
      'Accept': true,
      'content-type': true
    })
    assert.deepEqual(actual, {
      'x-my-header': true,
      'accept': true,
      'content-type': true
    })
  })
})

describe('helpers.once', function () {
  it('ensures a callback just runs once', function () {
    let attempts = 0
    let fn = util.once(() => attempts++)
    fn(); fn()
    assert.equal(attempts, 1)
  })
})

describe('helpers.parseJSONError', function () {
  const parseJSONError = (statusCode, body) => {
    return util.parseJSONError({}, {statusCode, body: new Buffer.from(JSON.stringify(body))});
  }

  const assertEqual = (error, statusCode, message) => {
    assert.equal(error.statusCode, statusCode)
    assert.equal(error.message, message)
    assert.equal(error.name, 'RequestError')
  }

  it('should return Bad Request', function () {
    const statusCode = 400;
    const body = {};
    const error = parseJSONError(statusCode, body);
    assertEqual(error, statusCode, 'Bad Request')
  })

  it('should return RequestError with message test msg', function () {
    const statusCode = 400;
    const body = {message: 'test msg'};
    const error = parseJSONError(statusCode, body);
    assertEqual(error, statusCode, body.message)
  })

  it('should return RequestError with message test err', function () {
    const statusCode = 400;
    const body = {error: 'test err'};
    const error = parseJSONError(statusCode, body);
    assertEqual(error, statusCode, body.error)
  })
})
