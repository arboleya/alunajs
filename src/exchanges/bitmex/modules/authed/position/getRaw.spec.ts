import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { getBitmexEndpoints } from '../../../bitmexSpecs'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get raw position just fine', async () => {

    // preparing data
    const mockedRawPosition = BITMEX_RAW_POSITIONS[0]

    const { id } = mockedRawPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })

    authedRequest.returns(Promise.resolve(mockedRawPosition))


    // executing
    const exchange = new BitmexAuthed({
      credentials,
    })

    const { rawPosition } = await exchange.position!.getRaw({
      id,
      symbolPair: '',
    })


    // validating
    expect(rawPosition).to.deep.eq(mockedRawPosition)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints({}).position.get,
      body: {
        id,
        symbolPair: '',
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

  it('should throw error if position not found', async () => {

    // preparing data
    const mockedRawPosition = BITMEX_RAW_POSITIONS[0]
    const { id } = mockedRawPosition


    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitmexHttp.prototype })
    authedRequest.returns(Promise.resolve(undefined))


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getRaw({
      id,
      symbolPair: '',
    }))


    // validating
    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaPositionErrorCodes.NOT_FOUND)
    expect(error!.message).to.be.eq('Position not found')
    expect(error!.httpStatusCode).to.be.eq(200)


    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      url: getBitmexEndpoints(exchange.settings).position.get,
      body: {
        id,
        symbolPair: '',
      },
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
