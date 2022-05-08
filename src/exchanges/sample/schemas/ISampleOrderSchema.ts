import { SampleOrderTypeEnum } from '../enums/SampleOrderTypeEnum'



// TODO: Describe order interface for Sample exchange
export interface ISampleOrderSchema {
  id: string
  symbol: string
  type: SampleOrderTypeEnum
  // ...
}
