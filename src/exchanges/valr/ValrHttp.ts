import axios, { AxiosError } from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { ValrLog } from './ValrLog'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}

interface IValrSignedHeaders {
  'X-VALR-API-KEY': string
  'X-VALR-SIGNATURE': string
  'X-VALR-TIMESTAMP': number
}



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  const errorMsg = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    return new AlunaError({
      message: response?.data?.message || errorMsg,
      statusCode: response?.status,
    })

  }

  return new AlunaError({
    message: param.message || errorMsg,
  })

}



export const generateAuthHeader = (
  params: ISignedHashParams,
):IValrSignedHeaders => {

  const {
    keySecret, path, verb, body,
  } = params

  ValrLog.info(JSON.stringify({
    path,
    verb,
  }))

  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha512', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'X-VALR-API-KEY': keySecret.key,
    'X-VALR-SIGNATURE': signedRequest,
    'X-VALR-TIMESTAMP': timestamp,
  }

}



export const ValrHttp: IAlunaHttp = class {

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    ValrLog.info(JSON.stringify({
      url,
      verb,
    }))

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }



  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    ValrLog.info(JSON.stringify({
      url,
      verb,
    }))

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      keySecret,
      body,
    })

    const requestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      ValrLog.info({ output: response })

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
