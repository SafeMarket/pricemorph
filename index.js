const Amorph = require('amorph')
const CrossConverter = require('cross-converter')
const Nobject = require('nobject')
const NotReadyError = require('./errors/NotReady')
const DenominatorNotStringError = require('./errors/DenominatorNotString')
const NumeratorNotStringError = require('./errors/NumeratorNotString')
const RateNotStringAmorph = require('./errors/RateNotAmorph')
const PricemorphNotPricemorphError = require('./errors/PricemorphNotPricemorph')
const Q = require('q')

const converters = new Nobject()
const forms = []

function Pricemorph(rate, numerator) {
  if (!(rate instanceof Amorph)) {
    throw new RateNotStringAmorph()
  }
  if (typeof numerator !== 'string') {
    throw new NumeratorNotStringError()
  }
  this.rate = rate
  this.numerator = numerator
}

Pricemorph.isReady =  false
Pricemorph.converters = converters
Pricemorph.forms = forms

Pricemorph.loadPricemorph = function loadPricemorph(pricemorph, denominator) {
  if (!(pricemorph instanceof Pricemorph)) {
    throw new PricemorphNotPricemorphError()
  }
  if (typeof denominator !== 'string') {
    throw new DenominatorNotStringError()
  }
  converters.set(pricemorph.numerator, denominator, (amorph) => {
    const rateBignumber = amorph.to('bignumber').div(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
  converters.set(denominator, pricemorph.numerator, (amorph) => {
    const rateBignumber = amorph.truth.times(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
  if (forms.indexOf(pricemorph.numerator) === -1) {
    forms.push(pricemorph.numerator)
  }
  if (forms.indexOf(denominator) === -1) {
    forms.push(denominator)
  }
  Pricemorph.isReady = false
}

Pricemorph.ready = function ready(crossConverterOptions) {
  Pricemorph.crossConverter = new CrossConverter(converters, crossConverterOptions)
  if (Pricemorph.crossConverter.isReady) {
    Pricemorph.promise = Q.resolve(true)
    Pricemorph.isReady = true
  } else {
    Pricemorph.promise = Pricemorph.crossConverter.promise.then(() => {
      Pricemorph.isReady = true
    })
  }
}

Pricemorph.prototype.to = function to(numerator) {
  if (typeof numerator !== 'string') {
    throw new NumeratorNotStringError()
  }
  if (Pricemorph.isReady !== true) {
    throw new NotReadyError()
  }
  const rateAmorph = new Amorph(this.rate.to('bignumber'), 'bignumber')
  return Pricemorph.crossConverter.convert(rateAmorph, this.numerator, numerator)
}

module.exports = Pricemorph
