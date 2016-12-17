const Amorph = require('amorph')

function Pricemorph(rate, numerator) {
  this.rate = rate
  this.numerator = numerator
}

Pricemorph.isReady =  false

Pricemorph.loadPricemorph = function loadPricemorph(pricemorph, denominator) {
  Amorph.loadConverter(`pricemorph.${pricemorph.numerator}.amorph.bignumber`, `pricemorph.${denominator}.amorph.bignumber`, (amorph) => {
    const rateBignumber = amorph.truth.div(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
  Amorph.loadConverter(`pricemorph.${denominator}.amorph.bignumber`, `pricemorph.${pricemorph.numerator}.amorph.bignumber`, (amorph) => {
    const rateBignumber = amorph.truth.times(pricemorph.rate.to('bignumber'))
    return new Amorph(rateBignumber, 'bignumber')
  })
  Pricemorph.isReady = false
}

Pricemorph.ready = function ready(asset, pricemorph) {
  Amorph.ready()
  Pricemorph.isReady = true
}

Pricemorph.prototype.to = function to(numerator) {
  const rateAmorphBignumber = new Amorph(this.rate.to('bignumber'), 'bignumber')
  const rate = new Amorph(rateAmorphBignumber, `pricemorph.${this.numerator}.amorph.bignumber`)
  return rate.to(`pricemorph.${numerator}.amorph.bignumber`)
}

module.exports = Pricemorph
