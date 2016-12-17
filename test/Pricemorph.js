const Amorph = require('amorph')
const Pricemorph = require('../')
const chai = require('chai')
const chaiAmorph = require('chai-amorph')
const bignumberConverters = require('amorph-bignumber')

chai.use(chaiAmorph)
chai.should()

Amorph.loadConverters(bignumberConverters)
Amorph.ready()

const expect = chai.expect

describe('Pricemorph', () => {

  let BTCPricemorphBTC

  it('should instantiate', () => {
    BTCPricemorphBTC = new Pricemorph(new Amorph(1, 'number'), 'BTC')
    BTCPricemorphUSD = new Pricemorph(new Amorph(100, 'number'), 'USD')
    BTCPricemorphUSC = new Pricemorph(new Amorph(100*100, 'number'), 'USC')
    BTCPricemorphEUR = new Pricemorph(new Amorph(200, 'number'), 'EUR')
  })

  it('should not be ready', () => {
    expect(Pricemorph.isReady).to.equal(false)
  })

  it('should load pricemorphs', () => {
    Pricemorph.loadPricemorph(BTCPricemorphBTC, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphUSD, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphUSC, 'BTC')
    Pricemorph.loadPricemorph(BTCPricemorphEUR, 'BTC')
  })

  it('should not be ready', () => {
    expect(Pricemorph.isReady).to.equal(false)
  })

  it ('should ready', () => {
    Pricemorph.ready()
  })

  it('should be ready', () => {
    expect(Pricemorph.isReady).to.equal(true)
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
