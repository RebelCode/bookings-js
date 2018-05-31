import Api from './Api'

export default class SessionsApi extends Api {
  /**
   * Api constructor
   *
   * @param {object} httpClient Http client like axios
   * @param {object} config
   * @param {RequestCache} cache Requests caching implementation.
   * @param {RangeCache} rangeCache Range cache implementation.
   * @param {Transformer} sessionReadTransformer Session read transformer.
   */
  constructor (httpClient, config, cache, rangeCache, sessionReadTransformer) {
    super(httpClient, config, cache)
    this.rangeCache = rangeCache
    this.sessionReadTransformer = sessionReadTransformer
  }

  /**
   * Fetch session list using search query
   *
   * @param params
   * @return {*}
   */
  fetch (params) {
    const uncachedRange = this.rangeCache.uncached(params)
    if (!uncachedRange) {
      return Promise.resolve(null)
    }
    const fetchConfig = this.config['fetch']
    return this.http[fetchConfig.method](fetchConfig.endpoint, this.prepareParams({ params })).then(response => {
      this.rangeCache.remember(uncachedRange)
      return response.data.items.map(session => {
        return this.sessionReadTransformer.transform(session)
      })
    })
  }
}
