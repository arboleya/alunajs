import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderCancelParams,
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderTypesSpecsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderTypeAdapter } from '../enums/adapters/ValrOrderTypeAdapter'
import { ValrSideAdapter } from '../enums/adapters/ValrSideAdapter'
import { ValrOrderStatusEnum } from '../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../enums/ValrOrderTypesEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrSpecs } from '../ValrSpecs'
import { ValrOrderReadModule } from './ValrOrderReadModule'



interface IValrPlaceOrderResponse {
  id: string
}



export class ValrOrderWriteModule extends ValrOrderReadModule implements IAlunaOrderWriteModule {

  public async place (
    params: IAlunaOrderPlaceParams,
  ): Promise<IAlunaOrderSchema> {

    const {
      amount,
      rate,
      symbolPair,
      side,
      type,
      account,
    } = params

    let supported: boolean
    let implemented: boolean | undefined
    let supportedOrderTypes: IAlunaExchangeOrderTypesSpecsSchema | undefined

    try {

      ({
        supported,
        implemented,
        orderTypes: supportedOrderTypes,
      } = ValrSpecs.accounts[account])

    } catch (error) {

      throw new AlunaError({
        message: `Account type '${account}' is not in Valr specs`,
      })

    }

    if (!supported || !implemented || !supportedOrderTypes) {

      throw new AlunaError({
        message: `Account type '${account}' not supported/implemented for Varl`,
      })

    }

    const orderType = supportedOrderTypes[type]

    if (!orderType || !orderType.implemented || !orderType.supported) {

      throw new AlunaError({
        message: `Order type '${type}' not supported/implemented for Varl`,
      })

    }

    if (orderType.mode !== AlunaFeaturesModeEnum.WRITE) {

      throw new AlunaError({
        message: `Order type '${type}' is in read mode`,
      })

    }

    const body = {
      side: ValrSideAdapter.translateToValr({ from: side }),
      pair: symbolPair,
    }

    const translatedOrderType = ValrOrderTypeAdapter.translateToValr({
      from: type,
    })

    if (translatedOrderType === ValrOrderTypesEnum.LIMIT) {

      Object.assign(body, {
        quantity: amount,
        price: rate,
        postOnly: false,
        timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
      })

    } else {

      Object.assign(body, {
        baseAmount: amount,
      })

    }

    const { id } = await ValrHttp.privateRequest<IValrPlaceOrderResponse>({
      url: `https://api.valr.com/v1/orders/${translatedOrderType}`,
      body,
      keySecret: this.exchange.keySecret,
    })

    return this.get({
      id,
      symbolPair,
    })

  }



  public async cancel (
    params: IAlunaOrderCancelParams,
  ): Promise<IAlunaOrderSchema> {

    await ValrHttp.privateRequest<void>({
      verb: AlunaHttpVerbEnum.DELETE,
      url: 'https://api.valr.com/v1/orders/order',
      keySecret: this.exchange.keySecret,
      body: {
        orderId: params.id,
        pair: params.symbolPair,
      },
    })

    const ensuredCancelled = await this.getRaw(params)

    if (ensuredCancelled.orderStatusType !== ValrOrderStatusEnum.CANCELLED) {

      throw new AlunaError({
        message: 'Something went wrong, order not canceled',
        statusCode: 500,
      })

    }

    return this.parse({
      rawOrder: ensuredCancelled,
    })

  }

}
