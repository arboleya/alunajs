import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { ValrOrderStatusEnum } from '../../enums/ValrOrderStatusEnum'
import { ValrOrderTimeInForceEnum } from '../../enums/ValrOrderTimeInForceEnum'
import { ValrOrderTypesEnum } from '../../enums/ValrOrderTypesEnum'
import { ValrSideEnum } from '../../enums/ValrSideEnum'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../../schemas/IValrOrderSchema'



export const VALR_RAW_LIST_OPEN_ORDERS: IValrOrderListSchema[] = [
  {
    orderId: 'e5e92066-b230-4389-b9d2-f56d826f1066',
    side: ValrSideEnum.BUY,
    remainingQuantity: '0.001',
    price: '12000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T00:55:12.982Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    stopPrice: '10000',
    updatedAt: '2021-06-08T00:55:12.984Z',
    status: ValrOrderStatusEnum.ACTIVE,
    type: ValrOrderTypesEnum.TAKE_PROFIT_LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: 'eb47c14b-94f0-4358-a732-6f9bd70f12d6',
    side: ValrSideEnum.BUY,
    remainingQuantity: '0.001',
    price: '10000',
    currencyPair: 'BTCZAR',
    createdAt: '2021-06-08T01:47:50.350Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    updatedAt: '2021-06-08T01:47:50.351Z',
    status: ValrOrderStatusEnum.PLACED,
    type: ValrOrderTypesEnum.LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: '9481397e-ca83-4e66-af30-c9afeba35106',
    side: ValrSideEnum.SELL,
    remainingQuantity: '0.001',
    price: '80000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T01:49:08.173Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    updatedAt: '2021-06-08T01:49:08.175Z',
    status: ValrOrderStatusEnum.PLACED,
    type: ValrOrderTypesEnum.LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: 'efcb70c1-23a4-47e9-978b-0d3a9add616e',
    side: ValrSideEnum.SELL,
    remainingQuantity: '0.001',
    price: '50000',
    currencyPair: 'ETHZAR',
    createdAt: '2021-06-08T01:51:43.960Z',
    originalQuantity: '0.001',
    filledPercentage: '0.00',
    stopPrice: '32000',
    updatedAt: '2021-06-08T01:51:43.961Z',
    status: ValrOrderStatusEnum.ACTIVE,
    type: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
]



export const VALR_RAW_GET_ORDERS: IValrOrderGetSchema[] = [
  {
    orderId: '446140fa-e4c5-489c-8e43-b431e080ad35',
    orderSide: ValrSideEnum.BUY,
    orderStatusType: ValrOrderStatusEnum.ACTIVE,
    currencyPair: 'ETHZAR',
    originalPrice: '38000',
    remainingQuantity: '0.001',
    originalQuantity: '0.001',
    orderType: ValrOrderTypesEnum.STOP_LOSS_LIMIT,
    failedReason: '',
    orderUpdatedAt: '2021-06-09T13:13:29.536Z',
    orderCreatedAt: '2021-06-09T13:13:29.535Z',
    stopPrice: '40000',
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: 'f6d69359-cd93-443c-b584-42b669508424',
    orderStatusType: ValrOrderStatusEnum.PLACED,
    currencyPair: 'ETHZAR',
    originalPrice: '10000',
    remainingQuantity: '0.001',
    originalQuantity: '0.001',
    orderSide: ValrSideEnum.BUY,
    orderType: ValrOrderTypesEnum.LIMIT,
    failedReason: '',
    orderUpdatedAt: '2021-06-09T12:34:58.838Z',
    orderCreatedAt: '2021-06-09T12:34:58.836Z',
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
  {
    orderId: '7f016746-6792-4c19-8306-1f7878caadb6',
    orderStatusType: ValrOrderStatusEnum.FILLED,
    currencyPair: 'ETHZAR',
    originalPrice: '0',
    remainingQuantity: '0',
    originalQuantity: '0.001',
    orderSide: ValrSideEnum.SELL,
    orderType: ValrOrderTypesEnum.MARKET,
    failedReason: '',
    orderUpdatedAt: '2021-06-09T13:09:31.999Z',
    orderCreatedAt: '2021-06-09T13:09:31.996Z',
    timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
  },
]



export const VALR_PARSED_OPEN_ORDERS: IAlunaOrderSchema[] = [
  {
    id: 'e5e92066-b230-4389-b9d2-f56d826f1066',
    symbolPair: 'ETHZAR',
    total: 12,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 12000,
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaSideEnum.LONG,
    status: AlunaOrderStatusEnum.OPEN,
    type: AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
    placedAt: new Date('2021-06-08T00:55:12.982Z'),
    meta: {},
  },
  {
    id: 'eb47c14b-94f0-4358-a732-6f9bd70f12d6',
    symbolPair: 'BTCZAR',
    total: 10,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 10000,
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaSideEnum.LONG,
    status: AlunaOrderStatusEnum.OPEN,
    type: AlunaOrderTypesEnum.LIMIT,
    placedAt: new Date('2021-06-08T01:47:50.350Z'),
    meta: {},
  },
  {
    id: '9481397e-ca83-4e66-af30-c9afeba35106',
    symbolPair: 'ETHZAR',
    total: 80,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 80000,
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaSideEnum.SHORT,
    status: AlunaOrderStatusEnum.OPEN,
    type: AlunaOrderTypesEnum.LIMIT,
    placedAt: new Date('2021-06-08T01:49:08.173Z'),
    meta: {},
  },
  {
    id: 'efcb70c1-23a4-47e9-978b-0d3a9add616e',
    symbolPair: 'ETHZAR',
    total: 50,
    amount: 0.001,
    isAmountInContracts: false,
    rate: 50000,
    account: AlunaAccountEnum.EXCHANGE,
    side: AlunaSideEnum.SHORT,
    status: AlunaOrderStatusEnum.OPEN,
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    placedAt: new Date('2021-06-08T01:51:43.960Z'),
    meta: {},
  },
]

