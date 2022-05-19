import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { OkxOrderTypeEnum } from '../OkxOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToOkx,
} from './okxOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Okx order types to Aluna order types', () => {

    expect(translateOrderTypeToAluna({
      from: OkxOrderTypeEnum.LIMIT,
    })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

    expect(translateOrderTypeToAluna({
      from: OkxOrderTypeEnum.MARKET,
    })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    let result
    let error

    try {

      result = translateOrderTypeToAluna({
        from: notSupported as OkxOrderTypeEnum,
      })

    } catch (err) {

      error = err

    }

    expect(result).not.to.be.ok

    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)


  })



  it('should properly translate Aluna order types to Okx order types', () => {

    expect(translateOrderTypeToOkx({
      from: AlunaOrderTypesEnum.LIMIT,
    })).to.be.eq(OkxOrderTypeEnum.LIMIT)

    expect(translateOrderTypeToOkx({
      from: AlunaOrderTypesEnum.MARKET,
    })).to.be.eq(OkxOrderTypeEnum.MARKET)

    let result
    let error

    try {

      translateOrderTypeToOkx({
        from: notSupported as AlunaOrderTypesEnum,
      })

    } catch (err) {

      error = err

    }


    expect(result).not.to.be.ok
    expect(error instanceof AlunaError).to.be.ok
    expect(error.message)
      .to.be.eq(`Order type not supported: ${notSupported}`)

  })

})
