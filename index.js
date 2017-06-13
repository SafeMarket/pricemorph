const arguguard = require('arguguard')
const _Pricemorph = require('./lib/Pricemorph')

function PricemorphZone(numerator) {
  arguguard('PricemorphZone', ['string'], arguments)
  this.numerator = numerator
  this.rates = {}

  const pricemorphZone = this
  this.Pricemorph = function Pricemorph(rate, numerator) {
    arguguard('Pricemorph', ['Amorph', 'string'], arguments)
    return new _Pricemorph(pricemorphZone, rate, numerator)
  }

  this.Pricemorph.prototype  = Object.create(_Pricemorph.prototype)
  this.Pricemorph.constructor = this.Pricemorph
}

PricemorphZone.prototype.setRate = function setRate(numerator, Amorph) {
  arguguard('pricemorphZone.setRate', ['string', 'Amorph'], arguments)
  this.rates[numerator] = Amorph
}

module.exports = PricemorphZone
