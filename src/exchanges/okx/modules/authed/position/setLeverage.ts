import debug from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaPositionSetLeverageParams,
  IAlunaPositionSetLeverageReturns,
} from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'



const log = debug('alunajs:okx/position/setLeverage')



export const setLeverage = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaPositionSetLeverageParams,
): Promise<IAlunaPositionSetLeverageReturns> => {

  const {
    settings,
    credentials,
  } = exchange

  const {
    id,
    symbolPair,
    leverage,
    http = new OkxHttp(settings),
  } = params

  log('setting leverage', { id, symbolPair })

  // TODO: Implement proper getter
  const settedLeverage = await http.authedRequest<number>({
    credentials,
    url: getOkxEndpoints(settings).position.setLeverage,
    body: { id, symbolPair, leverage },
  })

  const { requestWeight } = http

  return {
    leverage: settedLeverage,
    requestWeight,
  }

}
