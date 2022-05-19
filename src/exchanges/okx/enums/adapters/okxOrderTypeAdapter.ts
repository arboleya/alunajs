import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { OkxOrderTypeEnum } from '../OkxOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  OkxOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [OkxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [OkxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
  },
})



export const translateOrderTypeToOkx = buildAdapter<
  AlunaOrderTypesEnum,
  OkxOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: OkxOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: OkxOrderTypeEnum.MARKET,
  },
})
