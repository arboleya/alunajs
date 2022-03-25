import { IAlunaMarketSchema } from '../../../../lib/schemas/IAlunaMarketSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Valr } from '../../Valr'
import { IValrMarketWithCurrencies } from '../IValrMarketSchema'



export class ValrMarketParser {

  static parse (params: {
    rawMarket: IValrMarketWithCurrencies,
  }): IAlunaMarketSchema {

    const { rawMarket } = params

    let apiRequestCount = 0

    const {
      askPrice,
      baseVolume,
      bidPrice,
      changeFromPrevious,
      highPrice,
      lastTradedPrice,
      lowPrice,
      baseCurrency,
      quoteCurrency,
      currencyPair,
    } = rawMarket

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Valr.settings.mappings,
    })

    apiRequestCount += 1

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Valr.settings.mappings,
    })

    apiRequestCount += 1

    const ticker = {
      high: parseFloat(highPrice),
      low: parseFloat(lowPrice),
      bid: parseFloat(bidPrice),
      ask: parseFloat(askPrice),
      last: parseFloat(lastTradedPrice),
      date: new Date(),
      change: parseFloat(changeFromPrevious) / 100,
      baseVolume: parseFloat(baseVolume),
      quoteVolume: 0,
    }

    const parsedMarket: IAlunaMarketSchema = {
      exchangeId: Valr.ID,
      symbolPair: currencyPair,
      baseSymbolId,
      quoteSymbolId,
      ticker,
      spotEnabled: false,
      marginEnabled: false,
      derivativesEnabled: false,
      leverageEnabled: false,
      meta: rawMarket,
    }

    return parsedMarket

  }

}
