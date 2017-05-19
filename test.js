const Amorph = require('amorph')
const Pricemorph = require('./')
const chai = require('chai')
const chaiAmorph = require('chai-amorph')
const bignumberPlugin = require('amorph-bignumber')
const NoPathError = require('cross-converter/errors/NoPath')

chai.use(chaiAmorph)
chai.should()

Amorph.loadPlugin(bignumberPlugin)

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

  it('should simple convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(2, 'number'), 'BTC')
    productPricemorph.to('BTC').should.amorphTo('number').equal(2)
    productPricemorph.to('USD').should.amorphTo('number').equal(100 * 2)
    productPricemorph.to('USC').should.amorphTo('number').equal(100 * 2 * 100)
    productPricemorph.to('EUR').should.amorphTo('number').equal(200 * 2)
  })

  it('should throw NoPathError', () => {
    (() => {
      const productPricemorph = new Pricemorph(new Amorph(1, 'number'), 'EUR')
      productPricemorph.to('USD').should.amorphTo('number').equal(.5)
    }).should.throw(NoPathError)
  })

  it('should cross convert (after adding paths)', () => {
    const productPricemorph = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    Pricemorph.crossConverter.addPath(['EUR', 'BTC', 'USD'])
    Pricemorph.crossConverter.addPath(['EUR', 'BTC', 'USC'])
    productPricemorph.to('USD').should.amorphTo('number').equal(.5)
    productPricemorph.to('USC').should.amorphTo('number').equal(50)
  })

  it('should load USN', () => {
    Pricemorph.loadPricemorph(BTCPricemorphUSN, 'BTC')
  })

  it('should simple convert', () => {
    const productPricemorph = new Pricemorph(new Amorph(2, 'number'), 'BTC')
    productPricemorph.to('BTC').should.amorphTo('number').equal(2)
    productPricemorph.to('USD').should.amorphTo('number').equal(100 * 2)
    productPricemorph.to('USC').should.amorphTo('number').equal(100 * 2 * 100)
    productPricemorph.to('USN').should.amorphTo('number').equal(100 * 2 * 20)
    productPricemorph.to('EUR').should.amorphTo('number').equal(200 * 2)
  })

  it('should cross convert (after adding paths)', () => {
    const productPricemorph = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    Pricemorph.crossConverter.addPath(['EUR', 'BTC', 'USD'])
    Pricemorph.crossConverter.addPath(['EUR', 'BTC', 'USC'])
    Pricemorph.crossConverter.addPath(['EUR', 'BTC', 'USN'])
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

  it('should toLabel', () => {
    Pricemorph.crossConverter.addPath(['USD', 'BTC', 'EUR'])
    const pricemorph1 = new Pricemorph(new Amorph(1, 'number'), 'USD')
    pricemorph1.toLabel('USD', 0).should.equal('1 USD')
    pricemorph1.toLabel('EUR', 0).should.equal('2 EUR')
    pricemorph1.toLabel('USD', 2).should.equal('1.00 USD')
    pricemorph1.toLabel('EUR', 2).should.equal('2.00 EUR')
    const pricemorph2 = new Pricemorph(new Amorph(1, 'number'), 'EUR')
    pricemorph2.toLabel('USD', 0).should.equal('1 USD')
    pricemorph2.toLabel('EUR', 0).should.equal('1 EUR')
    pricemorph2.toLabel('USD', 2).should.equal('0.50 USD')
    pricemorph2.toLabel('EUR', 2).should.equal('1.00 EUR')
  })

})
