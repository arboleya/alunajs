import { AAlunaExchange } from '../../lib/core/abstracts/AAlunaExchange'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from '../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../lib/modules/IAlunaBalanceModule'
import { IAlunaKeyModule } from '../../lib/modules/IAlunaKeyModule'
import { IAlunaOrderWriteModule } from '../../lib/modules/IAlunaOrderModule'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { PoloniexMarketModule } from './modules/PoloniexMarketModule'
import { PoloniexSymbolModule } from './modules/PoloniexSymbolModule'
import { PoloniexLog } from './PoloniexLog'
import { PoloniexSpecs } from './PoloniexSpecs'



export const Poloniex: IAlunaExchangeStatic = class extends AAlunaExchange implements IAlunaExchange {

  // static definitions
  static readonly ID = PoloniexSpecs.id
  static readonly SPECS = PoloniexSpecs

  static Symbol = PoloniexSymbolModule
  static Market = PoloniexMarketModule

  // local definitions
  key: IAlunaKeyModule
  order: IAlunaOrderWriteModule
  balance: IAlunaBalanceModule

  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    },
  ) {

    super(params)

    // @TODO
    PoloniexLog.info('poloniex')
    // this.key = new PoloniexKeyModule({ exchange: this })
    // this.balance = new PoloniexBalanceModule({ exchange: this })
    // this.order = new PoloniexOrderWriteModule({ exchange: this })

  }

}
