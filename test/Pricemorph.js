const Amorph = require('amorph')
const Pricemorph = require('../')
const chai = require('chai')
const chaiAmorph = require('chai-amorph')
const bignumberConverters = require('amorph-bignumber')
const NotReadyError = require('../errors/NotReady')
const DenominatorNotStringError = require('../errors/DenominatorNotString')
const NumeratorNotStringError = require('../errors/NumeratorNotString')
const RateNotAmorphError = require('../errors/RateNotAmorph')
const PricemorphNotPricemorphError = require('../errors/PricemorphNotPricemorph')

chai.use(chaiAmorph)
chai.should()

Amorph.loadConverters(bignumberConverters)
Amorph.ready()

const expect = chai.expect

describe('Pricemorph', () => {

  let BTCPricemorphBTC

  it('new Pricemorph({}, BTC) should throw PricemorphNotPricemorphError', () => {
    (() => {
      new Pricemorph({}, 'BTC')
    }).should.throw(RateNotAmorphError)
  })

  it('new Pricemorph(amorph, {}) should throw NumeratorNotStringError', () => {
    (() => {
      new Pricemorph(new Amorph(1, 'number'), {})
    }).should.throw(NumeratorNotStringError)
  })

  it('should instantiate', () => {
    BTCPricemorphBTC = new Pricemorph(new Amorph(1, 'number'), 'BTC')
    BTCPricemorphUSD = new Pricemorph(new Amorph(100, 'number'), 'USD')
    BTCPricemorphUSC = new Pricemorph(new Amorph(100*100, 'number'), 'USC')
    BTCPricemorphEUR = new Pricemorph(new Amorph(200, 'number'), 'EUR')
  })

  it('pricemorph.to(USD) should throw NotReadyError', () => {
    (() => {
      BTCPricemorphBTC.to('USD')
    }).should.throw(NotReadyError)
  })

  it('pricemorph.to({}) should throw NumeratorNotStringError', () => {
    (() => {
      BTCPricemorphBTC.to({})
    }).should.throw(NumeratorNotStringError)
  })

  it('should not be ready', () => {
    Pricemorph.isReady.should.equal(false)
  })

  it('pricemorph.loadPricemorph({}, BTC) should throw PricemorphNotPricemorphError', () => {
    (() => {
      Pricemorph.loadPricemorph({}, 'BTC')
    }).should.throw(PricemorphNotPricemorphError)
  })

  it('pricemorph.loadPricemorph(pricemoprh, {}) should throw DenominatorNotStringError', () => {
    (() => {
      Pricemorph.loadPricemorph(BTCPricemorphBTC, {})
    }).should.throw(DenominatorNotStringError)
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

  it ('should ready', () => {
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

})
