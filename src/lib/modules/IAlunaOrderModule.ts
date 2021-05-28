import { IAlunaModule } from '@lib/abstracts/IAlunaModule'
import { SideEnum } from '@lib/enums/SideEnum'

import { IAlunaOrderSchema } from '../schemas/IAlunaOrderSchema'



export interface IAlunaOrderListParams {
  openOrdersOnly: boolean
  // start?: number
  // limit?: number
}

export interface IAlunaOrderGetParams {
  id: string | number
}

export interface IAlunaOrderPlaceParams {
  side: SideEnum
  symbol: string
  rate: string | number
  amount: string | number
  // TODO: to be continued...
}



export interface IAlunaOrderModule extends IAlunaModule {

  list (params?: IAlunaOrderListParams): Promise<IAlunaOrderSchema[]>
  listRaw (params?: IAlunaOrderListParams): Promise<any[]>
  get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema>
  getRaw<T> (params: IAlunaOrderGetParams): Promise<T>
  place (params: IAlunaOrderPlaceParams): Promise<IAlunaOrderSchema>
  parse (params: { rawOrder: any }): IAlunaOrderSchema
  parseMany (parms: { rawOrders: any[] }): IAlunaOrderSchema[]

}
