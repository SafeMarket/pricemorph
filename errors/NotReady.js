const createTestableErrorClass = require('testable-error')

module.exports = createTestableErrorClass('Pricemorph:NotReadyError', 'Pricemorph is not ready, Call Pricemorph.ready() after loading new pricemorphs')
