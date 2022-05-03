import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../../lib/enums/AlunaAccountEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { mockTranslateSymbolId } from '../../../../../lib/utils/mappings/translateSymbolId.mock'
import { SampleAuthed } from '../../../SampleAuthed'
import { sampleBaseSpecs } from '../../../sampleSpecs'
import { translateOrderSideToAluna } from '../../../enums/adapters/sampleOrderSideAdapter'
import { translateOrderStatusToAluna } from '../../../enums/adapters/sampleOrderStatusAdapter'
import { translateOrderTypeToAluna } from '../../../enums/adapters/sampleOrderTypeAdapter'
import { SAMPLE_RAW_CLOSED_ORDER, SAMPLE_RAW_ORDERS } from '../../../test/fixtures/sampleOrders'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse a Sample raw order just fine', async () => {

    // preparing data
    const exchange = new SampleAuthed({ credentials })

    const rawOrder = SAMPLE_RAW_ORDERS[0]

    const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

    const translatedOrderType = translateOrderTypeToAluna({
      from: rawOrder.type,
    })

    const translatedOrderSide = translateOrderSideToAluna({
      from: rawOrder.direction,
    })

    const translatedOrderStatus = translateOrderStatusToAluna({
      fillQuantity: rawOrder.fillQuantity,
      quantity: rawOrder.quantity,
      from: rawOrder.status,
    })

    const amount = parseFloat(rawOrder.quantity)
    const placedAt = new Date(rawOrder.createdAt)
    const total = amount * parseFloat(rawOrder.limit)

    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()
    translateSymbolId.onFirstCall().returns(baseCurrency)
    translateSymbolId.onSecondCall().returns(quoteCurrency)

    // executing
    const { order } = exchange.order.parse({ rawOrder })

    // validating
    expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(order.amount).to.be.eq(amount)
    expect(order.symbolPair).to.be.eq(rawOrder.marketSymbol)
    expect(order.baseSymbolId).to.be.eq(baseCurrency)
    expect(order.quoteSymbolId).to.be.eq(quoteCurrency)
    expect(order.exchangeId).to.be.eq(sampleBaseSpecs.id)
    expect(order.id).to.be.eq(rawOrder.id)
    expect(order.placedAt.getTime()).to.be.eq(placedAt.getTime())
    expect(order.side).to.be.eq(translatedOrderSide)
    expect(order.status).to.be.eq(translatedOrderStatus)
    expect(order.type).to.be.eq(translatedOrderType)
    expect(order.total).to.be.eq(total)

    expect(order.meta).to.deep.eq(rawOrder)

    expect(translateSymbolId.callCount).to.be.eq(2)
    expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: exchange.settings.mappings,
    })
    expect(translateSymbolId.secondCall.args[0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: exchange.settings.mappings,
    })

  })

  it(
    'should parse a Sample raw order with custom props(filledAt and proceeds)',
    async () => {

      // preparing data
      const exchange = new SampleAuthed({ credentials })

      const rawOrder = SAMPLE_RAW_CLOSED_ORDER

      const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

      const translatedOrderStatus = translateOrderStatusToAluna({
        fillQuantity: rawOrder.fillQuantity,
        quantity: rawOrder.quantity,
        from: rawOrder.status,
      })

      const amount = parseFloat(rawOrder.quantity)
      const placedAt = new Date(rawOrder.createdAt)
      const closedAt = new Date(rawOrder.updatedAt)
      const total = amount * parseFloat(rawOrder.proceeds)

      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.onFirstCall().returns(baseCurrency)
      translateSymbolId.onSecondCall().returns(quoteCurrency)

      // executing
      const { order } = exchange.order.parse({ rawOrder })

      // validating
      expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
      expect(order.amount).to.be.eq(amount)
      expect(order.placedAt.getTime()).to.be.eq(placedAt.getTime())
      expect(order.status).to.be.eq(translatedOrderStatus)
      expect(order.total).to.be.eq(total)
      expect(order.filledAt?.getTime()).to.be.eq(closedAt.getTime())

    },
  )

  it(
    'should parse a Sample raw order with custom props(canceledAt)',
    async () => {

      // preparing data
      const exchange = new SampleAuthed({ credentials })

      const rawOrder = SAMPLE_RAW_CLOSED_ORDER

      const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

      rawOrder.proceeds = undefined as any
      rawOrder.fillQuantity = '1'

      const translatedOrderStatus = translateOrderStatusToAluna({
        fillQuantity: rawOrder.fillQuantity,
        quantity: rawOrder.quantity,
        from: rawOrder.status,
      })

      const amount = parseFloat(rawOrder.quantity)
      const placedAt = new Date(rawOrder.createdAt)
      const closedAt = new Date(rawOrder.updatedAt)
      const total = amount

      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.onFirstCall().returns(baseCurrency)
      translateSymbolId.onSecondCall().returns(quoteCurrency)

      // executing
      const { order } = exchange.order.parse({ rawOrder })

      // validating
      expect(order.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
      expect(order.amount).to.be.eq(amount)
      expect(order.placedAt.getTime()).to.be.eq(placedAt.getTime())
      expect(order.status).to.be.eq(translatedOrderStatus)
      expect(order.total).to.be.eq(total)
      expect(order.canceledAt?.getTime()).to.be.eq(closedAt.getTime())

    },
  )

})
