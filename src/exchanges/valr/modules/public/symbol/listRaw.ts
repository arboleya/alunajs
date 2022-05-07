import debug from 'debug'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaSymbolListParams,
  IAlunaSymbolListRawReturns,
} from '../../../../../lib/modules/public/IAlunaSymbolModule'
import { IValrSymbolSchema } from '../../../schemas/IValrSymbolSchema'
import { ValrHttp } from '../../../ValrHttp'
import { valrEndpoints } from '../../../valrSpecs'



const log = debug('@alunajs:valr/symbol/listRaw')



export const listRaw = (exchange: IAlunaExchangePublic) => async (
  params: IAlunaSymbolListParams = {},
): Promise<IAlunaSymbolListRawReturns<IValrSymbolSchema[]>> => {

  log('fetching Valr raw symbols')

  const { http = new ValrHttp(exchange.settings) } = params

  const rawSymbols = await http.publicRequest<IValrSymbolSchema[]>({
    url: valrEndpoints.symbol.list,
  })

  const { requestCount } = http

  return {
    requestCount,
    rawSymbols,
  }

}
