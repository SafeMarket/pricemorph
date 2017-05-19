const CrossConverter = require('cross-converter')
const arguguard = require('arguguard')

function Pricemorph(rate, numerator) {
  arguguard('Pricemorph', ['Amorph', 'string'], arguments)
  this.rate = rate
  this.numerator = numerator
}

Pricemorph.crossConverter = new CrossConverter()

Pricemorph.loadPricemorph = function loadPricemorph(pricemorph, denominator) {
  arguguard('Pricemorph.loadPricemorph', ['Pricemorph', 'string'], arguments)
  const Amorph = pricemorph.rate.constructor
  Pricemorph.crossConverter.addConverter(pricemorph.numerator, denominator, (amorph) => {
    const rateBignumber = amorph.to('bignumber').div(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
  Pricemorph.crossConverter.addConverter(denominator, pricemorph.numerator, (amorph) => {
    const rateBignumber = amorph.truth.times(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
}

Pricemorph.prototype.to = function to(numerator) {
  arguguard('pricemorph.to', ['string'], arguments)
  const Amorph = this.rate.constructor
  if (this.rate.to('bignumber').equals(0)) {
    return new Amorph(0, 'number');
  }
  if (this.numerator === numerator) {
    return new Amorph(this.rate.to('bignumber'), 'bignumber');
  }

  const rateAmorph = new Amorph(this.rate.to('bignumber'), 'bignumber')
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

Pricemorph.prototype.toLabel = function toLabel(numerator, fixed) {
  arguguard('pricemorph.toLabel', ['string', 'number'], arguments)
  return `${this.to(numerator).to('bignumber').toFixed(fixed)} ${numerator}`
}

module.exports = Pricemorph
