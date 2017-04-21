const Amorph = require('amorph')
const Pricemorph = require('../')
const chai = require('chai')
const chaiAmorph = require('chai-amorph')
const bignumberPlugin = require('amorph-bignumber')
const NotReadyError = require('../errors/NotReady')

chai.use(chaiAmorph)
chai.should()

Amorph.loadPlugin(bignumberPlugin)
Amorph.ready()

const expect = chai.expect

describe('Pricemorph', () => {

  let BTCPricemorphBTC

  it('new Pricemorph({}, BTC) should throw Error', () => {
    (() => {
      new Pricemorph({}, 'BTC')
    }).should.throw(Error)
  })

  it('new Pricemorph(amorph, {}) should throw Error', () => {
    (() => {
      new Pricemorph(new Amorph(1, 'number'), {})
    }).should.throw(Error)
  })

  it('should instantiate', () => {
    BTCPricemorphBTC = new Pricemorph(new Amorph(1, 'number'), 'BTC')
    BTCPricemorphUSD = new Pricemorph(new Amorph(100, 'number'), 'USD')
    //USC = US Cents
    BTCPricemorphUSC = new Pricemorph(new Amorph(100*100, 'number'), 'USC')
    //USN = US Nickels
    BTCPricemorphUSN = new Pricemorph(new Amorph(100*20, 'number'), 'USN')
    BTCPricemorphEUR = new Pricemorph(new Amorph(200, 'number'), 'EUR')
  })

  it('should not be ready ', () => {
    Pricemorph.isReady.should.equal(false)
  })

  it('pricemorph.to(USD) should throw NotReadyError', () => {
    (() => {
      BTCPricemorphBTC.to('USD')
    }).should.throw(NotReadyError)
  })

  it('pricemorph.to({}) should throw Error', () => {
    (() => {
      BTCPricemorphBTC.to({})
    }).should.throw(Error)
  })

  it('pricemorph.loadPricemorph({}, BTC) should throw Error', () => {
    (() => {
      Pricemorph.loadPricemorph({}, 'BTC')
    }).should.throw(Error)
  })

  it('pricemorph.loadPricemorph(pricemoprh, {}) should throw Error', () => {
    (() => {
      Pricemorph.loadPricemorph(BTCPricemorphBTC, {})
    }).should.throw(Error)
  })

  it('should load pricemorphs', () => {
    Pricemorph.loadPricemorph(BTCPricemorphBTC, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphUSD, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphUSC, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphEUR, 'BTC')
  })

  it('should not be ready', () => {
    Pricemorph.isReady.should.equal(false)
  })

  it('should be able to convert a pricemorph to its own numerator (even though not ready)', () => {
    const tenBTC = new Pricemorph(new Amorph(10, 'number'), 'BTC')
    tenBTC.to('BTC').to('number').should.equal(10)
  })

  it('should be able to convert a zero pricemorph(even though not ready)', () => {
    const zeroBTC = new Pricemorph(new Amorph(0, 'number'), 'BTC')
    zeroBTC.to('USD').to('number').should.equal(0)
  })

  it ('should throw error when trying to ready with options as number', () => {
    (() => {
      Pricemorph.ready(5)
    }).should.throw(Error)
  })

  it ('should ready (sync)', () => {
    Pricemorph.ready()
  })

  it('should be ready', () => {
    Pricemorph.isReady.should.equal(true)
  })

  it('should simple convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(2, 'number'), 'BTC')
    productPricemorph.to('BTC').should.amorphTo('number').equal(2)
    productPricemorph.to('USD').should.amorphTo('number').equal(100 * 2)
    productPricemorph.to('USC').should.amorphTo('number').equal(100 * 2 * 100)
    productPricemorph.to('EUR').should.amorphTo('number').equal(200 * 2)
  })

  it('should cross convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    productPricemorph.to('USD').should.amorphTo('number').equal(.5)
    productPricemorph.to('USC').should.amorphTo('number').equal(50)
  })

  it('should have forms', () => {
    Pricemorph.forms.should.deep.equal(['BTC', 'USD', 'USC', 'EUR'])
  })

  it('should load USN', () => {
    Pricemorph.loadPricemorph(BTCPricemorphUSN, 'BTC')
  })

  it('should be NOT be ready', () => {
    Pricemorph.isReady.should.equal(false)
  })

  it('should ready (async)', () => {
    Pricemorph.ready({ isAsync: true, chunkSize: 1 })
  })

  it('should still NOT be ready', () => {
    Pricemorph.isReady.should.equal(false)
  })

  it('should wait for Pricemorph.promise', () => {
    return Pricemorph.promise
  })

  it('should be ready', () => {
    Pricemorph.isReady.should.equal(true)
  })

  it('should simple convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(2, 'number'), 'BTC')
    productPricemorph.to('BTC').should.amorphTo('number').equal(2)
    productPricemorph.to('USD').should.amorphTo('number').equal(100 * 2)
    productPricemorph.to('USC').should.amorphTo('number').equal(100 * 2 * 100)
    productPricemorph.to('USN').should.amorphTo('number').equal(100 * 2 * 20)
    productPricemorph.to('EUR').should.amorphTo('number').equal(200 * 2)
  })

  it('should cross convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    productPricemorph.to('USD').should.amorphTo('number').equal(.5)
    productPricemorph.to('USC').should.amorphTo('number').equal(50)
    productPricemorph.to('USN').should.amorphTo('number').equal(10)
  })

  it('should add', () => {
    const pricemorph1 = new Pricemorph(new Amorph(1, 'number'), 'USD')
    const pricemorph2 = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    pricemorph1.plus(pricemorph2).to('USD').should.amorphTo('number').equal(1.5)
  })

  it('should minus', () => {
    const pricemorph1 = new Pricemorph(new Amorph(1, 'number'), 'USD')
    const pricemorph2 = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    pricemorph1.minus(pricemorph2).to('USD').should.amorphTo('number').equal(.5)
  })

  it('should times', () => {
    const pricemorph1 = new Pricemorph(new Amorph(1, 'number'), 'USD')
    const multiplier = new Amorph(2, 'number')
    pricemorph1.times(multiplier).to('USD').should.amorphTo('number').equal(2)
  })

  it('should div', () => {
    const pricemorph1 = new Pricemorph(new Amorph(1, 'number'), 'USD')
    const multiplier = new Amorph(2, 'number')
    pricemorph1.div(multiplier).to('USD').should.amorphTo('number').equal(.5)
  })

})
