const Amorph = require('amorph')
const CrossConverter = require('cross-converter')
const Nobject = require('nobject')
const NotReadyError = require('./errors/NotReady')
const Q = require('q')
const arguguard = require('arguguard')
const Validator = require('arguguard/lib/Validator')

const converters = new Nobject()
const forms = []
const optionsValidator = new Validator('Options', (options) => {
  if (options !== undefined && !(options instanceof Object)) {
    throw new Error('should be either undefined or instance of Object')
  }
})

function Pricemorph(rate, numerator) {
  arguguard('Pricemorph', ['Amorph', 'string'], arguments)
  this.rate = rate
  this.numerator = numerator
}

Pricemorph.Amorph = Amorph
Pricemorph.isReady =  false
Pricemorph.converters = converters
Pricemorph.forms = forms

Pricemorph.loadPricemorph = function loadPricemorph(pricemorph, denominator) {
  arguguard('Pricemorph.loadPricemorph', ['Pricemorph', 'string'], arguments)
  converters.set(pricemorph.numerator, denominator, (amorph) => {
    const rateBignumber = amorph.to('bignumber').div(pricemorph.rate.to('bignumber'))
    return new Pricemorph.Amorph(rateBignumber, 'bignumber')
  })
  converters.set(denominator, pricemorph.numerator, (amorph) => {
    const rateBignumber = amorph.truth.times(pricemorph.rate.to('bignumber'))
    return new Pricemorph.Amorph(rateBignumber, 'bignumber')
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
  arguguard('Pricemorph.loadPricemorph', [optionsValidator], arguments)
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
  arguguard('pricemorph.to', ['string'], arguments)
  if (this.rate.to('bignumber').equals(0)) {
    return new Pricemorph.Amorph(0, 'number');
  }
  if (this.numerator === numerator) {
    return new Pricemorph.Amorph(this.rate.to('bignumber'), 'bignumber');
  }
  if (Pricemorph.isReady !== true) {
    throw new NotReadyError('Amorph is not ready')
  }
  const rateAmorph = new Pricemorph.Amorph(this.rate.to('bignumber'), 'bignumber')
  return Pricemorph.crossConverter.convert(rateAmorph, this.numerator, numerator)
}

Pricemorph.prototype.plus = function plus(pricemorph) {
  arguguard('pricemorph.plus', ['Pricemorph'], arguments)
  const price = this.rate.as('bignumber', (bignumber) => {
    return bignumber.plus(pricemorph.to(this.numerator).to('bignumber'))
  })
  return new Pricemorph(price, this.numerator)
}

Pricemorph.prototype.minus = function minus(pricemorph) {
  arguguard('pricemorph.minus', ['Pricemorph'], arguments)
  const price = this.rate.as('bignumber', (bignumber) => {
    return bignumber.minus(pricemorph.to(this.numerator).to('bignumber'))
  })
  return new Pricemorph(price, this.numerator)
}

Pricemorph.prototype.times = function times(multiplier) {
  arguguard('pricemorph.times', ['Amorph'], arguments)
  const price = this.rate.as('bignumber', (bignumber) => {
    return bignumber.times(multiplier.to('bignumber'))
  })
  return new Pricemorph(price, this.numerator)
}

Pricemorph.prototype.div = function div(multiplier) {
  arguguard('pricemorph.div', ['Amorph'], arguments)
  const price = this.rate.as('bignumber', (bignumber) => {
    return bignumber.div(multiplier.to('bignumber'))
  })
  return new Pricemorph(price, this.numerator)
}

module.exports = Pricemorph
