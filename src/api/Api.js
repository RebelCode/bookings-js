import RequestCache from './RequestCache'

export default class Api {
  /**
   * Request cache, allows to cache requests result.
   *
   * @property {RequestCache}
   */
  cache

  /**
   * Api constructor
   *
   * @param httpClient {Object} Http client like axios
   * @param config
   */
  constructor (httpClient, config) {
    this.http = httpClient
    this.config = config

    this.cache = new RequestCache()
  }

  /**
   * Prepare params before submit
   *
   * @param params
   * @return {FormData}
   */
  prepareParams (params) {
    return params
  }
}