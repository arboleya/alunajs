import { debug } from 'debug'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaKeyFetchDetailsParams,
  IAlunaKeyFetchDetailsReturns,
} from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { SampleHttp } from '../../../SampleHttp'
import { sampleEndpoints } from '../../../sampleSpecs'
import { ISampleKeySchema } from '../../../schemas/ISampleKeySchema'



const log = debug('@aluna.js:sample/key/fetchDetails')



export const fetchDetails = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaKeyFetchDetailsParams = {},
): Promise<IAlunaKeyFetchDetailsReturns> => {

  log('fetching Sample key permissions')

  const { credentials } = exchange

  const { http = new SampleHttp() } = params

  // TODO: Implement proper request
  const permissions = await http.authedRequest<ISampleKeySchema>({
    verb: AlunaHttpVerbEnum.GET,
    url: sampleEndpoints.key.fetchDetails,
    credentials,
  })

  const { key } = await exchange.key.parseDetails({ rawKey: permissions })

  const { requestCount } = http

  return {
    key,
    requestCount,
  }

}
