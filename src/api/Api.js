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
   * @param {object} httpClient Http client like axios
   * @param {object} config
   * @param {RequestCache} cache Requests caching implementation.
   */
  constructor (httpClient, config, cache) {
    this.http = httpClient
    this.config = config
    this.cache = cache
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