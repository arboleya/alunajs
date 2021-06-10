import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/abstracts/IAlunaExchange'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaOrderStatusEnum } from '../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../lib/enums/AlunaSideEnum'
import { IAlunaOrderPlaceParams } from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import { IValrOrderGetSchema } from '../schemas/IValrOrderSchema'
import { ValrError } from '../ValrError'
import { ValrHttp } from '../ValrHttp'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderWriteModule } from './ValrOrderWriteModule'



describe('ValrOrderWriteModule', () => {

  const valrOrderWriteModule = ValrOrderWriteModule.prototype

  const keySecret = {
    key: '',
    secret: '',
  }

  const placedOrderId = 'placed-order-id'

  const placedOrder = 'placed-order'



  it('should place a new Valr limit order just fine', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      { id: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      placedOrder,
    )

    const placeOrderParams = {
      amount: '0.001',
      rate: '10000',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.LIMIT,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: placeOrderParams.symbolPair,
      quantity: placeOrderParams.amount,
      price: placeOrderParams.rate,
      postOnly: false,
      timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
    }


    // place long limit order
    const placeResponse1 = await valrOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: requestBody,
      keySecret,
    })).to.be.true


    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0])


    // place short limit order
    const placeResponse2 = await valrOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaSideEnum.SHORT,
    })


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: {
        ...requestBody,
        side: ValrSideEnum.SELL,
      },
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse2).to.deep.eq(getMock.returnValues[1])

  })



  it('should place a new Valr market order just fine', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      { id: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      placedOrder,
    )

    const placeOrderParams = {
      amount: '0.001',
      rate: '0',
      symbolPair: 'ETHZAR',
      side: AlunaSideEnum.LONG,
      type: AlunaOrderTypesEnum.MARKET,
      account: AlunaAccountEnum.EXCHANGE,
    }

    const requestBody = {
      side: ValrSideEnum.BUY,
      pair: placeOrderParams.symbolPair,
      baseAmount: placeOrderParams.amount,
    }


    // place long market order
    const placeResponse1 = await valrOrderWriteModule.place(placeOrderParams)


    expect(requestMock.callCount).to.be.eq(1)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: requestBody,
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(1)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse1).to.deep.eq(getMock.returnValues[0])


    // place short market order
    const placeResponse2 = await valrOrderWriteModule.place({
      ...placeOrderParams,
      side: AlunaSideEnum.SHORT,
    })


    expect(requestMock.callCount).to.be.eq(2)
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/market',
      body: {
        ...requestBody,
        side: ValrSideEnum.SELL,
      },
      keySecret,
    })).to.be.true

    expect(getMock.callCount).to.be.eq(2)
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: placeOrderParams.symbolPair,
    })).to.be.true

    expect(placeResponse2).to.deep.eq(getMock.returnValues[1])

  })



  it('should ensure given account is one of AlunaAccountEnum', async () => {

    const nonexistentAcc = 'nonexistent'

    ImportMock.mockOther(
      ValrSpecs,
      'accounts',
      {},
    )


    try {

      await valrOrderWriteModule.place({
        account: nonexistentAcc,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        `Account type ${nonexistentAcc} does not exists in Valr specs`,
      )

    }

  })



  it('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      ValrSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: false,
          implemented: true,
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Account type exchange not supported/implemented for Varl',
      )

    }

  })



  it('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      ValrSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: true,
          implemented: false,
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Account type exchange not supported/implemented for Varl',
      )

    }

  })



  it('should ensure given account has orderTypes property', async () => {

    ImportMock.mockOther(
      ValrSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: true,
          implemented: true,
          // missing orderTypes property
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Account type exchange not supported/implemented for Varl',
      )

    }

  })



  it('should ensure account orderTypes has given order type', async () => {

    ImportMock.mockOther(
      ValrSpecs.accounts.exchange,
      'orderTypes',
      {
        ['fake-type' as AlunaOrderTypesEnum]: {
          supported: true,
          implemented: true,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.LIMIT,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Order type limit not supported/implemented for Varl',
      )

    }

  })



  it('should ensure given order type is supported', async () => {

    ImportMock.mockOther(
      ValrSpecs.accounts.exchange,
      'orderTypes',
      {
        limit: {
          supported: false,
          implemented: true,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.LIMIT,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Order type limit not supported/implemented for Varl',
      )

    }

  })



  it('should ensure given order type is implemented', async () => {

    ImportMock.mockOther(
      ValrSpecs.accounts.exchange,
      'orderTypes',
      {
        limit: {
          supported: false,
          implemented: true,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    try {

      await valrOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: AlunaOrderTypesEnum.LIMIT,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message).to.be.eq(
        'Order type limit not supported/implemented for Varl',
      )

    }

  })



  it('should ensure an order was canceled', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
    )

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      {
        orderStatusType: 'any-status-but-canceled' as ValrOrderStatusEnum,
      } as IValrOrderGetSchema,
    )

    const cancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    try {

      await valrOrderWriteModule.cancel(cancelParams)

    } catch (error) {

      expect(requestMock.callCount).to.be.eq(1)
      expect(requestMock.calledWith({
        verb: AlunaHttpVerbEnum.DELETE,
        url: 'https://api.valr.com/v1/orders/order',
        keySecret,
        body: {
          orderId: cancelParams.id,
          pair: cancelParams.symbolPair,
        },
      })).to.be.true

      expect(getRawMock.callCount).to.be.eq(1)
      expect(getRawMock.calledWith(cancelParams)).to.be.true

      expect(error instanceof ValrError).to.be.true
      expect(error.message).to.be.eq('Something went wrong, order not canceled')
      expect(error.statusCode).to.be.eq(500)

    }

  })



  it('should cancel an open order just fine', async () => {

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
    )

    const getRawMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'getRaw',
      {
        orderStatusType: ValrOrderStatusEnum.CANCELLED,
      } as IValrOrderGetSchema,
    )

    const parseMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'parse',
      { status: AlunaOrderStatusEnum.CANCELED } as IAlunaOrderSchema,
    )

    const cancelParams = {
      id: 'order-id',
      symbolPair: 'symbol-pair',
    }

    let canceledOrder
    let error

    try {

      canceledOrder = await valrOrderWriteModule.cancel(cancelParams)

    } catch (err) {

      error = err

    }

    expect(error).to.be.undefined

    expect(parseMock.callCount).to.be.eq(1)
    expect(parseMock.calledWith({
      rawOrder: getRawMock.returnValues[0],
    })).to.be.true

    expect(canceledOrder).to.be.ok
    expect(canceledOrder).to.deep.eq(parseMock.returnValues[0])
    expect(canceledOrder?.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)

  })

})
