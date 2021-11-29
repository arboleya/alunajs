import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceOrderStatusEnum } from '../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../enums/BinanceSideEnum'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'
import {
  BINANCE_PARSED_ORDER,
  BINANCE_RAW_ORDER,
} from '../test/fixtures/binanceOrder'
import { BinanceOrderReadModule } from './BinanceOrderReadModule'



describe('BinanceOrderReadModule', () => {

  const binanceOrderReadModule = BinanceOrderReadModule.prototype


  it('should list all Binance raw open orders just fine', async () => {

    const binanceRawOrders = [BINANCE_RAW_ORDER]

    ImportMock.mockOther(
      binanceOrderReadModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      binanceRawOrders,
    )

    const rawBalances = await binanceOrderReadModule.listRaw()

    expect(requestMock.callCount).to.be.eq(1)

    expect(rawBalances.length).to.be.eq(1)

    rawBalances.forEach((balance, index) => {

      const {
        orderId,
        price,
        side,
        status,
        timeInForce,
        type,
        stopPrice,
        clientOrderId,
        cummulativeQuoteQty,
        executedQty,
        icebergQty,
        isWorking,
        orderListId,
        origQty,
        origQuoteOrderQty,
        symbol,
        time,
        updateTime
      } = binanceRawOrders[index]

      expect(balance.orderId).to.be.eq(orderId)
      expect(balance.clientOrderId).to.be.eq(clientOrderId)
      expect(balance.cummulativeQuoteQty).to.be.eq(cummulativeQuoteQty)
      expect(balance.origQuoteOrderQty).to.be.eq(origQuoteOrderQty)
      expect(balance.symbol).to.be.eq(symbol)
      expect(balance.time).to.be.eq(time)
      expect(balance.updateTime).to.be.eq(updateTime)
      expect(balance.executedQty).to.be.eq(executedQty)
      expect(balance.icebergQty).to.be.eq(icebergQty)
      expect(balance.price).to.be.eq(price)
      expect(balance.isWorking).to.be.eq(isWorking)
      expect(balance.side).to.be.eq(side)
      expect(balance.status).to.be.eq(status)
      expect(balance.timeInForce).to.be.eq(timeInForce)
      expect(balance.type).to.be.eq(type)
      expect(balance.orderListId).to.be.eq(orderListId)
      expect(balance.origQty).to.be.eq(origQty)
      expect(balance.stopPrice).to.be.eq(stopPrice)

    })

  })



  it('should list all Binance parsed open orders just fine', async () => {

    const binanceParsedOrders = [BINANCE_PARSED_ORDER]

    const listRawMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'listRaw',
      ['raw-orders'],
    )

    const parseManyMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'parseMany',
      binanceParsedOrders,
    )

    const parsedOrders = await binanceOrderReadModule.list()

    expect(listRawMock.callCount).to.be.eq(1)

    expect(parseManyMock.callCount).to.be.eq(1)

    expect(parsedOrders.length).to.be.eq(1)

    parsedOrders.forEach((order, index) => {

      const {
        account,
        amount,
        id,
        isAmountInContracts,
        placedAt,
        side,
        status,
        symbolPair,
        total,
        type,
        rate,
      } = binanceParsedOrders[index]

      expect(order.id).to.be.eq(id)
      expect(order.account).to.be.eq(account)
      expect(order.amount).to.be.eq(amount)
      expect(order.isAmountInContracts).to.be.eq(isAmountInContracts)
      expect(order.placedAt).to.be.eq(placedAt)
      expect(order.side).to.be.eq(side)
      expect(order.status).to.be.eq(status)
      expect(order.symbolPair).to.be.eq(symbolPair)
      expect(order.total).to.be.eq(total)
      expect(order.type).to.be.eq(type)
      expect(order.rate).to.be.eq(rate)
      
    })

  })



  it('should get a raw Binance order status just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    ImportMock.mockOther(
      binanceOrderReadModule,
      'exchange',
      {
        keySecret,
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      BinanceHttp,
      'privateRequest',
      BINANCE_RAW_ORDER,
    )

    const symbolPair = 'symbol'
    const id = 'id'

    const rawOrder = await binanceOrderReadModule.getRaw({
      id,
      symbolPair,
    })


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.args[0][0]).to.includes({
      verb: AlunaHttpVerbEnum.GET,
      url: PROD_BINANCE_URL + `/api/v3/order`,
    })

    expect(rawOrder.type).to.be.eq(BinanceOrderTypeEnum.LIMIT)
    expect(rawOrder.status).to.be.eq(BinanceOrderStatusEnum.NEW)
    expect(rawOrder.side).to.be.eq(BinanceSideEnum.BUY)

  })



  it('should get a parsed Binance order just fine', async () => {

    const rawOrderMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'getRaw',
      'rawOrder',
    )

    const parseMock = ImportMock.mockFunction(
      binanceOrderReadModule,
      'parse',
      BINANCE_PARSED_ORDER,
    )

    const params = {
      id: 'id',
      symbolPair: 'symbolPair',
    }

    const parsedOrder = await binanceOrderReadModule.get(params)

    expect(rawOrderMock.callCount).to.be.eq(1)
    expect(rawOrderMock.calledWith(params)).to.be.ok

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: 'rawOrder' })).to.be.ok

    expect(parsedOrder.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder.side).to.be.eq(AlunaSideEnum.LONG)

  })



  it('should parse a Binance raw order just fine', () => {

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const parseMock = ImportMock.mockFunction(
      BinanceOrderParser,
      'parse',
    )

    parseMock
      .onFirstCall().returns(BINANCE_PARSED_ORDER)

    const parsedOrder1 = binanceOrderReadModule.parse({ rawOrder: rawOrder })

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({ rawOrder: rawOrder })).to.be.ok

    expect(parsedOrder1.symbolPair).to.be.ok
    expect(parsedOrder1.total).to.be.ok
    expect(parsedOrder1.amount).to.be.ok
    expect(parsedOrder1.rate).to.be.ok
    expect(parsedOrder1.placedAt).to.be.ok

    expect(parsedOrder1.isAmountInContracts).not.to.be.ok

    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.OPEN)
    expect(parsedOrder1.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder1.type).to.be.eq(AlunaOrderTypesEnum.LIMIT)
    expect(parsedOrder1.side).to.be.eq(AlunaSideEnum.LONG)
  })



  it('should parse many Binance orders just fine', () => {

    const rawOrders = [BINANCE_RAW_ORDER]
    const parsedOrders = [BINANCE_PARSED_ORDER]

    const parseMock = ImportMock.mockFunction(
      BinanceOrderParser,
      'parse',
    )

    parsedOrders.forEach((parsed, index) => {

      parseMock.onCall(index).returns(parsed)

    })

    const parsedManyResp = binanceOrderReadModule.parseMany({ rawOrders })

    expect(parsedManyResp.length).to.be.eq(1)
    expect(parseMock.callCount).to.be.eq(1)

    parsedManyResp.forEach((parsed, index) => {

      expect(parsed).to.deep.eq(parsedOrders[index])
      expect(parseMock.calledWith({
        rawOrders: parsed,
      }))

    })

  })

})
