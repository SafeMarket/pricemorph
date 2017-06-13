const arguguard = require('arguguard')

function Pricemorph(zone, value, numerator) {
  arguguard('Pricemorph', ['PricemorphZone', 'Amorph', 'string'], arguments)
  this.zone = zone
  this.value = value
  this.numerator = numerator
}

Pricemorph.prototype.to = function to(numerator) {
  arguguard('pricemorph.to', ['string'], arguments)
  const Amorph = this.value.constructor

  if (numerator === this.numerator) {
    return this.value
  }

  if (this.value.to('bignumber').equals(0)) {
    return new Amorph(0, 'number')
  }

  let valueBignumber = this.value.to('bignumber')

  if (this.numerator !== this.zone.numerator) {
    valueBignumber = valueBignumber.div(this.zone.rates[this.numerator].to('bignumber'))
  }

  if (numerator !== this.zone.numerator) {
    valueBignumber = valueBignumber.times(this.zone.rates[numerator].to('bignumber'))
  }

  return new Amorph(valueBignumber, 'bignumber')

}

Pricemorph.prototype.plus = function plus(pricemorph) {
  arguguard('pricemorph.plus', ['Pricemorph'], arguments)
  const price = this.value.as('bignumber', (bignumber) => {
    return bignumber.plus(pricemorph.to(this.numerator).to('bignumber'))
  })
  return new Pricemorph(this.zone, price, this.numerator)
}

Pricemorph.prototype.minus = function minus(pricemorph) {
  arguguard('pricemorph.minus', ['Pricemorph'], arguments)
  const price = this.value.as('bignumber', (bignumber) => {
    return bignumber.minus(pricemorph.to(this.numerator).to('bignumber'))
  })
  return new Pricemorph(this.zone, price, this.numerator)
}

Pricemorph.prototype.times = function times(multiplier) {
  arguguard('pricemorph.times', ['Amorph'], arguments)
  const price = this.value.as('bignumber', (bignumber) => {
    return bignumber.times(multiplier.to('bignumber'))
  })
  return new Pricemorph(this.zone, price, this.numerator)
}

Pricemorph.prototype.div = function div(multiplier) {
  arguguard('pricemorph.div', ['Amorph'], arguments)
  const price = this.value.as('bignumber', (bignumber) => {
    return bignumber.div(multiplier.to('bignumber'))
  })
  return new Pricemorph(this.zone, price, this.numerator)
}

Pricemorph.prototype.toLabel = function toLabel(numerator, fixed) {
  arguguard('pricemorph.toLabel', ['string', 'number'], arguments)
  return `${this.to(numerator).to('bignumber').toFixed(fixed)} ${numerator}`
}

module.exports = Pricemorph
